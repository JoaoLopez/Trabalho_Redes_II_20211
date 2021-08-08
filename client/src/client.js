const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const net = require('net');

const client = new net.Socket();
const users = [{ name: '1234', ip: '1234', port: 1234 }];
const sockets = [];

io.on("connection", socket => {
    // mantida uma estrutura que armazena os sockets para enviar as respostas para os sockets corretos
    const socketFound = sockets.find(sc => sc.id === socket.id);
    if (!socketFound) {
        console.log('Socket salvo');
        sockets.push(socket);
    }

    // TODO: aplicar regra de usuário não existente
    socket.on("getUser", userId => {
        socket.emit("user", users[userId]);
    });


    socket.on("addUser", user => {
        connectToServerSocket().then(_ => {
            client.write(`Registrar: ${user.name}, ${user.ip}, ${user.port}`);
        });
    });

    // TODO: refatorar para removeUser
    socket.on("editUser", doc => {
        users[doc.id] = doc;
        socket.to(doc.id).emit("user", doc);
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

// client.destroy(); para matar conexão
client.on('data', function (data) {
    const socket = sockets[0];
    const strData = String(data);

    try {
        if (strData.startsWith('OK: Novo usuário registrado! ')) {
            userObj = strData.split('OK: Novo usuário registrado! ')[1];
            const user = JSON.parse(userObj);
            users.push(user);
            socket.emit('user', user);
            io.emit("users", users);
        }
    } catch (e) {
        console.log(e.message);
    }

    console.log('Received: ' + data);
});

http.listen(4444, '0.0.0.0', () => {
    console.log('Listening on port 4444');
});
