import { io } from 'socket.io-client';
    
const socket = io('http://localhost:4000');

socket.on('connect', () => {
    displayMessage('You are connected with socket id: ' + socket.id);
});