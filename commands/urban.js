const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const axios = require("axios");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("define")
    .setDescription("Get the definition of a word from the urban dictionary")
    .addStringOption((option) =>
      option
        .setName("word")
        .setDescription("Enter a word to define")
        .setRequired(true)
    ),
  global: true,
  async execute(interaction) {
    const word = interaction.options.getString("word");

    try {
      await interaction.reply(
        `Searching the urban dictionary for: **${word}**`
      );
      const response = await axios.get(
        `http://api.urbandictionary.com/v0/define?term=${encodeURIComponent(
          word
        )}`
      );
      const data = response.data;

      if (data.list && data.list.length > 0) {
        const [definition] = data.list;

        const replyEmbed = new EmbedBuilder()
          .setColor("Random")
          .setTitle("Definition")
          .addFields({ name: `**${word}**`, value: `${definition.definition}` })
          .setTimestamp();

        await interaction.editReply({ content: "", embeds: [replyEmbed] });
      } else {
        await interaction.editReply({
          content: `No definition found for **${word}**.`,
        });
      }
    } catch (error) {
      console.error("Error fetching definition:", error);
      await interaction.reply({
        content: "An error occurred while fetching the definition.",
      });
    }
  },
};
