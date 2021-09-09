'use strict'

/*
Script responsável pela comunicação via socket tcp com a implementação de servidor realizada em servidor.py,
e pela comunicação com a aplicação de frontend.

Recebe as comunicações do frontend via WebSocket na porta 4444, e se comunica com o backend pela porta 5000.
*/

/* Importações */
const call = require('./call_functions');
const fs = require('fs');
const app = require('express')();
const https = require('https').createServer({
    key: fs.readFileSync('server.key'),
    cert: fs.readFileSync('server.cert')
}, app);
const io = require('socket.io')(https);
const net = require('net');
const { spawn } = require("child_process");
const process = require('process');

app.get('/', (req, res) => {
    res.send('Hello HTTPS!')
});

/* REGIÃO 1 - INÍCIO DO PROCESSO SERVIDOR */
/* Região responsável por iniciar o processo servidor (arquivo servidor.py) e encerrá-lo quando o script for encerrado */

/* Finaliza o processo servidor.py ao receber o SIGINT para encerrar o script */
if (process.platform === "win32") {
    var rl = require("readline").createInterface({
        input: process.stdin,
        output: process.stdout
    });

    rl.on("SIGINT", function () {
        process.emit("SIGINT");
    });
}

process.on("SIGINT", function () {
    console.log('Encerrando');
    pythonServer.kill('SIGINT');
    process.exit();
});

/* Inicialização do processo servidor.py */
const pythonServer = spawn("python3", ["servidor.py"]);

/* Listeners responsáveis por escutar os eventos do processo servidor.py e imprimí-los no console */
pythonServer.stdout.on("data", data => {
    console.log(`servidor.py stdout: ${data}`);
});

pythonServer.stderr.on("data", data => {
    console.log(`servidor.py stderr: ${data}`);
});

pythonServer.on('error', (error) => {
    console.log(`servidor.py error: ${error.message}`);
});

pythonServer.on("close", code => {
    console.log(`servidor.py :child process exited with code ${code}`);
});
/* FIM - REGIÃO 1 */

/* REGIÃO 2 - Escuta dos Websockets */
/* Região responsável por gerenciar as conexões de WebSocket entre o script js e a aplicação de frontend */
/* Neste conexto, a variável sockets se refere aos WebSockets e não ao socket que se comunica com servidor.py */
const client = new net.Socket();
const users = [];
const sockets = [];

/* Listener das conexões de WebSocket com o frontend, o evento "connection" é disparado sempre que uma nova conexão com o frontend é iniciada */
io.on("connection", socket => {
    /* Mantida uma estrutura que armazena os sockets para enviar as respostas para os sockets corretos */
    const socketFound = sockets.find(sc => sc.id === socket.id);
    if (!socketFound) {
        console.log('Socket salvo');
        sockets.push(socket);
    }

    /* Apaga o websocket da estrutura de sockets quando há uma desconexão com o frontend (caso de o usuário fechar a janela do Browser) */
    socket.on("disconnect", (reason) => {
        let index = sockets.indexOf(socket);
        const disconnectedUser = users.find(u => u.socketId === socket.id);

        if (index !== -1) {
            sockets.splice(index, 1);
        }

        if (disconnectedUser) {
            connectToServerSocket().then(_ => {
                const message = `Fechar conexão: ${disconnectedUser.name}$${socket.id}`;
                client.write(message);
                console.log('Sent: ' + message);
            });
        }

        console.log(`Socket ${socket.id} has disconnected`);
    });

    /* Faz uma chamada ao servidor.py via socket tcp para buscar um usuário pelo seu nome */
    socket.on("getUser", userName => {
        connectToServerSocket().then(_ => {
            const message = `Consultar: ${userName}$${socket.id}`;
            client.write(message);
            socket.emit('events', 'CLIENTE: ' + message + ' ' + String(new Date()));
            console.log('Sent: ' + message);
        });
    });

    /* Faz uma chamada ao servidor.py via socket tcp para criar um novo usuário */
    socket.on("addUser", user => {
        connectToServerSocket().then(_ => {
            const message = `Registrar: ${user.name}, ${user.ip}, ${user.port}, ${socket.id}`;
            client.write(message);
            socket.emit('events', 'CLIENTE: ' + message + ' ' + String(new Date()));
            console.log('Sent: ' + message);
        });
    });

    /* Faz uma chamada ao servidor.py via socket tcp para remover um usuário e encerrar sua conexão/sessão */
    socket.on("removeUser", userName => {
        connectToServerSocket().then(_ => {
            const message = `Fechar conexão: ${userName}$${socket.id}`;
            client.write(message);
            socket.emit('events', 'CLIENTE: ' + message + ' ' + String(new Date()));
            console.log('Sent: ' + message);
        });
    });

    socket.on("voice", data => call.handleVoiceData(data));

    socket.on("makeInvite", invite => {
        const socketToEmit = getSocketByUsername(invite.username);

        socketToEmit.emit('inviteReceived', { host: invite.host, username: invite.username });
    });

    socket.on("respondInvite", invite => {
        const socketToEmit = getSocketByUsername(invite.host);

        socketToEmit.emit('inviteResponded', invite.receiveCall);
    });

    socket.on("endCall", ending => {
        const socketToEmitHost = getSocketByUsername(ending.host);
        const socketToEmitUsername = getSocketByUsername(ending.username);

        socketToEmitHost.emit('callEnded', true);
        socketToEmitUsername.emit('callEnded', true);
    });

    /* As emissões de evento feitas pelo objeto io funcionam como broadcast,
    são enviadas à todos os WebSockets, esta no caso sempre é enviada no início de uma conexão
    para que o frontend conheça todos os usuários cadastrados
     */
    io.emit("users", users);

    console.log(`Socket ${socket.id} has connected`);
});

/* Inicia conexão com o servidor.py via socket tcp */
function connectToServerSocket() {
    return new Promise((resolve, reject) => {
        client.connect(5000, '127.0.0.1', function () {
            console.log('Connected');
            resolve();
        });
    });
}

function getSocketByUsername(username) {
    return sockets.find(socket => socket.id === users.find(user => user.name === username).socketId);
}
exports.getSocketByUsername = getSocketByUsername;

/* Buscar por um WebSocket armazenado no array sockets pelo seu id */
function getSocket(socketId) {
    return sockets.find(socket => socket.id === socketId);
}

/* Listener das conexões via socket tcp com o servidor.py */
client.on('data', function (data) {
    const strData = String(data);

    try {
        if (strData.startsWith('OK: Novo usuário registrado!')) {
            const userObj = strData.split('$')[1];
            const socketId = strData.split('$')[2];
            const socket = getSocket(socketId);
            const user = JSON.parse(userObj);
            user['socketId'] = socketId;

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

            if (socket) {
                socket.emit('remove', userName);
                socket.emit('events', 'SERVIDOR: ' + data + ' ' + String(new Date()));
            }
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

/* Listener das conexões http com o frontend, porta de entrada do client.js com o frontend */
https.listen(4444, '0.0.0.0', () => {
    console.log('Listening on port 4444');
});
