const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("register")
    .setDescription("Register user in the database"),
  global: false,
  async execute(interaction) {
    const userId = interaction.user.id;
    let database = {};

    // Read the database file
    try {
      const data = fs.readFileSync("database.json");
      database = JSON.parse(data);
    } catch (error) {
      console.log("Error reading database:", error);
    }

    // Check if user information already exists
    if (database[userId]) {
      const replyEmbed = new EmbedBuilder()
        .setColor("Random")
        .setTitle("Registration Failed")
        .setDescription("User is already registered.")
        .setTimestamp();

      await interaction.reply({ embeds: [replyEmbed] });
      return;
    }

    // Create new user information in the database
    database[userId] = {
      walletBalance: 0,
      bankBalance: 0,
    };

    // Write the updated database back to the file
    try {
      fs.writeFileSync("database.json", JSON.stringify(database));
    } catch (error) {
      console.log("Error writing to database:", error);
    }

    const replyEmbed = new EmbedBuilder()
      .setColor("Random")
      .setTitle("Registration Successful")
      .setDescription("User registered successfully.")
      .setTimestamp();

    await interaction.reply({ embeds: [replyEmbed] });
  },
};
