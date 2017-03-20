'use strict';

var express     = require('express');
var bodyParser  = require('body-parser');
var socket      = require('socket.io');
var http        = require('http');
var HashMap     = require('hashmap');

var app  = express();
var port = process.env.PORT || 10080;
//var host = 'localhost';

app.set('port', port);

// Create HTTP server
var server = http.createServer(app);

// Listen on provided port
//server.listen(port, host);
server.listen(port);

app.io = socket(server)
app.users = new HashMap();

app.set('view engine', 'html');
app.engine('html', require('ejs').renderFile);
app.set('views', (__dirname));

// Files
app.use(express.static(require('path').join(__dirname, 'app')));
app.use('/app', express.static(__dirname + '/app'));
app.use('/socket', express.static(__dirname + '/node_modules/socket.io-client/'));

// enable parsing of application/json
app.use(bodyParser.json());

// allow CORS
app.use(function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

app.use(function (req, res, next) {
    res.locals.userCount = app.users.count();
    next();
});

// ES6: homepage
app.get('/', (request, response) => {
    response.render('index');
});

app.io.on('connection', (socket) => {
    console.log('Connected');

    socket.on('chat message', (msg) => {
        socket.broadcast.emit('chat message', msg, app.users.get(socket));
    });

    socket.on('typing', (isTyping, name) => {
        socket.broadcast.emit('typing', isTyping, name);
    });

    socket.on('new user', (user) => {
        app.users.set(socket, user);
        app.io.emit('connection on off', (app.users.count()));
    });

    socket.on('close', () => {
        console.log('socket closed (%s)', socket.id);
    });

    socket.on('disconnect', () => {
        app.users.remove(socket);
        app.io.emit('connection on off', (app.users.count()));
    });

});

module.exports = app;