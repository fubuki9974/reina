const fs = require('fs');
const { Client, GatewayIntentBits, Partials, Collection } = require('discord.js');
require('dotenv').config();

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildBans
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction]
});

client.config = require('./src/config.json');
client.features = {};
client.logger = require('./src/features/logs');

const featuresPath = './src/features';
fs.readdirSync(featuresPath).forEach(file => {
  if (file.endsWith('.js')) {
    const f = require(`${featuresPath}/${file}`);
    if (typeof f.init === 'function') f.init(client);
    client.features[file.replace('.js','')] = f;
  }
});

// load events
const eventsPath = './src/events';
fs.readdirSync(eventsPath).forEach(file => {
  if (file.endsWith('.js')) {
    const event = require(${eventsPath}/${file});
    if (event.name && event.execute) {
      if (event.once) client.once(event.name, (...args) => event.execute(client, ...args));
      else client.on(event.name, (...args) => event.execute(client, ...args));
    }
  }
});

client.login(process.env.DISCORD_TOKEN).catch(err=>{
  console.error('Failed to login. Did you set DISCORD_TOKEN in .env?', err);
});
