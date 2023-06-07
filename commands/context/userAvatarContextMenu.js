const { ContextMenuCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ApplicationCommandType } = require("discord.js");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("Avatar")
    .setType(ApplicationCommandType.User), // User
  global: true,
  async execute(interaction) {
    const avatar = interaction.targetUser.displayAvatarURL();

    const replyEmbed = new EmbedBuilder()
      .setColor("Random")
      .setTitle(`${interaction.targetUser.tag}'s Avatar`)
      .setImage(avatar)
      .setTimestamp();

    await interaction.reply({ embeds: [replyEmbed] });
  },
};
