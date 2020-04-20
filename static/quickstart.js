$(function () {
  log('Requesting Capability Token...');
  $.getJSON('/token')
    .then(function (data) {
      log('Got a token.');
      console.log('Token: ' + data.token);

      // Setup Twilio.Device
      device = new Twilio.Device(data.token, {
        // Set Opus as our preferred codec. Opus generally performs better, requiring less bandwidth and
        // providing better audio quality in restrained network conditions. Opus will be default in 2.0.
        codecPreferences: ["opus", "pcmu"],
        // Use fake DTMF tones client-side. Real tones are still sent to the other end of the call,
        // but the client-side DTMF tones are fake. This prevents the local mic capturing the DTMF tone
        // a second time and sending the tone twice. This will be default in 2.0.
        fakeLocalDTMF: true,
        // Use `enableRingingState` to enable the device to emit the `ringing`
        // state. The TwiML backend also needs to have the attribute
        // `answerOnBridge` also set to true in the `Dial` verb. This option
        // changes the behavior of the SDK to consider a call `ringing` starting
        // from the connection to the TwiML backend to when the recipient of
        // the `Dial` verb answers.
        enableRingingState: true
      });

      device.on("ready", function (device) {
        log("Twilio.Device Ready!");
        document.getElementById("call-controls").style.display = "block";
      });

      device.on("error", function (error) {
        log("Twilio.Device Error: " + error.message);
      });

      device.on("connect", function (conn) {
        log("Successfully established call!");
        document.getElementById("button-call").style.display = "none";
        document.getElementById("button-hangup").style.display = "inline";
      });

      device.on("disconnect", function (conn) {
        log("Call ended.");
        document.getElementById("button-call").style.display = "inline";
        document.getElementById("button-hangup").style.display = "none";
      });

      device.on("incoming", function (conn) {
        log("Incoming connection from " + conn.parameters.From);
        var archEnemyPhoneNumber = "+12093373517";

        if (conn.parameters.From === archEnemyPhoneNumber) {
          conn.reject();
          log("It's your nemesis. Rejected call.");
        } else {
          // accept the incoming connection and start two-way audio
          conn.accept();
        }
      });

      setClientNameUI(data.identity);
      
    })
    .catch(function (err) {
      console.log(err);
      log("Could not get a token from server!");
    });
    
  // Bind button to make call
  document.getElementById('button-call').onclick = function () {
    // get the phone number to connect the call to
    var params = {
      To: document.getElementById('phone-number').value
    };

    console.log('Calling ' + params.To + '...');
    if (device) {
      var outgoingConnection = device.connect(params);
      outgoingConnection.on("ringing", function () {
        log("Ringing...");
      });
    }
  };

  // Bind button to hangup call
  document.getElementById('button-hangup').onclick = function () {
    log('Hanging up...');
    if (device) {
      device.disconnectAll();
    }
  };

});

// Activity log
function log(message) {
  var logDiv = document.getElementById('log');
  logDiv.innerHTML += '<p>&gt;&nbsp;' + message + '</p>';
  logDiv.scrollTop = logDiv.scrollHeight;
}

// Set the client name in the UI
function setClientNameUI(clientName) {
  var div = document.getElementById('client-name');
  div.innerHTML = 'Your client name: <strong>' + clientName +
    '</strong>';
}
