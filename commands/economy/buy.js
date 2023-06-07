const { SlashCommandBuilder } = require("@discordjs/builders");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("buy")
    .setDescription("Buy an item from the shop")
    .addStringOption((option) =>
      option
        .setName("item")
        .setDescription("Item to purchase")
        .setRequired(true)
        .addChoices(
          {
            name: "Multiplier 1.5x",
            value: "multiplier15",
          },
          {
            name: "Fishing Rod",
            value: "fishingrod",
          }
        )
    ),
  global: true,
  async execute(interaction) {
    const item = interaction.options.getString("item");

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

    const user = database[interaction.user.id];
    if (!user) {
      await interaction.reply("You are not registered in the database.");
      return;
    }

    // Check if the item exists and if the user has enough coins to purchase it
    let price;
    let multiplierItem = false;
    let fishingRodItem = false;
    switch (item) {
      case "multiplier15":
        price = 35000;
        multiplierItem = true;
        break;
      case "fishingrod":
        price = 5000;
        fishingRodItem = true;
        break;
      default:
        await interaction.reply(
          "The specified item does not exist in the shop."
        );
        return;
    }

    if (user.walletBalance < price) {
      await interaction.reply(
        "You do not have enough coins to purchase this item."
      );
      return;
    }

    // Deduct the price from the user's wallet balance
    user.walletBalance -= price;

    // Set the multiplierItem property to true if the purchased item is the "Multiplier 1.5x"
    if (multiplierItem) {
      user.multiplierItem = true;
    }

    // Set the fishingRodItem property to true if the purchased item is the "Fishing Rod"
    if (fishingRodItem) {
      user.fishingRodItem = true;
    }

    // Write the updated database back to the file
    fs.writeFileSync(databasePath, JSON.stringify(database));

    if (item === "multiplier15") {
      await interaction.reply(
        "You have successfully purchased the Multiplier 1.5x."
      );
    } else if (item === "fishingrod") {
      await interaction.reply(
        "You have successfully purchased the Fishing Rod."
      );
    }
  },
};
