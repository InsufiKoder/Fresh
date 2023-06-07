const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const fs = require("fs");

// Cooldown set
const recentlyUsed = new Set();

module.exports = {
  data: new SlashCommandBuilder()
    .setName("daily")
    .setDescription("Claim your daily coins"),
  global: true,
  async execute(interaction) {
    if (recentlyUsed.has(interaction.user.id)) {
      await interaction.reply(
        "You should wait a day before using this command again."
      );
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

      const user = database[interaction.user.id];
      const multiplierItem = user.multiplierItem || false;

      let bonusCoins = 1500;
      if (multiplierItem) {
        bonusCoins *= 1.5; // Multiply the bonus coins by 1.5x
      }

      user.walletBalance += bonusCoins;

      // Write the updated database back to the file
      fs.writeFileSync(databasePath, JSON.stringify(database));

      let description;
      if (!multiplierItem) {
        description = `You successfully claimed your **${bonusCoins}** daily coins.`;
      } else if (multiplierItem) {
        description = `You successfully claimed your **${bonusCoins}** daily coins. \n You made 1.5x extra coins with the 1.5x Multiplier!`;
      }

      const replyEmbed = new EmbedBuilder()
        .setColor("Random")
        .setTitle("Claimed Daily")
        .setDescription(description)
        .setTimestamp();

      await interaction.reply({ embeds: [replyEmbed] });
    } catch (error) {
      console.log("Error claiming daily:", error);
      await interaction.reply("An error occurred while claiming daily.");
    }

    // Adds the user to the set so that they can't use the command for a day
    recentlyUsed.add(interaction.user.id);
    setTimeout(() => {
      // Removes the user from the set after a day
      recentlyUsed.delete(interaction.user.id);
    }, 86400000);
  },
};
