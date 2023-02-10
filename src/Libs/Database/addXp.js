const { EmbedBuilder } = require("discord.js");

async function addXP(channel, data, user, xpMin, xpMax) {
  if (!data) return;

  const xpReq = data.level * data.level * 200;
  const moneyReward = data.Level * 5000;
  const getXp = Math.floor(Math.random * (xpMax - xpMin + 1) + xpMin);

  data.xp += getXp;
  if (data.xp >= xpReq) {
    data.level += 1;
    data.money += moneyReward;

    if (!channel) return;

    const isEmbed = new EmbedBuilder()
      .setColor(0x2f3136)
      .setDescription(
        `Whooaa ${user}, you have reached \` Level ${data.Level} \`!`
      );

    channel.send({ embeds: [isEmbed] });
  }

  return getXp;
}

module.exports = { addXP };
