require("dotenv").config();
const { Client, GatewayIntentBits, Collection } = require("discord.js");
const { eventHandlers } = require("./Handlers/eventHandlers");
const { commandHandler } = require("./Handlers/commandHandlers");
const { slashCommandHander } = require("./Handlers/slashCommandHandler");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.GuildPresences,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.MessageContent,
  ],
});

// ! Collection
client.command = new Collection();
client.slashCommand = new Collection();
client.cooldown = new Collection();

// ! Handlers
commandHandler(client);
slashCommandHander(client);
eventHandlers(client);

client.login(process.env.DISCORD);
