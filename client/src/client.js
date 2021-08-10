'use strict'

const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const net = require('net');

const client = new net.Socket();
const users = [];
const sockets = [];

io.on("connection", socket => {
    // mantida uma estrutura que armazena os sockets para enviar as respostas para os sockets corretos
    const socketFound = sockets.find(sc => sc.id === socket.id);
    if (!socketFound) {
        console.log('Socket salvo');
        sockets.push(socket);
    }

    socket.on("getUser", userName => {
        connectToServerSocket().then(_ => {
            const message = `Consultar: ${userName}$${socket.id}`;
            client.write(message);
            socket.emit('events', 'CLIENTE: ' + message + ' ' + String(new Date()));
            console.log('Sent: ' + message);
        });
    });


    socket.on("addUser", user => {
        connectToServerSocket().then(_ => {
            const message = `Registrar: ${user.name}, ${user.ip}, ${user.port}, ${socket.id}`;
            client.write(message);
            socket.emit('events', 'CLIENTE: ' + message + ' ' + String(new Date()));
            console.log('Sent: ' + message);
        });
    });

    socket.on("removeUser", userName => {
        connectToServerSocket().then(_ => {
            const message = `Fechar conexão: ${userName}$${socket.id}`;
            client.write(message);
            socket.emit('events', 'CLIENTE: ' + message + ' ' + String(new Date()));
            console.log('Sent: ' + message);
        });
    });

    io.emit("users", users);

    console.log(`Socket ${socket.id} has connected`);
});

function connectToServerSocket() {
    return new Promise((resolve, reject) => {
        client.connect(5000, '127.0.0.1', function () {
            console.log('Connected');
            resolve();
        });
    });
}

function getSocket(socketId) {
    return sockets.find(socket => socket.id === socketId);
}

// client.destroy(); para matar conexão
client.on('data', function (data) {
    const strData = String(data);

    try {
        if (strData.startsWith('OK: Novo usuário registrado!')) {
            const userObj = strData.split('$')[1];
            const socketId = strData.split('$')[2];
            const socket = getSocket(socketId);
            const user = JSON.parse(userObj);

            users.push(user);
            socket.emit('user', user);
            socket.emit('events', 'SERVIDOR: ' + data + ' ' + String(new Date()));
            io.emit("users", users);
        } else if (strData.startsWith('OK: $Conexão encerrada')) {
            const socketId = strData.split('$')[2];
            const userName = strData.split('$')[3];
            const socket = getSocket(socketId);
            const user = users.find(u => u.name === userName);
            const userIndex = users.indexOf(user);
            users.splice(userIndex, 1);

            socket.emit('remove', userName);
            socket.emit('events', 'SERVIDOR: ' + data + ' ' + String(new Date()));
            io.emit("users", users);
        } else if (strData.startsWith('OK: ')) {
            const searchObj = strData.split('$')[1];
            const socketId = strData.split('$')[2];
            const socket = getSocket(socketId);

            socket.emit('search', searchObj);
            socket.emit('events', 'SERVIDOR: ' + data + ' ' + String(new Date()));
        } else if (strData.startsWith('Erro:')) {
            const errorMsgObject = strData.split('$')[1];
            const socketId = strData.split('$')[2];
            const socket = getSocket(socketId);

            socket.emit('events', 'SERVIDOR: ' + data + ' ' + String(new Date()));
            socket.emit('errors', errorMsgObject);
        }
    } catch (e) {
        console.log(e.message);
    }

    console.log('Received: ' + data);
});

http.listen(4444, '0.0.0.0', () => {
    console.log('Listening on port 4444');
});
