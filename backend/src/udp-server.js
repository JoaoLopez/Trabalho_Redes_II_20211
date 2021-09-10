var udp = require('dgram');

// --------------------creating a udp server --------------------

// creating a udp server
var server = udp.createSocket('udp4');

// emits when any error occurs
server.on('error', function (error) {
    console.log('Error: ' + error);
    server.close();
});

// emits on new datagram msg
// apenas devolvendo a mensagem para o cliente que a enviou
// para que exista de fato uma conexão udp pura no trabalho
server.on('message', function (msg, info) {
    //sending msg
    // console.log('received from ', info.port, info.address,);
    server.send(msg, info.port, info.address, function (error) {
        if (error) {
            client.close();
        }
    });
});

//emits when socket is ready and listening for datagram msgs
server.on('listening', function () {
    var address = server.address();
    var port = address.port;
    var family = address.family;
    var ipaddr = address.address;
    console.log('Server is listening at port' + port);
    console.log('Server ip :' + ipaddr);
    console.log('Server is IP4/IP6 : ' + family);
});

//emits after the socket is closed using socket.close();
server.on('close', function () {
    console.log('Socket is closed !');
});

server.bind(6000);
