const {
  MessageCollector,
  Client,
  EmbedBuilder,
  ComponentType,
  ActionRowBuilder,
  StringSelectMenuBuilder,
} = require("discord.js");
const { colors, prefix } = require("../../../config.json");

module.exports = {
  name: "help",
  description: "Show all command.",
  aliases: [],
  /**
   *
   * @param {MessageCollector} message
   * @param {Client} client
   */
  async execute(message, args, client) {
    const emoji = {
      adventure: "⚔️",
      information: "ℹ️",
      minigame: "🕹️",
      utility: "🛠️",
      general: "⚙️",
    };

    const isEmbed = new EmbedBuilder()
      .setColor(colors.primary)
      .setTitle(`\` ${client.user.username} Commands \``)
      .setDescription(`Prefix is: \` ${prefix} \``)
      .setFooter({
        text: `© 2023 ${client.user.username}, All rights reserved.`,
        iconURL: client.user.displayAvatarURL(),
      });

    const isDir = [
      ...new Set(message.client.slashCommand.map((cmd) => cmd.folder)),
    ];

    const formatString = (str) =>
      `${str[0].toUpperCase()}${str.slice(1).toLowerCase()}`;

    const categories = isDir.map((dir) => {
      const getCommands = message.client.slashCommand
        .filter((cmd) => cmd.folder === dir)
        .map((cmd) => {
          return {
            name: cmd.data.name,
            description:
              cmd.data.description ||
              "There is no description for this command.",
          };
        });
      return {
        directory: formatString(dir),
        commands: getCommands,
      };
    });

    isEmbed
      .setDescription("Please select a category in the dropdown menu.")
      .setFooter({
        text: `© 2023 ${client.user.username}, All rights reserved.`,
        iconURL: client.user.displayAvatarURL(),
      });

    const components = (state) => [
      new ActionRowBuilder().addComponents(
        new StringSelectMenuBuilder()
          .setCustomId("help-menu")
          .setPlaceholder("Please select a category.")
          .setDisabled(state)
          .addOptions(
            categories.map((cmd) => {
              return {
                label: cmd.directory,
                value: cmd.directory.toLocaleLowerCase(),
                description: `Commands from category ${cmd.directory}.`,
                emoji: emoji[cmd.directory.toLocaleLowerCase() || null],
              };
            })
          )
      ),
    ];

    const initialMessage = await message.reply({
      embeds: [isEmbed],
      components: components(false),
      ephemeral: true,
    });

    const filter = (message) => message.user.id === message.member.user.id;

    const isCollectors = message.channel.createMessageComponentCollector({
      filter,
      componentType: ComponentType.StringSelect,
    });

    isCollectors.on("collect", (message) => {
      const [directory] = message.values;
      const category = categories.find(
        (x) => x.directory.toLocaleLowerCase() === directory
      );
      const categoryEmbed = new EmbedBuilder()
        .setColor(colors.primary)
        .setTitle(
          `${emoji[directory.toLocaleLowerCase() || null]} \`  ${formatString(
            directory
          )} Commands \``
        )
        .setDescription(`Prefix is: \` ${prefix} \`\n\n`)
        .addFields(
          category.commands.map((cmd) => {
            return {
              name: `\` ${cmd.name} \``,
              value: cmd.description,
              inline: true,
            };
          })
        )
        .setFooter({
          text: `© 2023 ${client.user.username}, All rights reserved.`,
          iconURL: client.user.displayAvatarURL(),
        });

      message.update({ embeds: [categoryEmbed], ephemeral: true });
    });

    isCollectors.on("end", () => {
      initialMessage.edit({ components: components(true) });
    });
  },
};
