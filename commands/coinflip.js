const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("coinflip")
    .setDescription("Double or lose your money")
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Amount of money to bet")
        .setRequired(true)
    ),
  global: true,
  async execute(interaction) {
    const amount = interaction.options.getInteger("amount");

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
    // Check if the given amount is higher than user's wallet balance
    if (amount > database[interaction.user.id].walletBalance) {
      await interaction.reply(
        "You're betting more than you have in your wallet."
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
      // Take the given amount of money from the user's wallet balance
      database[interaction.user.id].walletBalance -= amount;
      // Create a random number (0, 1)
      const rand = Math.floor(Math.random() * 2);
      if (rand == 0) {
        // Add money to the user's wallet balance
        database[interaction.user.id].walletBalance += amount * 2;

        const replyEmbed = new EmbedBuilder()
          .setColor("Random")
          .setTitle("Congratulations!")
          .setDescription(`You won **${amount * 2}** coins.`)
          .setTimestamp();
        await interaction.reply({ embeds: [replyEmbed] });
      } else if (rand == 1) {
        // User lost
        const replyEmbed = new EmbedBuilder()
          .setColor("Random")
          .setTitle("You Lost")
          .setDescription(`You lost **${amount}** coins.`)
          .setTimestamp();
        await interaction.reply({ embeds: [replyEmbed] });
      }

      // Write the updated database back to the file
      fs.writeFileSync(databasePath, JSON.stringify(database));
    } catch (error) {
      console.log("An error occured in coinflip.js:", error);
      await interaction.reply("An error occurred while betting.");
    }
  },
};
