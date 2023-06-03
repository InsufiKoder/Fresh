const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("withdraw")
    .setDescription("Withdraw money from your bank balance")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Amount of money to withdraw")
        .setRequired(true)
    ),
  global: true,
  async execute(interaction) {
    const amount = interaction.options.getInteger("amount");

    if (amount <= 0) {
      interaction.reply("Please enter a positive amount to withdraw.");
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
      // Check if user exists in the database
      if (!database[interaction.user.id]) {
        interaction.reply(
          "The specified user is not registered in the database."
        );
        return;
      }

      if (database[interaction.user.id].bankBalance < amount) {
        interaction.reply("You don't have enough money to withdraw.");
        return;
      }
      database[interaction.user.id].bankBalance -= amount;
      database[interaction.user.id].walletBalance += amount;

      // Write the updated database back to the file
      fs.writeFileSync(databasePath, JSON.stringify(database));

      const replyEmbed = new EmbedBuilder()
        .setColor("Random")
        .setTitle("Money Withdrawn")
        .setDescription(
          `Withdrawn **${amount}** coins from ${interaction.user}'s bank balance.`
        )
        .setTimestamp();

      await interaction.reply({ embeds: [replyEmbed] });
    } catch (error) {
      console.log("Error withdrawing:", error);
      interaction.reply("An error occurred while withdrawing money.");
    }
  },
};
