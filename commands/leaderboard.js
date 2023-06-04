const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("leaderboard")
    .setDescription("Display the economy leaderboard")
    .addStringOption((option) =>
      option
        .setName("balance")
        .setDescription("Which balance to display")
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
    const optionBalance = interaction.options.getString("balance");

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
      let users = [];
      if (optionBalance === "wallet") {
        // Get an array of users and their wallet balances
        users = Object.entries(database).map(([userId, userData]) => ({
          userId,
          balance: userData.walletBalance || 0,
        }));
      } else if (optionBalance === "bank") {
        // Get an array of users and their bank balances
        users = Object.entries(database).map(([userId, userData]) => ({
          userId,
          balance: userData.bankBalance || 0,
        }));
      }

      // Sort the users based on their specified balances in descending order
      users.sort((a, b) => b.balance - a.balance);

      // Truncate the array to 10
      const leaderboard = users.slice(0, 10);

      const replyEmbed = new EmbedBuilder()
        .setColor("Random")
        .setTitle("Leaderboard")
        .setDescription(
          leaderboard
            .map(
              (user, index) =>
                `${index + 1}. <@${user.userId}> - ${user.balance} coins`
            )
            .join("\n")
        )
        .setTimestamp();

      await interaction.reply({ embeds: [replyEmbed] });
    } catch (error) {
      console.log("Error displaying leaderboard:", error);
      await interaction.reply(
        "An error occurred while displaying the leaderboard."
      );
    }
  },
};
