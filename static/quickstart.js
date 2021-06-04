$(function () {
  var speakerDevices = document.getElementById('speaker-devices');
  var ringtoneDevices = document.getElementById('ringtone-devices');
  var outputVolumeBar = document.getElementById('output-volume');
  var inputVolumeBar = document.getElementById('input-volume');
  var volumeIndicators = document.getElementById('volume-indicators');
  var device, outgoingCall;

  log('Requesting Access Token...');
  $.getJSON('/token')
    .then(function (data) {
      log('Got a token.');
      console.log('Token: ' + data.token);

      // Setup Twilio.Device
      device = new Twilio.Device(data.token, {
        // Set Opus as our preferred codec. Opus generally performs better, requiring less bandwidth and
        // providing better audio quality in restrained network conditions.
        codecPreferences: ["opus", "pcmu"],
      });

      device.register();

      device.on("registered", function (device) {
        log("Twilio.Device Ready!");
        document.getElementById("call-controls").style.display = "block";
      });

      device.on("error", function (error) {
        log("Twilio.Device Error: " + error.message);
      });

      device.on("incoming", function (call) {
          incomingCallUI(call);
      });

      setClientNameUI(data.identity);

      device.audio.on("deviceChange", updateAllDevices.bind(device));

      // Show audio selection UI if it is supported by the browser.
      if (device.audio.isOutputSelectionSupported) {
        document.getElementById("output-selection").style.display = "block";
      }
    })
    .catch(function (err) {
      console.log(err);
      log("Error starting client!");
    });
    
  // Bind button to make call
  document.getElementById('button-call').onclick = function () {
    // get the phone number to connect the call to
    var params = {
      phone: document.getElementById('phone-number').value
    };

    console.log('Calling ' + params.phone + '...');
    if (device) {
      var outgoingCall = device.connect({params: params});
      outgoingCall.then(callEstablished);
    }
  };

  document.getElementById('get-devices').onclick = function() {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then(updateAllDevices);
  };

  speakerDevices.addEventListener("change", function () {
    var selectedDevices = [].slice
      .call(speakerDevices.children)
      .filter(function (node) {
        return node.selected;
      })
      .map(function (node) {
        return node.getAttribute("data-id");
      });

    device.audio.speakerDevices.set(selectedDevices);
  });

  ringtoneDevices.addEventListener("change", function () {
    var selectedDevices = [].slice
      .call(ringtoneDevices.children)
      .filter(function (node) {
        return node.selected;
      })
      .map(function (node) {
        return node.getAttribute("data-id");
      });

    device.audio.ringtoneDevices.set(selectedDevices);
  });

  function bindVolumeIndicators(call) {
    call.on("volume", function (inputVolume, outputVolume) {
      var inputColor = 'red';
      if (inputVolume < .50) {
        inputColor = 'green';
      } else if (inputVolume < .75) {
        inputColor = 'yellow';
      }

      inputVolumeBar.style.width = Math.floor(inputVolume * 300) + 'px';
      inputVolumeBar.style.background = inputColor;

      var outputColor = 'red';
      if (outputVolume < .50) {
        outputColor = 'green';
      } else if (outputVolume < .75) {
        outputColor = 'yellow';
      }

      outputVolumeBar.style.width = Math.floor(outputVolume * 300) + 'px';
      outputVolumeBar.style.background = outputColor;
    });
  }

  function updateAllDevices() {
    updateDevices(speakerDevices, device.audio.speakerDevices.get(), device);
    updateDevices(ringtoneDevices, device.audio.ringtoneDevices.get(), device);
  }

  function callEstablished (call) {
    call.addListener("accept", callConnected);
    call.addListener("disconnect", callDisconnected);

    document.getElementById('button-hangup').onclick = function () {
      log('Hanging up...');
      call.disconnect();
    }
  }

  function callConnected (call) {
    log("Successfully established call!");
    document.getElementById("button-call").style.display = "none";
    document.getElementById("button-hangup").style.display = "inline";
    volumeIndicators.style.display = 'block';
    bindVolumeIndicators(call);
  };

  function callDisconnected (call) {
    log("Call ended.");
    document.getElementById("button-call").style.display = "inline";
    document.getElementById("button-hangup").style.display = "none";
    volumeIndicators.style.display = 'none';
  };
});

// Update the available ringtone and speaker devices
function updateDevices(selectEl, selectedDevices, device) {
  selectEl.innerHTML = "";

  device.audio.availableOutputDevices.forEach(function (device, id) {
    var isActive = selectedDevices.size === 0 && id === "default";
    selectedDevices.forEach(function (device) {
      if (device.deviceId === id) {
        isActive = true;
      }
    });

    var option = document.createElement("option");
    option.label = device.label;
    option.setAttribute("data-id", id);
    if (isActive) {
      option.setAttribute("selected", "selected");
    }
    selectEl.appendChild(option);
  });
}

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

// Update UI when an incoming call comes in
function incomingCallUI(call) {
  log("Incoming Call from " + call.parameters.From);
  document.getElementById("incoming-call").style.display = "block";
  document.getElementById("incoming-number").innerHTML = call.parameters.From;
  document.getElementById("button-hangup-incoming").style.display = "none";
  document.getElementById('button-accept-incoming').onclick = function () {
      acceptIncomingCall(call);
  }
  document.getElementById('button-reject-incoming').onclick = function () {
      rejectIncomingCall(call);
  }
  document.getElementById('button-hangup-incoming').onclick = function () {
      hangupIncomingCall(call);
  }
  call.addListener('cancel', incomingCallDisconnected);
}

// Handle accepting, rejecting, and hanging up an incoming call
function acceptIncomingCall (call) {
  call.accept();
  log("Accepted incoming call")
  document.getElementById("button-hangup-incoming").style.display = "inline";
  document.getElementById("button-accept-incoming").style.display = "none";
  document.getElementById("button-reject-incoming").style.display = "none";
}

function rejectIncomingCall (call) {
  call.reject();
  log("Rejected incoming call")
  document.getElementById("incoming-number").innerHTML = "";
  document.getElementById("incoming-call").style.display = "none";
}

function hangupIncomingCall (call) {
  call.disconnect();
  log("Hung up incoming call")
  document.getElementById("incoming-number").innerHTML = "";
  document.getElementById("incoming-call").style.display = "none";
}
function incomingCallDisconnected (call) {
  log("Incoming call ended.");
  document.getElementById("incoming-number").innerHTML = "";
  document.getElementById("incoming-call").style.display = "none";
}; 
