$( document ).ready(function() {
    console.log( "ready!" );
    var socket = io.connect('http://192.168.0.120:3100');
    var redState = 0;
    var yellowState = 0;
    var greenState = 0;

    var recognition = new webkitSpeechRecognition();
    recognition.continuous = false;
    recognition.interimResults = false;
    recognition.lang = "en_US";
    recognition.onresult = function (event) {
        console.log(event);
        for (var i = event.resultIndex; i < event.results.length; ++i) {
            var speechString = '';
            if (event.results[i].isFinal) {
                speechString += event.results[i][0].transcript;

            }
        }
        socket.emit("speechAction",{speech : speechString});
    };

    $("#btnSpeechOn").click(function(){
        recognition.start();
        console.log("starting");
    });
    $("#btnSpeechOff").click(function(){
        recognition.start();
        console.log("starting");
    });
    $("#btnRed").click(function(){
        redState = redState ? 0 : 1;

        if(redState) {
            socket.emit("redLED",{state : 1})
        } else {
            socket.emit("redLED",{state : 0})
        }
    });

    $("#btnYellow").click(function(){
        yellowState = yellowState ? 0 : 1;

        if(yellowState) {
            socket.emit("yellowLED",{state : 1})
        } else {
            socket.emit("yellowLED",{state : 0})
        }
    });

    $("#btnGreen").click(function(){
        greenState = greenState ? 0 : 1;

        if(greenState) {
            socket.emit("greenLED",{state : 1})
        } else {
            socket.emit("greenLED",{state : 0})
        }
    });
    
    $('#sldrRed').change(function(){
        socket.emit("redRGB",{value : this.value})
    });
    $('#sldrGreen').change(function(){
        socket.emit("greenRGB",{value : this.value})
    });
    $('#sldrBlue').change(function(){
        socket.emit("blueRGB",{value : this.value})
    });
});
