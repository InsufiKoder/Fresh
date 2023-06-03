const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { PermissionsBitField } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ban")
    .setDescription("Ban a user from the server")
    .addUserOption((option) =>
      option.setName("user").setDescription("User to ban").setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers),
  global: true,
  async execute(interaction) {
    const user = interaction.options.getUser("user");

    // Check if the bot has the necessary permissions to ban members
    if (
      !interaction.guild.members.me.permissions.has(
        PermissionsBitField.Flags.BanMembers
      )
    ) {
      await interaction.reply("I don't have permission to ban members.");
      return;
    }

    // Ban the user
    try {
      await interaction.guild.members.ban(user);
      const replyEmbed = new EmbedBuilder()
        .setColor("Random")
        .setTitle(`Successfully banned ${user.tag}`)
        .setDescription(`**${user.tag}** has been successfully banned.`)
        .setTimestamp();

      await interaction.reply({ embeds: [replyEmbed] });
    } catch (error) {
      console.error("Error banning user:", error);
      await interaction.reply("An error occurred while banning the user.");
    }
  },
};
