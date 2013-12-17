
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var b = require('bonescript');

var app = express();

//setup the LEDs
var redLED = "P8_17";
var greenLED = "P8_16";
var yellowLED = "P8_15";

b.pinMode(redLED, b.OUTPUT);
b.pinMode(greenLED, b.OUTPUT);
b.pinMode(yellowLED, b.OUTPUT);


//setup the RGB LED
var redRGB = "P8_13";
var greenRGB = "P8_19";
var blueRGB = "P9_14";

b.pinMode(redRGB, b.OUTPUT);
b.pinMode(greenRGB, b.OUTPUT);
b.pinMode(blueRGB, b.OUTPUT);

b.analogWrite(redRGB,0);
b.analogWrite(greenRGB,0);
b.analogWrite(blueRGB,0);

// all environments
app.set('port', process.env.PORT || 3100);
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');
app.use(express.favicon());
app.use(express.logger('dev'));
app.use(express.json());
app.use(express.urlencoded());
app.use(express.methodOverride());
app.use(app.router);
app.use(express.static(path.join(__dirname, 'public')));

// development only
if ('development' == app.get('env')) {
  app.use(express.errorHandler());
}

app.get('/', routes.index);

var server = app.listen(app.get('port'));
var io = require('socket.io').listen(server);

io.enable('browser client etag');
io.set('log level', 3);

io.set('transports', [
'websocket'
, 'flashsocket'
, 'htmlfile'
, 'xhr-polling'
, 'jsonp-polling'
]);


io.configure('development', function(){
  io.set('transports', ['websocket']);
});


io.sockets.on("connection",function(socket){
    socket.on('redLED', function (data) {
        if(data.state == 1) {
            console.log("red on");
            b.digitalWrite(redLED, b.HIGH);
        } else {
            console.log("red off");
            b.digitalWrite(redLED, b.LOW);
        }


    });

    socket.on('greenLED', function (data) {
        if(data.state == 1) {
            console.log("green on");
            b.digitalWrite(greenLED, b.HIGH);
        } else {
            console.log("green off");
            b.digitalWrite(greenLED, b.LOW);
        }
    });

    socket.on('yellowLED', function (data) {
        if(data.state == 1) {
            console.log("yellow on");
            b.digitalWrite(yellowLED, b.HIGH);
        } else {
            console.log("yellow off");
            b.digitalWrite(yellowLED, b.LOW);
        }
    });
    
    socket.on('redRGB', function (data) {
        console.log("redRGB value is " + data.value);
        b.analogWrite(redRGB, (data.value/100));
    });
    socket.on('greenRGB', function (data) {
        console.log("greenRGB value is " + data.value);
        b.analogWrite(greenRGB, (data.value/100));
    });
    socket.on('blueRGB', function (data) {
        console.log("blueRGB value is " + data.value);
        b.analogWrite(blueRGB, (data.value/100));
    });

});

console.log("Server listening on " + app.get('port'));

