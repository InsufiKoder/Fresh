const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("balance")
    .setDescription("Check your balance")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("User to check the balance of")
        .setRequired(false)
    ),
  global: true,
  async execute(interaction) {
    const user = interaction.options.getMember("user") || interaction.user;
    const userId = user.id;
    let database = {};

    // Read the database file
    try {
      const data = fs.readFileSync("database.json");
      database = JSON.parse(data);
    } catch (error) {
      console.log("Error reading database:", error);
    }

    try {
      // Get the user's wallet balance and bank balance from the database
      const { walletBalance, bankBalance } = database[userId];

      const replyEmbed = new EmbedBuilder()
        .setColor("Random")
        .setTitle("Balance")
        .addFields(
          { name: "Wallet Balance", value: `**${walletBalance}** coins` },
          { name: "Bank Balance", value: `**${bankBalance}** coins` }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [replyEmbed] });
    } catch (error) {
      await interaction.reply(
        "An error occurred. Please make sure you or the mentioned person are registered in the database."
      );
      console.log(error);
    }
  },
};
