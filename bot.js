'use strict';

const Discord = require('discord.js');
let auth = require('./auth.json');

const I_EAT_PEARS_MP3 = "./pears.mp3";
const SHOUTOUT_MP3 = "./shoutout.mp3";
const THINK_ABOUT_IT_MP3 = "./think_about_it.mp3";

let client = new Discord.Client();
client.on('ready', () => {
    console.log('Connected,');
    console.log('Logged in as: ');
    console.log(client.user.username + ' - (' + client.user.id + ')');
});
client.on('disconnect', function (errMsg, code) {
    console.log("Disconnected, trying to reconnect.");
    client.connect();
});
client.on('error', error => console.log(error.toString()));

function playFileInVoiceChannel(filename, voiceChannel) {
    if (voiceChannel === undefined || voiceChannel === null) {
        return;
    }
    voiceChannel.join().then(connection => {
        connection.play(filename).on('end', () => {
            setTimeout(() => {
                voiceChannel.leave()
            }, 2000);
        });
    }).catch(console.error);
}

client.on('message', message => {
    let content = message.content;
    if (content.substring(0, 1) === '!') {
        let args = content.substring(1).split(' ');
        let cmd = args[0];
        switch (cmd) {
            case 'eatpears':
                playFileInVoiceChannel(I_EAT_PEARS_MP3, message.member.voice.channel);
                break;
            case 'shoutout':
                playFileInVoiceChannel(SHOUTOUT_MP3, message.member.voice.channel);
                break;
            case 'thinkaboutit':
                playFileInVoiceChannel(THINK_ABOUT_IT_MP3, message.member.voice.channel);
                break;
        }
    }
});

client.login(auth.token);
