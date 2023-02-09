const { MessageCollector, Client, PermissionFlagsBits } = require("discord.js");
const { prefix } = require("../../../config.json");
const guildPrefix = require("../../Models/guildPrefix");

module.exports = {
  name: "prefix",
  description: "Custom the prefix on each server.",
  aliases: [],
  /**
   *
   * @param {MessageCollector} message
   * @param {Client} client
   */
  async execute(message, args, client) {
    const guildCustom = await guildPrefix.findOne({
      guildId: message.guild.id,
    });

    if (!message.member.permissions.has(PermissionFlagsBits.Administrator))
      return message.channel.send({
        content: "You don't have permission to change the prefix.",
      });

    if (args.length <= 0) {
      return message.channel.send({
        content: `The current prefix is \`${
          guildCustom ? guildCustom.prefix : prefix
        }\`.`,
      });
    } else if (args[0].length > 2) {
      return message.channel.send({
        content: `The length of the prefix cannot exceed 2 letters!`,
      });
    }

    const newPrefix = args[0];

    if (guildCustom) {
      guildCustom.prefix = newPrefix;
      await guildCustom.save();
    } else {
      const newCustomPrefix = guildPrefix.create({
        guildId: message.guild.id,
        prefix: newPrefix,
      });
    }

    message.reply({ content: `Prefix changed to \`${newPrefix}\`.` });
  },
};
