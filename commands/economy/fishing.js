const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const fs = require("fs");

// Cooldown set
const recentlyUsed = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("fishing")
    .setDescription("Go fishing and earn some money"),
  global: true,
  async execute(interaction) {
    if (recentlyUsed.has(interaction.user.id)) {
      await interaction.reply(
        "You should wait 5 minutes before using this command again."
      );
      return;
    } else {
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

        // Check if the user has the fishingRodItem
        const user = database[interaction.user.id];
        const fishingRodItem = user.fishingRodItem || false;
        if (!fishingRodItem) {
          await interaction.reply(
            "You need a fishing rod to go fishing. Purchase one from the shop."
          );
          return;
        }

        // Generate a random amount of money between 250 and 1250
        let earnedAmount = Math.floor(Math.random() * (1250 - 250 + 1) + 250);

        // Check if the user has the multiplierItem
        const multiplierItem = user.multiplierItem || false;
        if (multiplierItem) {
          earnedAmount *= 1.5; // Multiply the earned amount by 1.5x
        }

        // Add the earned amount of money to the user's wallet balance
        user.walletBalance += earnedAmount;

        let description;
        if (!multiplierItem) {
          description = `You earned **${earnedAmount}** coins.`;
        } else if (multiplierItem) {
          description = `You earned **${earnedAmount}** coins. \nYou made 1.5x extra coins with the 1.5x Multiplier!`;
        }

        const replyEmbed = new EmbedBuilder()
          .setColor("Random")
          .setTitle("You went fishing")
          .setDescription(description)
          .setTimestamp();

        await interaction.reply({ embeds: [replyEmbed] });

        // Write the updated database back to the file
        fs.writeFileSync(databasePath, JSON.stringify(database));
      } catch (error) {
        console.log("An error occurred in fishing.js:", error);
        await interaction.reply("An error occurred while fishing.");
      }

      // Adds the user to the set so that they can't use the command for 5 minutes
      recentlyUsed.add(interaction.user.id);
      setTimeout(() => {
        // Removes the user from the set after 5 minutes
        recentlyUsed.delete(interaction.user.id);
      }, 300000);
    }
  },
};
