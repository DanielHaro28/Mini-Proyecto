const { log } = require('console')
const express = require('express')
const path = require('path')
const app = express()
const port = process.env.PORT || 4000
const server = app.listen(port, () => console.log(`Listening on port ${port}`))

var anfitrion = '';
let partidaEmpezada = false;
let playercont = '';
let playerList = [];
let playerstatus = [];
let usuario = '';
let connecstatus = false;

const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});


io.on('connection', (socket) => {

  socket.on('enviar-palabra-todos', (palabra, id) => {
    anfitrion = id;
    partidaEmpezada = true;
    socket.broadcast.emit('palabra-recibir', palabra, id)   
  });

  socket.on('letra-enviada', (letra, idjugador, usuario) => {
    socket.to(anfitrion).emit('letra-recibida-anfitrion', letra, idjugador, usuario)
  });

  socket.on('respuesta-anfitrion', (respuesta, idjuga) => {
    socket.to(idjuga).emit('respuesta-a-usuario', respuesta)
  });

  socket.on('ganador', (usuario) => {
    socket.broadcast.emit('ganador-a-todos', usuario)
  });

  socket.on('perdedor', (usuario) => {
    socket.to(anfitrion).emit('perdedor-a-anfitrion', usuario)
  });

  socket.on('partida-empezada', (callback) => {
    callback(partidaEmpezada)
  })

  socket.on('registro-usuario', (id) => {
    playerList.push(id);
    playerstatus.push(true);
    playercont = playerList.length;
  });

  socket.on('connect_failed', () => {
    console.log('error');
  });

  socket.on('reconnect_failed', () => {
    console.log('error');
  });

  socket.on('disconnect', () => {
    for (let i = 0; i < playerList.length; i++) {
      socket.to(playerList[i]).emit('verify', (callback) => {
        connecstatus = callback;
        if (connecstatus == null) {
          playerstatus[i] = false;
        }
      })
    }
  })
});


app.use(express.static(path.join(__dirname + '/public')));
app.use(express.static(path.join(__dirname + '/public/images')));

app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/homepage.html'));
});

app.get('/admin', function (req, res) {
  res.sendFile(path.join(__dirname, '/admin.html'));
});

app.get('/index', function (req, res) {
  res.sendFile(path.join(__dirname, '/index.html'));
});

app.get('/playername', function (req, res) {
  res.sendFile(path.join(__dirname, '/playername.html'));
});

app.get('/admingame', function (req, res) {
  res.sendFile(path.join(__dirname, '/admingame.html'));
});