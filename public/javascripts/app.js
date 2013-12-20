$( document ).ready(function() {
    console.log( "ready!" );
    //var socket = io.connect('http://192.168.0.120:3100');
    var socket = io.connect('http://12.109.108.100:3100');
    var redState = 0;
    var yellowState = 0;
    var greenState = 0;
    var orientation = false;
    if (window.DeviceOrientationEvent) {
        window.addEventListener('deviceorientation', function(eventData) {            
          var gamma = eventData.gamma;
          var beta = eventData.beta;
          var alpha = eventData.alpha;
          if (orientation){
            socket.emit("orientationHandler", {alpha : alpha, gamma : gamma, beta : beta});
          }
        }, false);
    }
    else {
        console.log("DeviceOrientation is NOT supported");
        }
    var recognition = new webkitSpeechRecognition();
    var ignore_onend;
    var final_transcript = '';
    var recognizing = false;
    var start_timestamp;
    recognition.continuous = true;
    recognition.interimResults = true;
    recognition.lang = "en_US";

  recognition.onstart = function() {
    recognizing = true;
    console.log('info_speak_now');
    imgMic.src = '/images/mic-animate.gif';
  };

  recognition.onerror = function(event) {
    if (event.error == 'no-speech') {
      imgMic.src = '/images/mic.gif';
      console.log('info_no_speech');
      ignore_onend = true;
    }
    if (event.error == 'audio-capture') {
      imgMic.src = '/images/mic.gif';
      console.log('info_no_microphone');
      ignore_onend = true;
    }
    if (event.error == 'not-allowed') {
      if (event.timeStamp - start_timestamp < 100) {
        console.log('info_blocked');
      } else {
        console.log('info_denied');
      }
      ignore_onend = true;
    }
  };

  recognition.onend = function() {
    recognizing = false;
    if (ignore_onend) {
      return;
    }
    imgMic.src = '/images/mic.gif';
    if (!final_transcript) {
      console.log('info_start');
      return;
    }
    console.log('');
   
  };

  recognition.onresult = function(event) {
    var interim_transcript = '';
    for (var i = event.resultIndex; i < event.results.length; ++i) {
      if (event.results[i].isFinal) {
        interim_transcript += event.results[i][0].transcript;
      } else {
        interim_transcript += event.results[i][0].transcript;
      }
    }
    socket.emit("speechAction",{speech : interim_transcript});
   
  };
  function startSpeech(event) {
      if (recognizing) {
        recognition.stop();
        return;
      }
      final_transcript = '';
      recognition.start();
      ignore_onend = false;
      imgMic.src = '/images/mic-slash.gif';
      console.log('info_allow');
      start_timestamp = event.timeStamp;
    }
    $("#btnSpeechOn").click(function(){
        recognition.start();
        console.log("starting");
    });
    $("#btnSpeechOff").click(function(){
        recognition.stop();
        console.log("stopping");
    });
    $("#btnRed").click(function(){
        redState = redState ? 0 : 1;

        if(redState) {
            socket.emit("redLED",{state : 1});
        } else {
            socket.emit("redLED",{state : 0});
        }
    });
    $("#btnMic").click(function(){
         if (recognizing) {
        recognition.stop();
        return;
      }
      final_transcript = '';
      recognition.start();
      ignore_onend = false;
      imgMic.src = '/images/mic-slash.gif';
      console.log('info_allow');
      start_timestamp = event.timeStamp;
    });
    $("#btnYellow").click(function(){
        yellowState = yellowState ? 0 : 1;

        if(yellowState) {
            socket.emit("yellowLED",{state : 1});
        } else {
            socket.emit("yellowLED",{state : 0});
        }
    });

    $("#btnGreen").click(function(){
        greenState = greenState ? 0 : 1;

        if(greenState) {
            socket.emit("greenLED",{state : 1});
        } else {
            socket.emit("greenLED",{state : 0});
        }
    });
    $("#btnOrientationOn").click(function(){
        orientation = true;
    });
    $("#btnOrientationOff").click(function(){
       orientation = false;
    });
    
    $('#sldrRed').change(function(){
        socket.emit("redRGB",{value : this.value});
    });
    $('#sldrGreen').change(function(){
        socket.emit("greenRGB",{value : this.value});
    });
    $('#sldrBlue').change(function(){
        socket.emit("blueRGB",{value : this.value});
    });
    
});
