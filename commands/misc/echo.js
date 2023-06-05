const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("echo")
    .setDescription("Echoes what the user says")
    .addStringOption((option) =>
      option.setName("text").setDescription("Text to echo").setRequired(true)
    ),
  global: true,
  async execute(interaction) {
    const text = interaction.options.getString("text");
    try {
      await interaction.reply({ content: text });
    } catch (error) {
      await interaction.reply("An error occured");
      console.log(error);
    }
  },
};
