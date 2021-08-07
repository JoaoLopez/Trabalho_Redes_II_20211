const app = require('express')();
const http = require('http').Server(app);
const io = require('socket.io')(http);
const net = require('net');

const client = new net.Socket();
const users = {};

io.on("connection", socket => {
    let previousId;

    // como não haverá edit, talvez não seja necessário
    const safeJoin = currentId => {
        socket.leave(previousId);
        socket.join(currentId, () => console.log(`Socket ${socket.id} joined room ${currentId}`));
        previousId = currentId;
    };

    socket.on("getUser", userId => {
        safeJoin(userId);
        socket.emit("user", users[userId]);
    });


    socket.on("addUser", doc => {
        users[doc.id] = doc;
        safeJoin(doc.id);
        io.emit("users", Object.keys(users));
        socket.emit("user", doc);
    });

    // TODO: refatorar para removeUser
    socket.on("editUser", doc => {
        users[doc.id] = doc;
        socket.to(doc.id).emit("user", doc);
    });

    io.emit("users", Object.keys(users));

    /* client.connect(8484, '127.0.0.1', function () {
        console.log('Connected');
        client.write('Hello, server! Love, Client.');
    });

    client.on('data', function (data) {
        console.log('Received: ' + data);
        // client.destroy();
    }); */

    console.log(`Socket ${socket.id} has connected`);
});

http.listen(4444, '0.0.0.0', () => {
    console.log('Listening on port 4444');
});
