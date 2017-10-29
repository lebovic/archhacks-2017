var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var dgram = require('dgram');
var ip = require('ip');
var io = require('socket.io')(server);
var server = require('http').createServer(app); //creates an HTTP server instance

var index = require('./routes/index');
var users = require('./routes/users');
// var api = require('./routes/api');
var config = require('./config/config');

var connection = config.mongoConnection;
if (process.env.NODE_ENV === 'development') {
  console.log("Connecting to local database...");
  connection = 'mongodb://localhost/bm';
}
mongoose.connect(connection, function(err) {
  if (err) {
    console.log('Could not connect to MongoDB database', err);
  } else {
    console.log('Connected to MongoDB database');
  }
});

var app = express();

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');

// uncomment after placing your favicon in /public
//app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));
app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', index);
app.use('/users', users);
// app.use('/api', api);

// catch 404 and forward to error handler
app.use(function(req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});

// UDP socket for hardware
var PORT = 6419;
var HOST = ip.address();

var dragonServer = dgram.createSocket('udp4');

dragonServer.on('listening', function () {
    var address = dragonServer.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

dragonServer.on('message', function (message, remote) {

   var trimStr = message.toString().trim();

   if (trimStr[0] == '0') {
    // swtich colors
    var isOn = parseInt(trimStr.substring(2,trimStr.length));
    if (isOn) {
      // only send socket when turned on
      io.emit('nextColor',{});
    }

   } else if (trimStr[0] == '1') {
    // light change
    // console.log(trimStr.substring(2,trimStr.length));
    var lightLevel = parseFloat(trimStr.substring(2,trimStr.length)) * 2.5;

    // console.log("----" + lightLevel);
    lightLevel = Math.max(0, lightLevel);
    lightLevel = Math.min(100, lightLevel);
    lightLevel = Math.floor(lightLevel);

 console.log("Light Level: [" + lightLevel + " of 100]");

    io.emit('lightLevel',{"level": lightLevel});
   }

});

dragonServer.bind(PORT, HOST);

module.exports = app;
