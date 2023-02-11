const { EmbedBuilder } = require("discord.js");

async function addXP(channel, data, user, xp) {
  if (!data) return;

  const xpReq = data.level * data.level * 200;
  const moneyReward = data.Level * 5000;
  const getXp = Math.floor(10 * Math.pow(1.1, data.level));

  data.xp += getXp;
  if (data.xp >= xpReq) {
    data.level += 1;
    data.money += moneyReward;

    if (!channel) return;

    const isEmbed = new EmbedBuilder()
      .setColor(0x2f3136)
      .setDescription(
        `Whooaa ${user}, you have reached \` Level ${data.level} \`!`
      );

    channel.send({ embeds: [isEmbed] });
  }

  return getXp;
}

module.exports = { addXP };
