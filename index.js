require('dotenv').config();
const Discord = require('discord.js');
const client = new Discord.Client();

client.once('ready', () => {

});

// Log into Discord
client.login(process.env.TOKEN);