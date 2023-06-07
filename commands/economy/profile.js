const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("profile")
    .setDescription("View your profile"),
  global: true,
  async execute(interaction) {
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

      const walletBalance = user.walletBalance || 0;
      const bankBalance = user.bankBalance || 0;
      const items = [];

      // Add fishing rod item if the user has it
      if (user.fishingRodItem) {
        items.push({ name: "Fishing Rod" });
      }
      if (user.multiplierItem) {
        items.push({ name: "Multipler 1.5x" });
      }

      const replyEmbed = new EmbedBuilder()
        .setColor("Random")
        .setTitle(`${interaction.user.tag}'s Profile`)
        .setThumbnail(interaction.user.displayAvatarURL())
        .addFields(
          {
            name: "Wallet Balance",
            value: `**${walletBalance.toString()}** coins`,
          },
          { name: "Bank Balance", value: `**${bankBalance.toString()}** coins` }
        );

      if (items.length > 0) {
        const itemList = items.map((item) => item.name).join(", ");
        replyEmbed.addFields({ name: "Items", value: itemList });
      }

      await interaction.reply({ embeds: [replyEmbed] });
    } catch (error) {
      console.log("An error occurred in profile.js:", error);
      await interaction.reply("An error occurred while fetching the profile.");
    }
  },
};
