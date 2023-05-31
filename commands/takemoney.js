const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const { ownerId } = require("../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("takemoney")
    .setDescription("take money from a user's balance")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("User to take money from")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Amount of money to take")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("where")
        .setDescription("Where to take the money")
        .setRequired(true)
        .addChoices(
          {
            name: "wallet",
            value: "wallet",
          },
          {
            name: "bank",
            value: "bank",
          }
        )
    ),
  global: true,
  async execute(interaction) {
    const targetUser = interaction.options.getUser("user");
    const amount = interaction.options.getInteger("amount");
    const where = interaction.options.getString("where");

    if (interaction.user.id != ownerId) {
      interaction.reply("Only the owner of the bot can use this command.");
      return;
    }

    if (amount <= 0) {
      interaction.reply("Please enter a positive amount to add.");
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

      if (where == "wallet") {
        // Take money from the user's wallet balance
        database[targetUser.id].walletBalance -= amount;
      } else if (where == "bank") {
        // Take money from the user's bank balance
        database[targetUser.id].bankBalance -= amount;
      }

      // Write the updated database back to the file
      fs.writeFileSync(databasePath, JSON.stringify(database));

      const replyEmbed = new EmbedBuilder()
        .setColor("Random")
        .setTitle("Money Removed")
        .setDescription(
          `Removed ${amount} coins from ${targetUser}'s ${where} balance.`
        )
        .setTimestamp();

      await interaction.reply({ embeds: [replyEmbed] });
    } catch (error) {
      console.log("Error removing money:", error);
      interaction.reply("An error occurred while removing money.");
    }
  },
};
