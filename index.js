const express = require('express')
const path = require('path')
const app = express()
const port = process.env.PORT || 4000
const server = app.listen(port, () => console.log(`Listening on port ${port}`))

var anfitrion = '';

const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});


io.on('connection', (socket) => {
  console.log(socket.id)

  socket.on('enviar-palabra-todos', (palabra, id) => {
    console.log( palabra, id )
    anfitrion = id;
    console.log( palabra, anfitrion )
    socket.broadcast.emit('palabra-recibir', palabra, id)
  })

  socket.on('letra-enviada', (letra, idjugador, usuario) => {
    console.log(letra, idjugador, usuario)
    socket.to(anfitrion).emit('letra-recibida-anfitrion', letra, idjugador, usuario)
  })

  socket.on('respuesta-anfitrion', (respuesta, idjuga) => {
    console.log(respuesta, idjuga)
    socket.to(idjuga).emit('respuesta-a-usuario', respuesta)
  });

});   

app.use(express.static(path.join(__dirname + '/public')));

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