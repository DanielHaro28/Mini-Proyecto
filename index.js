const express = require('express')
const app = express()
const server = require('http').createServer(app);
const WebSocket = require('ws');
const path = require('path');

const wss = new WebSocket.Server({ server:server });

 var Clients = [];

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

app.get('/admingame', function(req, res) {
  res.sendFile(path.join(__dirname, '/admingame.html'));
});

app.listen(port);

console.log('Server started at http://localhost:' + port);



wss.on('connection', function connection(wss) {
     Clients.push(wss);
     for( let i = 0 ; i < Clients.length ; i++){
      console.log("Yo soy el numero:" + Clients[i] + "y estoy en la posición  " +  i)
    }

     wss.on('message', function incoming(message) {
      if (message != "start") {
        for (var i in Clients) {
          Clients[i].send(message);
        }
      }

    });
});



server.listen(8080,() => console.log('Socket escuchando puerto 8080'));