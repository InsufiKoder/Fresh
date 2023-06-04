const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
// Cooldown set
const recentlyUsed = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("work")
    .setDescription("Work your ass off and make some money"),
  global: true,
  async execute(interaction) {
    if (recentlyUsed.has(interaction.user.id)) {
      await interaction.reply(
        "You should wait a minute before using this command again."
      );
      return;
    } else {
      const earnedAmount = Math.floor(Math.random() * (500 - 50 + 1) + 50);

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
        // Add the earned amount of money to the user's wallet balance
        database[interaction.user.id].walletBalance += earnedAmount;

        const replyEmbed = new EmbedBuilder()
          .setColor("Random")
          .setTitle("You worked your ass off")
          .setDescription(`You gained **${earnedAmount}** coins.`)
          .setTimestamp();
        await interaction.reply({ embeds: [replyEmbed] });

        // Write the updated database back to the file
        fs.writeFileSync(databasePath, JSON.stringify(database));
      } catch (error) {
        console.log("An error occured in work.js:", error);
        await interaction.reply("An error occurred while working.");
      }

      // Adds the user to the set so that they can't talk for a minute
      recentlyUsed.add(interaction.user.id);
      setTimeout(() => {
        // Removes the user from the set after a minute
        recentlyUsed.delete(interaction.user.id);
      }, 60000);
    }
  },
};
