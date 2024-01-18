const express = require('express')
const app = express()
const server = require('http').createServer(app);
const WebSocket = require('ws');
const path = require('path');

const wss = new WebSocket.Server({ server:server });

const port = process.env.PORT || 1235;

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/homepage.html'));
});

app.get('/admin', function(req, res) {
  res.sendFile(path.join(__dirname, '/admin.html'));
});

app.get('/index', function(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/playername', function(req, res) {
  res.sendFile(path.join(__dirname, '/playername.html'));
});

app.listen(port);

console.log('Server started at http://localhost:' + port);



wss.on('connection', function connection(wss) {
  wss.on('message', function incoming(message) {
    console.log('received: %s', message);

    wss.send('something');
    wss.id = message;
  });
});

server.listen(8080,() => console.log('Socket escuchando puerto 8080'));