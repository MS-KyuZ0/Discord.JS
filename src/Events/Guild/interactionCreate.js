const { Events, BaseInteraction, Client, EmbedBuilder } = require("discord.js");
const { CommandCooldown, msToMinutes } = require("discord-command-cooldown");
const { colors } = require("../../../config.json");
const ms = require("ms");

module.exports = {
  name: Events.InteractionCreate,
  /**
   * @param {BaseInteraction} interaction
   * @param {Client} client
   */
  async execute(interaction, client) {
    if (!interaction.isChatInputCommand()) return;

    const isEmbed = new EmbedBuilder().setColor(colors.primary);
    const command = interaction.client.slashCommand.get(
      interaction.commandName
    );

    if (!command) {
      console.error(
        `No command matching ${interaction.commandName} was found.`
      );
      return;
    }

    if (command.cooldown) {
      const isCooldown = new CommandCooldown(
        `${command.data.name}-cooldown`,
        ms(`${command.cooldown}`)
      );
      const userCooldowned = await isCooldown.getUser(interaction.user.id);

      if (userCooldowned) {
        const timeLeft = msToMinutes(userCooldowned.msLeft, false);

        isEmbed.setDescription(
          `You need to wait \` ${
            command.name === "daily"
              ? timeLeft.hours +
                " hours, " +
                timeLeft.minutes +
                " minutes, " +
                timeLeft.seconds +
                " seconds"
              : timeLeft.seconds + " seconds"
          } \` before running \` ${command.data.name.toUpperCase()} \` command again!`
        );

        return interaction.reply({ embeds: [isEmbed], ephemeral: true });
      } else {
        await isCooldown.addUser(interaction.user.id);
      }
    }

    try {
      await command.execute(interaction, client);
    } catch (error) {
      console.error(error);
      await interaction.reply({
        content: "There was an error while executing this command!",
        ephemeral: true,
      });
    }
  },
};
