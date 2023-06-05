const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const fs = require("fs");
const { ownerId } = require("../../config.json");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("ownerregister")
    .setDescription("Register specified user in the database")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("User to register")
        .setRequired(true)
    ),
  global: true,
  async execute(interaction) {
    const targetUser = interaction.options.getUser("user");
    let database = {};

    if (interaction.user.id != ownerId) {
      await interaction.reply(
        "Only the owner of the bot can use this command."
      );
      return;
    }

    // Read the database file
    try {
      const data = fs.readFileSync("database.json");
      database = JSON.parse(data);
    } catch (error) {
      console.log("Error reading database:", error);
    }

    // Check if user information already exists
    if (database[targetUser.id]) {
      const replyEmbed = new EmbedBuilder()
        .setColor("Random")
        .setTitle("Registration Failed")
        .setDescription("User is already registered.")
        .setTimestamp();

      await interaction.reply({ embeds: [replyEmbed] });
      return;
    }

    // Create new user information in the database
    database[targetUser.id] = {
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
