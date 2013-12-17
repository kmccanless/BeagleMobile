$( document ).ready(function() {
    console.log( "ready!" );
    var socket = io.connect('http://192.168.0.120:3100');
    var redState = 0;
    var yellowState = 0;
    var greenState = 0;


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
});
