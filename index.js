const express = require('express')
const app = express()
const server = require('http').createServer(app);
const WebSocket = require('ws');
const path = require('path');

const wss = new WebSocket.Server({ server:server });

const port = process.env.PORT || 8080;

app.get('/', function(req, res) {
  res.sendFile(path.join(__dirname, '/homepage.html'));
});

app.get('/admin', function(req, res) {
  res.sendFile(path.join(__dirname, '/admin.html'));
});

app.get('/index', function(req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/index', function(req, res) {
  res.sendFile(path.join(__dirname, '/juego.js'));
});


app.listen(port);
console.log('Server started at http://localhost:' + port);

//app.get('/.' ,(req, res) => res.send('Hello Word'));
//server.listen(8080,() => console.log('escuchando en el puerto 8080'))