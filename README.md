# Mini-Proyecto

Usar el comando "npm start" para inicar el juego, si no inicia bajo este comando usar "node index.js"

Si por algun motivo no se obtiene la palabra al darle al boton esperar un poco a que de respuesta.

El juego esta funcionando si se realizan las rondas normalmente, 
pero si los usuarios se desconectan por algun motivo, quizas la partida quede bloqueada,
se resuelve cerrando el servidor y iniciandolo de nuevo.

El juego funciona asi:

Entras en la pagina principal y eligues si quieres ser administrador o jugador

-Administrador (anfitrion): tienes que generar la palabra y enviarsela a los jugadores
al momento que los jugadores te manden la letra se habilita el boton de "siguiente" al darle
obtienes la letra que mando un usuario, evaluas si esta bien o mala y le das al boton de "buena" o 
"mala" mientras haya letras a verificar el boton de siguiente va a estar activado, si algun usuario gana
te llegara un mensaje, y si todos pierden igual, en este momento de habilitara el boton de reiniciar que 
reiniciara la sala para empezar otra partida.

-Jugador: Al llegar a la pantalla del juego en la barra lateral izquierda vas a tener el campo para poner tu apodo
para el juego, tendras un status para saber si el juego inicio, al iniciar la partida tendras que presionar uno
de los botones de letras y esperar la respuesta del anfitrion, si la respuesta es buena veras reflejado el cambio en 
la palabra, si es mala se empezara a contar los fallos que se representan con el dibujo y el numero, tambien se bloqueara 
por esta partida el boton usuado. Al ganar o perder la partida aparecera un boton de jugar de nuevo, pulsalo por si quieres 
jugar otra vez.

Si por algun motivo no inicia a la primera verificar que este en la carpeta del juego.

![image](https://github.com/DanielHaro28/Mini-Proyecto/assets/149003502/acdc0f1d-edc6-4584-9ef4-3cc22cc593e5)

Preferiblemente usar este link para clonarlo en otro codespace

Si usa otro metodo exotico para clonar el reposito usar y no sirven estos comandos estas son las instalaciones que hice:

npm i ws

$ npm install express --save (Yo use guardando los archivos de express, si este comando no funciona usar npm install express)

npm install socket.io

npm install socket.io-client



Depencias ultizadas:
    "express": "^4.18.2",
    "socket.io": "^4.7.4",
    "socket.io-client": "^4.7.4",
    "ws": "^8.16.0"

    
