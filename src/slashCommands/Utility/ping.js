const { InteractionCollector, SlashCommandBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ping")
    .setDescription("Testing bot response."),
  cooldown: "10s",
  /**
   *
   * @param {InteractionCollector} interaction
   */
  async execute(interaction) {
    interaction.reply({ content: "🏓 Pong!" });
  },
};
