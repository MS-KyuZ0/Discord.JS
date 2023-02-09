const { Client } = require("discord.js");
const fs = require("node:fs");

/**
 *
 * @param {Client} client
 */
const eventHandlers = (client) => {
  const eventFolders = fs.readdirSync("./src/Events");

  for (const folder of eventFolders) {
    const eventFiles = fs
      .readdirSync(`./src/Events/${folder}`)
      .filter((f) => f.endsWith(".js"));

    for (const file of eventFiles) {
      const event = require(`../Events/${folder}/${file}`);

      if (event.once) {
        client.once(event.name, (...args) => event.execute(...args, client));
      } else {
        client.on(event.name, (...args) => event.execute(...args, client));
      }
    }
  }
};

module.exports = { eventHandlers };
