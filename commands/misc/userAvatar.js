const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("avatar")
    .setDescription("Get someone's avatar")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("User to get the avatar of")
        .setRequired(true)
    ),
  global: true,
  async execute(interaction) {
    const targetUser = interaction.options.getUser("user");

    try {
      const replyEmbed = new EmbedBuilder()
        .setColor("Random")
        .setTitle(`${targetUser.tag}'s Avatar`)
        .setImage(targetUser.displayAvatarURL())
        .setTimestamp();

      await interaction.reply({ embeds: [replyEmbed] });
    } catch (error) {
      await interaction.reply("An error occured. Please try again later.");
      console.log(error);
    }
  },
};
