<a href="https://www.twilio.com">
  <img src="https://static0.twilio.com/marketing/bundles/marketing/img/logos/wordmark-red.svg" alt="Twilio" width="250" />
</a>

# Twilio Client Quickstart for Python

This application should give you a ready-made starting point for writing your
own voice apps with Twilio Client. Before we begin, we need to collect
all the config values we need to run the application:

| Config&nbsp;Value  | Description |
| :-------------  |:------------- |
Account&nbsp;SID | Your primary Twilio account identifier - find this [in the console here](https://www.twilio.com/console).
Auth&nbsp;Token | Used to authenticate - [just like the above, you'll find this here](https://www.twilio.com/console).
TwiML&nbsp;App&nbsp;SID | The TwiML application with a voice URL configured to access your server running this app - create one [in the console here](https://www.twilio.com//console/phone-numbers/dev-tools/twiml-apps). Also, you will need to configure the Voice "REQUEST URL" on the TwiML app once you've got your server up and running.
Twilio&nbsp;Phone&nbsp;# | A Twilio phone number in [E.164 format](https://en.wikipedia.org/wiki/E.164) - you can [get one here](https://www.twilio.com/console/phone-numbers/incoming)

## Setting Up The Python Application

This application uses the lightweight [Flask Framework](http://flask.pocoo.org/).

### Mac & Linux

Begin by creating a configuration file for your application:

```bash
cp .env.example .env
```

Edit `.env` with the four configuration parameters we gathered from above. Export
the configuration in this file as system environment variables like so on Unix
based systems:

```bash
source .env
```

### Windows (PowerShell)

Begin by creating a configuration file for your application:

```powershell
cp .env.example.ps1 .env.ps1
```

Edit `.env.ps1` with the four configuration parameters we gathered from above.
"Dot-source" the file in PowerShell like so:

```powershell
. .\.env.ps1
```

This assumes you will run the application in the same PowerShell session. If not,
edit the `.env.ps1` and uncomment the `[Environment]::SetEnvironmentVariable` calls.
After re-running the script, the environment variables will be peramently set for
your user account.

## All Platforms

Next, we need to install our depenedencies:

```bash
pip install -r requirements.txt
```

Run the application using the `python` command.

```bash
python app.py
```

Your application should now be running at http://localhost:5000.

There's just a few more steps to get Twilio's voice infrastructure talking to your server.

1. [Download and install ngrok](https://ngrok.com/download)

2. Run ngrok:

    ```bash
    ngrok http 5000
    ```

3. When ngrok starts up, it will assign a unique URL to your tunnel.
It might be something like `https://asdf456.ngrok.io`. Take note of this.

4. [Configure your TwiML app](https://www.twilio.com/console/phone-numbers/dev-tools/twiml-apps)'s
Voice "REQUEST URL" to be your ngrok URL plus `/voice`. For example:

    ![screenshot of twiml app](https://s3.amazonaws.com/com.twilio.prod.twilio-docs/images/TwilioClientRequestUrl.original.png)

You should now be ready to rock! Make some phone calls.
Open it on another device and call yourself. Note that Twilio Client requires
WebRTC enabled browsers, so Edge and Internet Explorer will not work for testing.
We'd recommend Google Chrome or Mozilla Firefox instead.

![screenshot of phone app](https://s3.amazonaws.com/com.twilio.prod.twilio-docs/images/TwilioClientQuickstart.original.png)

## License

MIT
