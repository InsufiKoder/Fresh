const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("wiki")
    .setDescription("Search for a topic on Wikipedia")
    .addStringOption((option) =>
      option
        .setName("query")
        .setDescription("Enter a query to search on Wikipedia")
        .setRequired(true)
    ),
  global: false,
  async execute(interaction) {
    const query = interaction.options.getString("query");

    try {
      const response = await axios.get(
        `https://en.wikipedia.org/api/rest_v1/page/summary/${encodeURIComponent(
          query
        )}`
      );
      const data = response.data;

      if (data.title) {
        const replyEmbed = new EmbedBuilder()
          .setColor("Random")
          .setTitle(data.title)
          .setDescription(data.extract)
          .setURL(data.content_urls.desktop.page)
          .setTimestamp();

        await interaction.reply({ embeds: [replyEmbed] });
      } else {
        await interaction.reply({
          content: `No Wikipedia page found for **${query}**.`,
        });
      }
    } catch (error) {
      console.error("Error fetching Wikipedia page:", error);
      await interaction.reply({
        content: "An error occurred while fetching the Wikipedia page.",
      });
    }
  },
};