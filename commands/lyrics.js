const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const dotenv = require("dotenv");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("lyrics")
    .setDescription("Get the lyrics of a song")
    .addStringOption((option) =>
      option
        .setName("song")
        .setDescription("Enter the name of the song")
        .setRequired(true)
    ),
  global: true,
  async execute(interaction) {
    const song = interaction.options.getString("song");

    try {
      // Search for the song using the Genius API
      const searchResponse = await axios.get(
        `https://api.genius.com/search?q=${encodeURIComponent(song)}`,
        {
          headers: {
            Authorization: `Bearer ${process.env.GENIUS_TOKEN}`,
          },
        }
      );

      const searchResults = searchResponse.data.response.hits;

      if (searchResults.length > 0) {
        // Get the first search result
        const firstResult = searchResults[0];
        const songId = firstResult.result.id;

        // Retrieve the lyrics of the song using the song ID
        const lyricsResponse = await axios.get(
          `https://api.genius.com/songs/${songId}`,
          {
            headers: {
              Authorization: `Bearer ${process.env.GENIUS_TOKEN}`,
            },
          }
        );

        const lyricsData = lyricsResponse.data.response.song;

        const replyEmbed = new EmbedBuilder()
          .setColor("Random")
          .setTitle("Lyrics")
          .setDescription(lyricsData.full_title)
          .addFields(
            { name: "Artist", value: lyricsData.primary_artist.name },
            { name: "URL", value: lyricsData.url }
          )
          .setTimestamp();

        await interaction.reply({ embeds: [replyEmbed] });
      } else {
        await interaction.reply({
          content: `No lyrics found for **${song}**.`,
        });
      }
    } catch (error) {
      console.error("Error fetching lyrics:", error);
      await interaction.reply({
        content: "An error occurred while fetching the lyrics.",
      });
    }
  },
};
