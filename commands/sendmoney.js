const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sendmoney")
    .setDescription("send money to a user's balance")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("User to send money to")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Amount of money to send")
        .setRequired(true)
    ),
  global: true,
  async execute(interaction) {
    const targetUser = interaction.options.getUser("user");
    const amount = interaction.options.getInteger("amount");

    if (amount <= 0) {
      interaction.reply("Please enter a positive amount to send.");
      return;
    }

    const databasePath = "database.json";
    let database = {};

    // Read the database file
    try {
      const data = fs.readFileSync(databasePath);
      database = JSON.parse(data);
    } catch (error) {
      console.log("Error reading database:", error);
      interaction.reply("An error occurred while accessing the database.");
      return;
    }

    try {
      // Check if targetUser exists in the database
      if (!database[targetUser.id]) {
        interaction.reply(
          "The specified user is not registered in the database."
        );
        return;
      }
      // Check if sender exists in the database
      if (!database[interaction.user.id]) {
        interaction.reply("You are not registered in the database.");
        return;
      }

      database[interaction.user.id].walletBalance -= amount;
      database[targetUser.id].walletBalance += amount;

      // Write the updated database back to the file
      fs.writeFileSync(databasePath, JSON.stringify(database));

      const replyEmbed = new EmbedBuilder()
        .setColor("Random")
        .setTitle("Money Sent")
        .setDescription(
          `Sent **${amount}** coins to ${targetUser}'s wallet balance.`
        )
        .setTimestamp();

      await interaction.reply({ embeds: [replyEmbed] });
    } catch (error) {
      console.log("Error sending money:", error);
      interaction.reply("An error occurred while sending money.");
    }
  },
};
