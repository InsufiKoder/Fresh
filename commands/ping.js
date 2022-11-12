const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder().setName("ping").setDescription("pong!"),
  global: true,
  async execute(interaction) {
    const replyEmbed = new EmbedBuilder()
      .setColor("Random")
      .setTitle(`${Date.now() - interaction.createdTimestamp}ms.`)
      .setTimestamp();

    await interaction.reply({ embeds: [replyEmbed] });
  },
};
