
/**
 * Module dependencies.
 */

var express = require('express');
var routes = require('./routes');
var http = require('http');
var path = require('path');
var b = require('bonescript');

var app = express();


var redLED = "P8_17";
var greenLED = "P8_16";
var yellowLED = "P8_15";

b.pinMode(redLED, b.OUTPUT);
b.pinMode(greenLED, b.OUTPUT);
b.pinMode(yellowLED, b.OUTPUT);
// all environments
app.set('port', process.env.PORT || 3000);
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



io.sockets.on("connection",function(socket){
    socket.on('redLED', function (data) {
        if(data.state == 1) {
            b.digitalWrite(redLED, b.HIGH);
        } else {
            b.digitalWrite(redLED, b.LOW);
        }


    });

    socket.on('greenLED', function (data) {
        if(data.state == 1) {
            b.digitalWrite(greenLED, b.HIGH);
        } else {
            b.digitalWrite(greenLED, b.LOW);
        }
    });

    socket.on('yellowLED', function (data) {
        if(data.state == 1) {
            b.digitalWrite(yellowLED, b.HIGH);
        } else {
            b.digitalWrite(yellowLED, b.LOW);
        }
    });

});

console.log("Server listening on " + app.get('port'));

