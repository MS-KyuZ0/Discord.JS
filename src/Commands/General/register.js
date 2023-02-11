const { MessageCollector, Client, EmbedBuilder } = require("discord.js");
const { colors, emojis } = require("../../../config.json");
const userAccountDB = require("../../Models/userAccount");

module.exports = {
  name: "register",
  description: "Register your self!",
  aliases: [],
  /**
   *
   * @param {MessageCollector} message
   * @param {Client} client
   */
  async execute(message, args, client) {
    const { author } = message;
    const isEmbed = new EmbedBuilder().setColor(colors.primary);

    userAccountDB.findOne({ id: author.id }, async (err, account) => {
      if (err) return console.log(err);
      if (account)
        return message.reply({
          embeds: [
            isEmbed.setDescription(
              `${emojis.warning} | **Failed to create account! You have created an account before.**`
            ),
          ],
        });

      await userAccountDB.create({
        id: author.id,
      });

      message.reply({
        embeds: [
          isEmbed.setDescription(
            `${emojis.checkmark} Successfully created account! You get \` 50,000 ZCoins \`.`
          ),
        ],
      });
    });
  },
};
