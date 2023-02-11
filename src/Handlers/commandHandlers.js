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
      const isProps = { folder, ...commandHandler };

      client.command.set(commandHandler.name, isProps);
    }
  }
};

module.exports = { commandHandler };
