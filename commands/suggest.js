const { SlashCommandBuilder } = require("@discordjs/builders");
const suggestionModal = require("../interactions/suggestionModal");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("suggestion")
    .setDescription("Suggest a new feature for the bot"),
  global: true,
  async execute(interaction) {
    await interaction.showModal(suggestionModal.data.builder);
  },
};
