const { MessageCollector, Client } = require("discord.js");

module.exports = {
  name: "ping",
  description: "Testing bot response.",
  cooldown: "10s",
  aliases: [],
  /**
   *
   * @param {MessageCollector} message
   * @param {Client} client
   */
  async execute(message, args, client) {
    message.channel.send({ content: "🏓 Pong!" });
  },
};
