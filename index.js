const { log } = require('console')
const express = require('express')
const path = require('path')
const app = express()
const port = process.env.PORT || 4000
const server = app.listen(port, () => console.log(`Listening on port ${port}`))

var anfitrion = '';
let partidaEmpezada = false;
let contadorJugadores = 0;
let listaJugadores = [];
let estadoJugador = [];
let estadoConexion = false; 

//Se crea la variable io y se le asigna el valor de la funcion socket.io y se le pasa el servidor, se le dice que acepte cualquier conexion
const io = require('socket.io')(server, {
  cors: {
    origin: '*',
  }
});

// Inicio del socket
io.on('connection', (socket) => {

  //Esta conexion es para cuando el anfitrion se conecta
  socket.on('anfitrion-conectado', (id) => {
    //Trae el id del anfitrion y lo guarda en la variable anfitrion
    anfitrion = id;
  });

  //Esta conexion es para cuando el anfitrion inicia la partida y manda la palabra a todos los jugadores
  socket.on('enviar-palabra-todos', (palabra, id) => {
    //Si la partida no ha empezado, la empieza y manda la palabra a todos los jugadores
    if (partidaEmpezada == false) {
      partidaEmpezada = true;
      socket.broadcast.emit('palabra-recibir', palabra, id)  
    } else {
      //Si otro anfitrion ya inicio la partida, le manda un mensaje al anfitrion que quiere iniciar la partida
      socket.to(id).emit('anfitrion-ya-existe', id)
    }
  });

  //Esta conexion es para cuando el jugador manda una letra al anfitrion a ser verificada
  socket.on('letra-enviada', (letra, idjugador, usuario) => {
    socket.to(anfitrion).emit('letra-recibida-anfitrion', letra, idjugador, usuario)
  });

  //Esta conexion es para cuando el anfitrion manda la letra verificada al jugador
  socket.on('respuesta-anfitrion', (respuesta, idjuga) => {
    socket.to(idjuga).emit('respuesta-a-usuario', respuesta)
  });

  //Esta conexion es para cuando uno de los jugadores gana la partida
  socket.on('ganador', (usuario) => {
    //Se reinicia las variables para que el anfitrion o otro anfitrion pueda iniciar una nueva partida
    partidaEmpezada = false;
    listaJugadores = [];
    estadoJugador = [];
    //Se emite un mensaje a todos en el cual se les dice a todos que un jugador gano
    socket.broadcast.emit('ganador-a-todos', usuario)
  });

  //Esta conexion es para cuando uno de los jugadores pierde la partida
  socket.on('perdedor', (usuario) => {
    //Se le resta uno al contador de jugadores
    contadorJugadores--;
    //Si el contador de jugadores es igual a 0, significa que todos los jugadores perdieron  
    //Se reinician lasvariables para que el anfitrion o otro anfitrion pueda iniciar una nueva partida
    if (contadorJugadores == 0) {
      partidaEmpezada = false;
      listaJugadores = [];
      estadoJugador = [];
      //Se emite un mensaje al anfitrion para que sepa que todos los jugadores perdieron
      socket.to(anfitrion).emit('partida-terminada', usuario)
    }
    //Se emite un mensaje al anfitrion para que sepa que un jugador perdio
    socket.to(anfitrion).emit('perdedor-a-anfitrion', usuario)
  });

  //Esta conexion es para que los jugadores puedan saber si ya empezo la partida
  socket.on('partida-empezada', (callback) => {
    //Se manda un callback con el valor de la variable partidaEmpezada
    callback(partidaEmpezada)
  })

  //Esta conexion se ultiliza cuando los jugarores escogen su apodo y se registra en el servidor
  socket.on('registro-usuario', (id) => {
    //Se guarda el id del jugador en listaJugadores, se le asigna un estado de true en estadoJugador y se le suma uno al contador de jugadores
    listaJugadores.push(id);
    estadoJugador.push(true);
    contadorJugadores++;
  });

  //Esta conexion se ultizia para que el anfitrion pueda saber cuantos jugadores hay en la partida
  socket.on('contador-jugadores', (callback) => {
    callback(contadorJugadores)
  });

  //Esta conexion se ultiliza para que el anfitrion pueda resetear la partida
  //Y establecer todas las variables a su estado inicial
  socket.on('reiniciar-partida', () => {
    //Se reinicia las variables para que el anfitrion o otro anfitrion pueda iniciar una nueva partida
    partidaEmpezada = false;
    listaJugadores = [];
    estadoJugador = [];
    contadorJugadores = 0;
  });

  //Esta conexion se ultiliza cuando hay una conexion fallida
  socket.on('connect_failed', () => {
    //Se registran los errores en la consola
    console.log('error');
  });

  //Esta conexion se ultiliza cuando hay una reconexion fallida
  socket.on('reconnect_failed', () => {
    //Se registran los errores en la consola
    console.log('error');
  });

  socket.on('disconnect-usuario', (usuario, id) => {
    for (let i = 0; i < listaJugadores.length; i++) {
      socket.to(listaJugadores[i]).emit('verify', (callback) => {
        estadoConexion = callback;
        if (estadoConexion == null) {
          estadoJugador[i] = false;
        }
      })
    }
  });

  //Esta conexion se ultiliza cuando alguien se desconecta del servidor
  socket.on('disconnect', () => {
    //Se busca el jugador que se desconecto en la lista de jugadores y se le cambia el estado a false
    for (let i = 0; i < listaJugadores.length; i++) {
      socket.to(listaJugadores[i]).emit('verify', (callback) => {
        estadoConexion = callback;
        if (estadoConexion == null) {
          estadoJugador[i] = false;
        }
      })
    }
  })
});

//Se le dice al servidor que use el directorio public
app.use(express.static(path.join(__dirname + '/src/public')));

//Se le dice al servidor que use el directorio public/images
app.use(express.static(path.join(__dirname + '/src/public/images')));

//Se le dice al servidor que use caundo se haga una peticion a la ruta /, se devuelva el archivo homepage.html
app.get('/', function (req, res) {
  res.sendFile(path.join(__dirname, '/src/homepage.html'));
});

//Se le dice al servidor que use caundo se haga una peticion a la ruta /admin, se devuelva el archivo admin.html
app.get('/admin', function (req, res) {
  res.sendFile(path.join(__dirname, '/src/admin.html'));
});

//Se le dice al servidor que use caundo se haga una peticion a la ruta /index, se devuelva el archivo index.html
app.get('/index', function (req, res) {
  res.sendFile(path.join(__dirname, '/src/index.html'));
});

//Se le dice al servidor que use caundo se haga una peticion a la ruta /playername, se devuelva el archivo playername.html
app.get('/playername', function (req, res) {
  res.sendFile(path.join(__dirname, '/src/playername.html'));
});

//Se le dice al servidor que use caundo se haga una peticion a la ruta /admingame, se devuelva el archivo admingame.html
app.get('/admingame', function (req, res) {
  res.sendFile(path.join(__dirname, '/src/admingame.html'));
});