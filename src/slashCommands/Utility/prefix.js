const {
  InteractionCollector,
  PermissionFlagsBits,
  SlashCommandBuilder,
} = require("discord.js");
const { prefix } = require("../../../config.json");
const guildPrefix = require("../../Models/guildPrefix");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("prefix")
    .setDescription("Custom the prefix on each server.")
    .addStringOption((strOpt) =>
      strOpt.setName("prefix").setDescription("Input your custom prefix.")
    )
    .setDefaultMemberPermissions(PermissionFlagsBits.Administrator),
  /**
   *
   * @param {InteractionCollector} interaction
   */
  async execute(interaction) {
    const { options, guildId } = interaction;
    const customPrefix = options.getString("prefix") || null;
    const guildCustom = await guildPrefix.findOne({ guildId: guildId });

    if (customPrefix === null)
      return interaction.reply({
        content: `The current prefix is \` ${
          guildCustom ? guildCustom.prefix : prefix
        } \` `,
      });

    if (guildCustom) {
      guildCustom.prefix = customPrefix;
      await guildCustom.save();
    } else {
      const newPrefix = guildPrefix.create({
        guildId: guildId,
        prefix: customPrefix,
      });
    }

    interaction.reply({
      content: `Prefix changed to \` ${guildCustom.prefix} \``,
    });
  },
};
