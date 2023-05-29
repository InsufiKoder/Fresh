const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const ownerId = require("../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("addmoney")
    .setDescription("Add money to a user's wallet balance")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("User to add money to")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Amount of money to add")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("where")
        .setDescription("Where to add the money")
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
  global: false,
  async execute(interaction) {
    const targetUser = interaction.options.getUser("user");
    const amount = interaction.options.getInteger("amount");
    const where = interaction.options.getString("where");

    if (!interaction.user.id == ownerId) {
      interaction.reply("Only the owner of the bot can use this command.");
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
        // Add money to the user's wallet balance
        database[targetUser.id].walletBalance += amount;
      } else if (where == "bank") {
        // Add money to the user's bank balance
        database[targetUser.id].bankBalance += amount;
      }

      // Write the updated database back to the file
      fs.writeFileSync(databasePath, JSON.stringify(database));

      const replyEmbed = new EmbedBuilder()
        .setColor("Random")
        .setTitle("Money Added")
        .setDescription(
          `Added ${amount} coins to ${targetUser}'s ${where} balance.`
        )
        .setTimestamp();

      await interaction.reply({ embeds: [replyEmbed] });
    } catch (error) {
      console.log("Error adding money:", error);
      interaction.reply("An error occurred while adding money.");
    }
  },
};
