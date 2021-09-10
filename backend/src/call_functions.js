'use strict'

const client = require('./client');
// creating a client socket
var udp = require('dgram');
var clientudp = udp.createSocket('udp4');

// cria um socket cliente udp para o usuário fornecido no parametro
// como este arquivo está no fluxo de execução de client.js, todos sockets udp clientes têm
// o mesmo endereço ip, apenas fazer o bind em portas diferentes
function getClientSocket(user) {
    if (!user.udpSocketClient) {
        user.udpSocketClient = udp.createSocket('udp4');
        user.udpSocketClient.bind(Number(user.port));

        // quando recebe a mensagem de volta do servidor udp
        // faz a trasmissão para o websocket do usuário
        user.udpSocketClient.on('message', function (msg, info) {
            // console.log('Data received from server : ' + msg.toString());
            console.log('Received %d bytes from %s:%d\n', msg.length, info.address, info.port);

            const msgContent = msg.toString().split(';');
            const socketToEmit = client.getSocket(msgContent[2]);
            const msgToSend = msgContent[0] + ';' + msgContent[1];
            // comentado por razões de performance
            // console.log(msgToSend);
            socketToEmit.emit('voiceReceived', msgToSend);
        });
    }
    console.log('criou');
    return user.udpSocketClient;
}

// função executada na linha 137 de client.js
// trata os dados de voz recebidos pelo websocket
// e os envia para o servidor udp
function handleVoiceData(data) {

    let newData = data.audio.split(";");
    newData[0] = "data:audio/ogg;";
    newData = newData[0] + newData[1];

    const socketToEmit = client.getSocketByUsername(data.username);
    const user = client.getUserByName(data.username);

    newData += `;${socketToEmit.id}`;
    let audioBuffer = Buffer.from(newData);
    getClientSocket(user).send(audioBuffer, 6000, '192.168.0.103', function (error) {
        if (error) {
            getClientSocket(user).close();
        } else {
            console.log('Data sent !!!');
        }
    });
}
exports.handleVoiceData = handleVoiceData;
