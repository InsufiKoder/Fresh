const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("slotmachine")
    .setDescription("Play the slot machine")
    .addIntegerOption((option) =>
      option
        .setName("bet")
        .setDescription("Amount of money to bet")
        .setRequired(true)
    ),
  global: true,
  async execute(interaction) {
    const betAmount = interaction.options.getInteger("bet");

    if (betAmount <= 0) {
      await interaction.reply("Please enter a positive bet amount.");
      return;
    }

    const symbols = ["🍒", "🍊", "🍋", "🍇", "🍓", "🍉"];
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
      // Check if the given bet amount is higher than the user's wallet balance
      if (betAmount > database[interaction.user.id].walletBalance) {
        await interaction.reply(
          "You're betting more than you have in your wallet."
        );
        return;
      }

      // Check if user exists in the database
      if (!database[interaction.user.id]) {
        await interaction.reply("You are not registered in the database.");
        return;
      }

      const user = database[interaction.user.id];
      const multiplierItem = user.multiplierItem || false;

      // Deduct the bet amount from the user's wallet balance
      user.walletBalance -= betAmount;

      // Generate three random symbols
      const results = [];
      for (let i = 0; i < 3; i++) {
        const randomSymbol =
          symbols[Math.floor(Math.random() * symbols.length)];
        results.push(randomSymbol);
      }

      // Check if all symbols are the same
      const isWin = results[0] === results[1] && results[1] === results[2];

      let winAmount;
      if (isWin) {
        // Triple the bet amount and add it to the user's wallet balance
        winAmount = betAmount * 3;
      } else if (
        results[0] === results[1] ||
        results[0] === results[2] ||
        results[1] === results[2]
      ) {
        // Two symbols match, win 1.5 times the bet amount
        winAmount = betAmount * 1.5;
      } else {
        winAmount = 0;
      }

      if (multiplierItem) {
        winAmount *= 1.5; // Multiply the win amount by 1.5x
      }

      user.walletBalance += winAmount;

      // Write the updated database back to the file
      fs.writeFileSync(databasePath, JSON.stringify(database));

      let description;
      if (winAmount > 0) {
        if (!multiplierItem) {
          description = `**${results.join(
            " "
          )}**\n\nCongratulations! You won ${winAmount} coins.`;
        } else if (multiplierItem) {
          description = `**${results.join(
            " "
          )}**\n\nCongratulations! You won ${winAmount} coins. \n You made 1.5x extra coins with the 1.5x Multiplier!`;
        }
      } else {
        description = `**${results.join(" ")}**\n\nYou didn't win this time.`;
      }

      const replyEmbed = new EmbedBuilder()
        .setColor("Random")
        .setTitle("Slot Machine")
        .setDescription(description)
        .setTimestamp();

      await interaction.reply({ embeds: [replyEmbed] });
    } catch (error) {
      console.log("An error occurred in slot machine:", error);
      await interaction.reply(
        "An error occurred while playing the slot machine."
      );
    }
  },
};
