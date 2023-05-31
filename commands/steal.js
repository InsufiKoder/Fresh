const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
// Cooldown set
const recentlyUsed = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("steal")
    .setDescription("steal from someone")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("User you want to rob")
        .setRequired(true)
    ),
  global: true,
  async execute(interaction) {
    if (recentlyUsed.has(interaction.user.id)) {
      interaction.reply(
        "You should wait 5 minutes before using this command again."
      );
      return;
    } else {
      const targetUser = interaction.options.getUser("user");

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

        // Create a random number (0, 1)
        const rand = Math.floor(Math.random() * 2);
        if (rand == 0) {
          const stolenAmount = Math.floor(
            Math.random() * (750 - 250 + 1) + 250
          );
          if (database[targetUser.id].walletBalance < 1000) {
            interaction.reply(
              "This user has less than 1000 coins in their wallet. You can't rob them."
            );
            return;
          }

          database[targetUser.id].walletBalance -= stolenAmount;
          database[interaction.user.id].walletBalance += stolenAmount;
          interaction.reply(
            `You sucessfully robbed ${targetUser}! You gained ${stolenAmount} coins.`
          );
        } else {
          interaction.reply("Your robbing attempt was unsuccessful.");
          return;
        }
        // Write the updated database back to the file
        fs.writeFileSync(databasePath, JSON.stringify(database));
      } catch (error) {
        console.log("Error robbing:", error);
        interaction.reply("An error occurred while trying to rob.");
      }

      // Adds the user to the set so that they can't talk for a minute
      recentlyUsed.add(interaction.user.id);
      setTimeout(() => {
        // Removes the user from the set after 5 minutes
        recentlyUsed.delete(interaction.user.id);
      }, 300000);
    }
  },
};
