<a href="https://www.twilio.com">
  <img src="https://static0.twilio.com/marketing/bundles/marketing/img/logos/wordmark-red.svg" alt="Twilio" width="250" />
</a>

# Twilio Client Quickstart for Python

![](https://github.com/TwilioDevEd/client-quickstart-python/workflows/Flask/badge.svg)

> This template is part of Twilio CodeExchange. If you encounter any issues with this code, please open an issue at [github.com/twilio-labs/code-exchange/issues](https://github.com/twilio-labs/code-exchange/issues).

## About

This application should give you a ready-made starting point for writing your own voice apps with Twilio Client. This application uses the lightweight [Flask Framework](http://flask.pocoo.org/). Once you set up the application, you will be able to make and receive calls from your browser. You will also be able to switch between audio input/output devices, and see dynamic volume levels on the call.

![screenshot of application homepage](./screenshot_on_call.png)

Implementations in other languages:

| .NET | Java | Node | PHP | Ruby |
| :--- | :--- | :----- | :-- | :--- |
| [Done](https://github.com/TwilioDevEd/client-quickstart-csharp) | [Done](https://github.com/TwilioDevEd/client-quickstart-java)  | [Done](https://github.com/TwilioDevEd/client-quickstart-node)  | [Done](https://github.com/TwilioDevEd/client-quickstart-php) | [Done](https://github.com/TwilioDevEd/client-quickstart-ruby)  |

## Set Up

### Requirements

- [Python](https://www.python.org/) **3.6**, **3.7** or **3.8** version.
- [Node](https://nodejs.org/en/), version **14.0** or above.
- [ngrok](https://ngrok.com/download)

### Twilio Account Settings

Before we begin, we need to collect all the config values we need to run the application.

| Config Value  | Description |
| :-------------  |:------------- |
`TWILIO_ACCOUNT_SID` | Your primary Twilio account identifier - find this [in the console here](https://www.twilio.com/console).
`TWILIO_TWIML_APP_SID` | The TwiML application with a voice URL configured to access your server running this app - create one [in the console here](https://www.twilio.com/console/voice/twiml/apps). Also, you will need to configure the Voice "REQUEST URL" on the TwiML app once you've got your server up and running.
`TWILIO_CALLER_ID` | A Twilio phone number in [E.164 format](https://en.wikipedia.org/wiki/E.164) - you can [get one here](https://www.twilio.com/console/phone-numbers/incoming)
`API_KEY` / `API_SECRET` | Your REST API Key information needed to create an [Access Token](https://www.twilio.com/docs/iam/access-tokens) - create [one here](https://www.twilio.com/console/project/api-keys).

### Local development

1. First, clone this repository and `cd` into it.

   ```bash
   git clone https://github.com/TwilioDevEd/client-quickstart-python.git
   cd client-quickstart-python
   ```

2. Run `make install`. This command will create a Python virtual environment, load it, and install the Python dependencies. It will also download the `@twilio/voice-sdk` npm package and create a `node_modules` directory inside the `static` directory.

   ```bash
   make install
   ```

3. Create a configuration file for your application by copying the `.env.example` file to a new file called `.env`. Then, edit the `.env` file to include your account and application details.

   ```bash
   cp .env.example .env
   ```

   See [Twilio Account Settings](#twilio-account-settings) to locate the necessary environment variables.

   #### Windows (PowerShell)

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

4. Run the application. It will run locally on port 5000.

   ```bash
   make serve
   ```

5. Navigate to [http://localhost:5000](http://localhost:5000)

6. Expose your application to the wider internet using [ngrok](https://ngrok.com/download). You can click [here](https://www.twilio.com/blog/2015/09/6-awesome-reasons-to-use-ngrok-when-testing-webhooks.html) for more details. This step **is important** and your application won't work if you only run the server on localhost.

   ```bash
   ngrok http 5000
   ```

7. When ngrok starts up, it will assign a unique URL to your tunnel.
   It might be something like `https://asdf456.ngrok.io`. Take note of this.

8. [Configure your TwiML app](https://www.twilio.com/console/voice/twiml/apps)'s
Voice "REQUEST URL" to be your ngrok URL plus `/voice`. For example:

   ![screenshot of twiml app](https://s3.amazonaws.com/com.twilio.prod.twilio-docs/images/TwilioClientRequestUrl.original.png)

   > **Note:** You must set your webhook urls to the `https` ngrok tunnel created.

You should now be ready to rock! Make some phone calls or receiving incoming calls in the application.
Note that Twilio Client requires WebRTC enabled browsers, so Edge and Internet Explorer will not work for testing.
We'd recommend Google Chrome or Mozilla Firefox instead.

![screenshot of application homepage](./screenshot_homepage.png)

When the server starts, you will be assigned a random client name, which will appear in the top left corner of the homepage. This client name is used as the identity field when generating an access token for the client, and is also used to route incoming calls to the correct client device.

You can make outbound calls by entering a phone number or a client name. If you would like to test browser-to-browser calls, open one browser page to `localhost:5000` and then stop and restart the server, which will generate a new client identity. Open a new browser to `localhost:5000`, and you should see the new client name. You can make calls between these two clients by entering one client's name in the box for making an outbound call.

![screenshot of application homepage](./screenshot_two_calls.png)

You can also receiving an incoming call to your browser by calling the Twilio number you specified as your `TWILIO_CALLER_ID` in your `.env` file.

If you see "Unknown Audio Output Device 1" in the "Ringtone" or "Speaker" devices lists, click the button below the boxes (Seeing "Unknown" Devices?) to have your browser identify your input and output devices.
![screenshot of unknown devices](./screenshot_unknown_devices.png)

### Docker

If you have [Docker](https://www.docker.com/) already installed on your machine, you can use our `docker-compose.yml` to setup your project.

1. Make sure you have the project cloned.
2. Setup the `.env` file as outlined in the [Local Development](#local-development) steps.
3. Run `docker-compose up`.
4. Follow the steps in [Local Development](#local-development) on how to expose your port to Twilio using a tool like [ngrok](https://ngrok.com/) and configure the remaining parts of your application.

### Tests

You can run the tests locally with the following command. Before running, make sure the virtual environment is activated.

```bash
source venv/bin/activate
python3 -m pytest
```

### Cloud deployment

Additionally to trying out this application locally, you can deploy it to a variety of host services. Here is a small selection of them.

Please be aware that some of these might charge you for the usage or might make the source code for this application visible to the public. When in doubt research the respective hosting service first.

| Service                           |                                                                                                                                                                                                                           |
| :-------------------------------- | :------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| [Heroku](https://www.heroku.com/) | [![Deploy](https://www.herokucdn.com/deploy/button.svg)](https://heroku.com/deploy)                                                                                                                                       |

## Resources

- The CodeExchange repository can be found [here](https://github.com/twilio-labs/code-exchange/).

## Contributing

This template is open source and welcomes contributions. All contributions are subject to our [Code of Conduct](https://github.com/twilio-labs/.github/blob/master/CODE_OF_CONDUCT.md).

## License

[MIT](http://www.opensource.org/licenses/mit-license.html)

## Disclaimer

No warranty expressed or implied. Software is as is.

[twilio]: https://www.twilio.com
