require("dotenv").config();
const { Client, REST, Routes } = require("discord.js");
const fs = require("node:fs");
const commands = [];

/**
 *
 * @param {Client} client
 */
const slashCommandHander = (client) => {
  const commandFolders = fs.readdirSync("./src/slashCommands");

  for (const folder of commandFolders) {
    const commandFiles = fs
      .readdirSync(`./src/slashCommands/${folder}`)
      .filter((f) => f.endsWith(".js"));

    for (const file of commandFiles) {
      const command = require(`../slashCommands/${folder}/${file}`);

      if ("data" in command && "execute" in command) {
        client.slashCommand.set(command.data.name, command);
        commands.push(command.data.toJSON());
      } else {
        console.log(
          `[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`
        );
      }
    }
  }

  const rest = new REST({ version: "10" }).setToken(process.env.DISCORD);

  (async () => {
    try {
      console.log(
        `[COMMAND HANDLER] Started refreshing ${commands.length} application (/) commands.`
      );

      // The put method is used to fully refresh all commands in the guild with the current set
      const data = await rest.put(
        Routes.applicationCommands(process.env.CLIENTID),
        { body: commands }
      );

      console.log(
        `[COMMAND HANDLER] Successfully reloaded ${data.length} application (/) commands.`
      );
    } catch (error) {
      // And of course, make sure you catch and log any errors!
      console.error("[COMMAND HANDLER]" + error);
    }
  })();
};

module.exports = { slashCommandHander };
