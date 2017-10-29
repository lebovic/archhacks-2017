var express = require('express');
var app = express();

var path = require('path');
var favicon = require('serve-favicon');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');
var server = require('http').createServer(app); //creates an HTTP server instance
var io = require('socket.io')(server);

// var server = require('http').createServer(app);
// var io = require('socket.io').listen(server);

var dgram = require('dgram');
var ip = require('ip');

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

// Socket.io Connection
var count = 0;
io.on('connection', function(socket){
  count++;
  console.log('a user connected');
  socket.on('disconnect', function(){
    console.log('user disconnected');
    count--;
  });
});

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

// ------------ Server Setup --------------//

/**
 * Get port from environment and store in Express.
 */

// Change Port here
// process.env.PORT used with services like Azure or AWS who give port
var port = normalizePort(process.env.PORT || '3000');
app.set('port', port);

/**
 * Listen on provided port, on all network interfaces.
 */

server.listen(port);
server.on('error', onError);
server.on('listening', onListening);

/**
 * Normalize a port into a number, string, or false.
 */

function normalizePort(val) {
  var port = parseInt(val, 10);
  if (isNaN(port)) {
    // named pipe
    return val;
  }
  if (port >= 0) {
    // port number
    return port;
  }
  return false;
}

/**
 * Event listener for HTTP server "error" event.
 */

function onError(error) {
  if (error.syscall !== 'listen') {
    throw error;
  }

  var bind = typeof port === 'string'
    ? 'Pipe ' + port
    : 'Port ' + port;

  // handle specific listen errors with friendly messages
  switch (error.code) {
    case 'EACCES':
      console.error(bind + ' requires elevated privileges');
      process.exit(1);
      break;
    case 'EADDRINUSE':
      console.error(bind + ' is already in use');
      process.exit(1);
      break;
    default:
      throw error;
  }
}

/**
 * Event listener for HTTP server "listening" event.
 */

function onListening() {
  var addr = server.address();
  var bind = typeof addr === 'string'
    ? 'pipe ' + addr
    : 'port ' + addr.port;
  console.log('Listening on ' + bind);
}


// UDP socket for hardware
var PORT = 6419;
var HOST = ip.address();

var dragonServer = dgram.createSocket('udp4');

dragonServer.on('listening', function () {
    var address = dragonServer.address();
    console.log('UDP Server listening on ' + address.address + ":" + address.port);
});

var lastAccelX = 0;
var lastAccelY = 0;
var lastAccelZ = 0;

dragonServer.on('message', function (message, remote) {

	var trimStr = message.toString().trim();

	var x = trimStr.substring(0, trimStr.indexOf(":"));
	var y = trimStr.substring(trimStr.indexOf(":")+1, trimStr.lastIndexOf(":"));
	var z = trimStr.substr(trimStr.lastIndexOf(":")+1);
	console.log("x y z", x, y, z);
	// if (Math.abs(x - lastAccelX) > 2 &&
	// 	Math.abs(y - lastAccelY) > 2 &&
	// 	Math.abs(z - lastAccelZ) > 2 ) {
	// 	io.emit('earthquake', {"data": 0});
	// }
	if ( x > 1.4 && y > 1.4 && z > 1.4 ) {
		console.log("SEND");
		io.emit('earthquake', {"data": 0});
	}

	lastAccelX = x;
	lastAccelY = y;
	lastAccelZ = z;
});

dragonServer.bind(PORT, HOST);
