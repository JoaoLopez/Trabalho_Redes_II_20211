'use strict'

const client = require('./client');
// creating a client socket
var udp = require('dgram');
var clientudp = udp.createSocket('udp4');

function getClientSocket(user) {
    if (!user.udpSocketClient) {
        user.udpSocketClient = udp.createSocket('udp4');
        user.udpSocketClient.bind(Number(user.port));

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
            console.log('errou rude');
            clientudp.close();
        } else {
            console.log('Data sent !!!');
        }
    });
}
exports.handleVoiceData = handleVoiceData;
