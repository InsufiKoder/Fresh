const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("deposit")
    .setDescription("Deposit money to your bank balance")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Amount of money to deposit")
        .setRequired(true)
    ),
  global: true,
  async execute(interaction) {
    const amount = interaction.options.getInteger("amount");

    if (amount <= 0) {
      await interaction.reply("Please enter a positive amount to deposit.");
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
      await interaction.reply(
        "An error occurred while accessing the database."
      );
      return;
    }

    try {
      // Check if user exists in the database
      if (!database[interaction.user.id]) {
        await interaction.reply(
          "The specified user is not registered in the database."
        );
        return;
      }

      if (database[interaction.user.id].walletBalance < amount) {
        await interaction.reply("You don't have enough money to deposit.");
        return;
      }
      database[interaction.user.id].walletBalance -= amount;
      database[interaction.user.id].bankBalance += amount;

      // Write the updated database back to the file
      fs.writeFileSync(databasePath, JSON.stringify(database));

      const replyEmbed = new EmbedBuilder()
        .setColor("Random")
        .setTitle("Money Deposited")
        .setDescription(
          `Deposited **${amount}** coins to ${interaction.user}'s bank balance.`
        )
        .setTimestamp();

      await interaction.reply({ embeds: [replyEmbed] });
    } catch (error) {
      console.log("Error depositing:", error);
      await interaction.reply("An error occurred while depositing money.");
    }
  },
};
