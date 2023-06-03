const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { PermissionsBitField } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("kick")
    .setDescription("kick a user from the server")
    .addUserOption((option) =>
      option.setName("user").setDescription("User to kick").setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.KickMembers),
  global: true,
  async execute(interaction) {
    const user = interaction.options.getUser("user");

    // Check if the bot has the necessary permissions to kick members
    if (
      !interaction.guild.members.me.permissions.has(
        PermissionsBitField.Flags.KickMembers
      )
    ) {
      await interaction.reply("I don't have permission to kick members.");
      return;
    }

    // kick the user
    try {
      await interaction.guild.members.ban(user);
      const replyEmbed = new EmbedBuilder()
        .setColor("Random")
        .setTitle(`Successfully kicked ${user.username}`)
        .setDescription(`**${user.tag}** has been successfully kicked.`)
        .setTimestamp();

      await interaction.reply({ embeds: [replyEmbed] });
    } catch (error) {
      console.error("Error kicking user:", error);
      await interaction.reply("An error occurred while kicking the user.");
    }
  },
};
