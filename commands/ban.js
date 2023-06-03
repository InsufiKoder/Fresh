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
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Reason of the ban")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers),
  global: true,
  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const reason =
      interaction.options.getString("reason") ||
      `Banned by Fresh. No reason specified.`;

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
      await interaction.guild.members.ban(user, { reason: reason });
      const replyEmbed = new EmbedBuilder()
        .setColor("Random")
        .setTitle(`Successfully banned ${user.username}`)
        .setDescription(`**${user.tag}** has been successfully banned.`)
        .addFields({ name: `\`Reason:\``, value: reason })
        .setTimestamp();

      await interaction.reply({ embeds: [replyEmbed] });
    } catch (error) {
      console.error("Error banning user:", error);
      await interaction.reply("An error occurred while banning the user.");
    }
  },
};
