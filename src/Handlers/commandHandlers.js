const { Client } = require("discord.js");
const fs = require("node:fs");

/**
 *
 * @param {Client} client
 */

const commandHandler = (client) => {
  const commandFolders = fs.readdirSync("./src/Commands");

  for (const folder of commandFolders) {
    const commandFiles = fs
      .readdirSync(`./src/Commands/${folder}`)
      .filter((f) => f.endsWith(".js"));

    for (const file of commandFiles) {
      const commandHandler = require(`../Commands/${folder}/${file}`);

      client.command.set(commandHandler.name, commandHandler);
    }
  }
};

module.exports = { commandHandler };
