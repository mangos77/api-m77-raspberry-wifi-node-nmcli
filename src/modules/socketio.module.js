// socket.js
import { Server as SocketIOServer } from 'socket.io';

let io = null;

export const initSocketIO = (server) => {
    io = new SocketIOServer(server, {
        cors: {
            origin: '*',
            methods: ['GET', 'POST']
        }
    });

    io.on('connection', (socket) => {
        console.log(`Socket conectado: ${socket.id}`);

        socket.on('mensaje', (data) => {
            console.log('Mensaje recibido vía socket:', data);
            socket.emit('respuesta', { ok: true, recibido: data });
        });

        socket.on('disconnect', () => {
            console.log(`Socket desconectado: ${socket.id}`);
        });
    });

    console.log('Socket.IO habilitado');
};

export const getSocketIO = () => {
    if (!io) {
        throw new Error("Socket.IO no ha sido inicializado aún.");
    }
    return io;
};
