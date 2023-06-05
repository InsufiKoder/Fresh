const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const { PermissionsBitField } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("clear")
    .setDescription("Clear a specified number of messages")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Number of messages to clear")
        .setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.ManageMessages),
  global: true,
  async execute(interaction) {
    const amount = interaction.options.getInteger("amount");

    // Check if the bot has the necessary permissions to manage messages
    if (
      !interaction.guild.members.me.permissions.has(
        PermissionsBitField.Flags.ManageMessages
      )
    ) {
      await interaction.reply("I don't have permission to manage messages.");
      return;
    }

    // Delete the specified number of messages
    try {
      await interaction.channel.bulkDelete(amount);
      const replyEmbed = new EmbedBuilder()
        .setColor("Random")
        .setTitle(`Successfully cleared messages.`)
        .setDescription(`Successfully cleared **${amount}** messages.`)
        .setTimestamp();

      await interaction.reply({ embeds: [replyEmbed] });
    } catch (error) {
      console.error("Error clearing messages:", error);
      await interaction.reply("An error occurred while clearing messages.");
    }
  },
};
