const {
  InteractionCollector,
  SlashCommandBuilder,
  EmbedBuilder,
} = require("discord.js");
const { colors, emojis } = require("../../../config.json");
const {
  generateMonsterStats,
} = require("../../Libs/Role-Playing-Game/generateMonster");
const { addXP } = require("../../Libs/Database/addXp");
const wait = require("node:timers/promises").setTimeout;
const userAccountDB = require("../../Models/userAccount");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("battle")
    .setDescription("Battle with monsters!"),
  cooldown: "15s",
  /**
   * @param {InteractionCollector} interaction
   */
  async execute(interaction) {
    const { user, channel } = interaction;
    const isEmbed = new EmbedBuilder().setColor(colors.primary);

    userAccountDB.findOne({ id: user.id }, async (err, isPlayer) => {
      if (err) return console.log(err);
      if (!isPlayer)
        return interaction.reply({
          embeds: [
            isEmbed.setDescription(
              `${emojis.warning} | **You have not registered yet. Please type \` /register \` to register yourself.**`
            ),
          ],
        });

      let battleMsg = "\n\n";
      const isMonster = await generateMonsterStats(isPlayer);
      isEmbed
        .setColor(colors.primary)
        .setAuthor({
          name: `${user.username} vs ${isMonster.name} (Lv ${isMonster.level})`,
          iconURL: user.displayAvatarURL(),
        })
        .setDescription(`${battleMsg}`)
        .setFooter({
          text: `${user.username}: ${isPlayer.hp <= 0 ? 0 : isPlayer.hp}/${
            isPlayer.maxHp
          } vs ${isMonster.name}: ${isMonster.hp <= 0 ? 0 : isMonster.hp}/${
            isMonster.maxHp
          }`,
        });

      interaction.reply({ embeds: [isEmbed] });

      while (isPlayer.hp > 0 && isMonster.hp > 0) {
        const playerDmg = Math.floor(Math.random() * isPlayer.damage + 10) + 1;
        const monsterDamage = Math.floor(
          Math.random() * (isPlayer.hp / 2) + 10
        );

        isMonster.hp -= playerDmg;
        battleMsg += `**[${user.username}]** attacked the monster and dealt \` ${playerDmg} damage \`.\n`;

        if (isMonster.hp > 0) {
          isPlayer.hp -= monsterDamage;
          battleMsg += `**[${isMonster.name}]** attacked ${user.username} and dealt \` ${monsterDamage} damage \`.\n`;
        }

        await isPlayer.save();
        await wait(2000);
        isEmbed.setDescription(`${battleMsg}`).setFooter({
          text: `${user.username}: ${isPlayer.hp <= 0 ? 0 : isPlayer.hp}/${
            isPlayer.maxHp
          } vs ${isMonster.name}: ${isMonster.hp <= 0 ? 0 : isMonster.hp}/${
            isMonster.maxHp
          }`,
        });
        interaction.editReply({ embeds: [isEmbed] });
      }
      let moneyReward = isMonster.money,
        xpReward;

      if (isPlayer.hp <= 0) {
        battleMsg += `**[${user.username}]** was defeated!\n\n -${moneyReward} ZCoins`;
        isPlayer.money -= moneyReward;
        isPlayer.hp += isPlayer.maxHp - isPlayer.hp;
        await isPlayer.save();
      } else {
        xpReward = isMonster.xp;
        addXP(channel, isPlayer, user, xpReward);
        isPlayer.money += moneyReward;
        isPlayer.hp += isPlayer.maxHp - isPlayer.hp;
        await isPlayer.save();

        battleMsg += `**[${user.username}]** defeated **${isMonster.name}**.\n\n +${moneyReward} ZCoins\n+${xpReward} Xp`;
      }
      await wait(2000);
      isEmbed.setDescription(`${battleMsg}`);
      interaction.editReply({ embeds: [isEmbed] });
    });
  },
};
