'use strict'

const client = require('./client');

function handleVoiceData(data) {

    let newData = data.audio.split(";");
    newData[0] = "data:audio/ogg;";
    newData = newData[0] + newData[1];

    const socketToEmit = client.getSocketByUsername(data.username);

    socketToEmit.emit('voiceReceived', newData);
}
exports.handleVoiceData = handleVoiceData;
