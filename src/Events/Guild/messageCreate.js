const { Events, Message, Client, EmbedBuilder } = require("discord.js");
const { CommandCooldown, msToMinutes } = require("discord-command-cooldown");
let { prefix, colors } = require("../../../config.json");
const guildPrefix = require("../../Models/guildPrefix");
const ms = require("ms");

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
    const isEmbed = new EmbedBuilder().setColor(colors.primary);

    if (isCustomPrefix) prefix = isCustomPrefix.prefix;
    if (!content.startsWith(prefix)) return;

    const command = content.toLowerCase().split(" ")[0].slice(prefix.length);
    const args = content.toLowerCase().split(" ").slice(1);
    const isCommand = client.command.find((cmd) => cmd.name === command);

    if (!isCommand) return;
    if (isCommand.cooldown) {
      const isCooldown = new CommandCooldown(
        `${isCommand.name}-cooldown`,
        ms(`${isCommand.cooldown}`)
      );
      const userCooldowned = await isCooldown.getUser(message.author.id);

      if (userCooldowned) {
        const timeLeft = msToMinutes(userCooldowned.msLeft, false);

        isEmbed.setDescription(
          `You need to wait \` ${
            isCommand.name === "daily"
              ? timeLeft.hours +
                " hours, " +
                timeLeft.minutes +
                " minutes, " +
                timeLeft.seconds +
                " seconds"
              : timeLeft.seconds + " seconds"
          } \` before running \` ${isCommand.name.toUpperCase()} \` command again!`
        );
        return message.reply({ embeds: [isEmbed], ephemeral: true });
      } else {
        await isCooldown.addUser(message.author.id);
      }
    }

    try {
      isCommand.execute(message, args, client);
    } catch (err) {
      console.log(err);
    }
  },
};
