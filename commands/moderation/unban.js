const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { PermissionsBitField } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unban a user from the server")
    .addStringOption((option) =>
      option
        .setName("userid")
        .setDescription("The ID of the user to unban")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Reason for the unban")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers),
  global: true,
  async execute(interaction) {
    const userId = interaction.options.getString("userid");
    const reason =
      interaction.options.getString("reason") ||
      "Unbanned by Fresh. No reason given.";

    // Check if the bot has the necessary permissions to unban members
    if (
      !interaction.guild.members.me.permissions.has(
        PermissionsBitField.Flags.BanMembers
      )
    ) {
      await interaction.reply("I don't have permission to unban members.");
      return;
    }

    // Unban the user
    try {
      await interaction.guild.members.unban(userId, { reason: reason });
      const replyEmbed = new EmbedBuilder()
        .setColor("Random")
        .setTitle(`Successfully unbanned user`)
        .setDescription(
          `User with the ID **${userId}** has been successfully unbanned.`
        )
        .addFields({ name: `\`Reason:\``, value: reason })
        .setTimestamp();

      await interaction.reply({ embeds: [replyEmbed] });
    } catch (error) {
      console.error("Error unbanning user:", error);
      await interaction.reply("An error occurred while unbanning the user.");
    }
  },
};
