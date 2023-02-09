const { Events, Message, Client, Collection } = require("discord.js");
let { prefix } = require("../../../config.json");
const guildPrefix = require("../../Models/guildPrefix");
const fs = require("node:fs");

module.exports = {
  name: Events.MessageCreate,
  /**
   *
   * @param {Message} message
   * @param {Client} client
   */
  async execute(message, client) {
    if (message.author.bot || !message.guild) return;
    const { content, guildId } = message;
    const isCustomPrefix = await guildPrefix.findOne({ guildId: guildId });

    if (isCustomPrefix) prefix = isCustomPrefix.prefix;
    if (!content.startsWith(prefix)) return;

    const command = content.toLowerCase().split(" ")[0].slice(prefix.length);
    const args = content.toLowerCase().split(" ").slice(1);
    const isCommand = client.command.find((cmd) => cmd.name === command);
    if (!isCommand) return;

    try {
      isCommand.execute(message, args, client);

      if (!client.cooldown.has(isCommand.name)) {
        client.cooldown.set(isCommand.name, new Collection());
      }

      const now = Date.now();
      const timestamps = client.cooldown.get(isCommand.name);
      const cooldownAmount = (isCommand.cooldown || 3) * 1000;

      if (timestamps.has(message.author.id)) {
        const expirationTime =
          timestamps.get(message.author.id) + cooldownAmount;

        if (now < expirationTime) {
          const timeLeft = (expirationTime - now) / 1000;
          return message.reply(
            `Please wait ${timeLeft.toFixed(
              1
            )} more second(s) before reusing the \`${isCommand.name}\` command.`
          );
        }

        timestamps.set(message.author.id, now);
        setTimeout(() => timestamps.delete(message.author.id), cooldownAmount);
      }
    } catch (err) {
      console.log(err);
    }
  },
};
