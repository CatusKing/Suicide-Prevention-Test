const brain = require('brain.js');
const { Client, Intents } = require('discord.js');
const { main } = require('./general/token.json');
const { SPT } = require('./general/sample.json');
const { char } = require('./general/config.json');
const client = new Client({ intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES, Intents.FLAGS.GUILD_MEMBERS, Intents.FLAGS.GUILD_PRESENCES] });

// create configuration for training
const config = {
  iterations: 1500,
  log: true,
  logPeriod: 50,
  layers: [10],
  errorThresh: 0.010,
};

const network = new brain.recurrent.LSTM();
network.train(SPT, config);

client.on('messageCreate', (msg) => {
  if (msg.author.bot) return;
  var content = msg.content.toLowerCase();
  for(let i = 0; i < char.length; ++i) {
    if (content.includes(char[i][0])) content.replace(char[i], char[i][1] || '');
  }
  const output = network.run();
  msg.channel.send(`${msg.content}: ${output}`);
});

client.login(main);