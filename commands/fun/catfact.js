const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("catfact")
    .setDescription("Get a random cat fact"),
  global: true,
  async execute(interaction) {
    try {
      const response = await axios.get("https://catfact.ninja/fact");
      const fact = response.data.fact;

      const replyEmbed = new EmbedBuilder()
        .setColor("Random")
        .setTitle(`🐱 Here's a random cat fact:`)
        .setDescription(fact)
        .setTimestamp();

      await interaction.reply({ embeds: [replyEmbed] });
    } catch (error) {
      console.error("Error fetching cat fact:", error);
      await interaction.reply({
        content: "Oops! An error occurred while fetching the cat fact.",
      });
    }
  },
};
