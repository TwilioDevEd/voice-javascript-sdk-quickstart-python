#!/usr/bin/env python

import os
import re
from flask import Flask, jsonify, request, Response
from faker import Faker
from twilio.jwt.access_token import AccessToken
from twilio.jwt.access_token.grants import VoiceGrant
from twilio.twiml.voice_response import VoiceResponse, Dial

from dotenv import load_dotenv
load_dotenv()

app = Flask(__name__)
fake = Faker()
alphanumeric_only = re.compile('[\W_]+')
phone_pattern = re.compile(r"^[\d\+\-\(\) ]+$")


@app.route('/')
def index():
    return app.send_static_file('index.html')


@app.route('/token', methods=['GET'])
def token():
    # get credentials for environment variables
    account_sid = os.environ['TWILIO_ACCOUNT_SID']
    auth_token = os.environ['TWILIO_AUTH_TOKEN']
    application_sid = os.environ['TWILIO_TWIML_APP_SID']
    api_key = os.environ['API_KEY']
    api_secret = os.environ['API_SECRET']

    # Generate a random user name
    identity = alphanumeric_only.sub('', fake.user_name())
    
    # Create access token with credentials
    token = AccessToken(account_sid, api_key, api_secret, identity=identity)

    # Create a Voice grant and add to token
    voice_grant = VoiceGrant(
        outgoing_application_sid=application_sid,
        incoming_allow=True,
    )
    token.add_grant(voice_grant)

    # Return token info as JSON
    token=token.to_jwt()


    # Return token info as JSON
    return jsonify(identity=identity, token=token.decode('utf-8'))


@app.route("/voice", methods=['POST'])
def voice():
    resp = VoiceResponse()
    if "To" in request.form and request.form["To"] != '':
        dial = Dial(caller_id=os.environ['TWILIO_CALLER_ID'])
        # wrap the phone number or client name in the appropriate TwiML verb
        # by checking if the number given has only digits and format symbols
        if phone_pattern.match(request.form["To"]):
            dial.number(request.form["To"])
        else:
            dial.client(request.form["To"])
        resp.append(dial)
    else:
        resp.say("Thanks for calling!")

    return Response(str(resp), mimetype='text/xml')


if __name__ == '__main__':
    app.run(debug=True)
