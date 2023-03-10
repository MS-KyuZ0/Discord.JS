const {
  InteractionCollector,
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");
const { colors, emojis } = require("../../../config.json");
const userAccountDB = require("../../Models/userAccount");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("register")
    .setDescription("Register your self!"),
  /**
   * @param {InteractionCollector} interaction
   */
  async execute(interaction) {
    const { user } = interaction;
    const isEmbed = new EmbedBuilder().setColor(colors.primary);

    userAccountDB.findOne({ id: user.id }, async (err, account) => {
      if (err) return console.log(err);
      if (account)
        return interaction.reply({
          embeds: [
            isEmbed.setDescription(
              `${emojis.warning} | **Failed to create account! You have created an account before.**`
            ),
          ],
        });

      await userAccountDB.create({
        id: user.id,
      });

      interaction.reply({
        embeds: [
          isEmbed.setDescription(
            `${emojis.checkmark} **Successfully created account! You get \` 50,000 ZCoins \`.**`
          ),
        ],
      });
    });
  },
};
