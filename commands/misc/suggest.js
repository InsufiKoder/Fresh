const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("suggestion")
    .setDescription("Suggest a new feature for the bot"),
  global: true,
  async execute(interaction) {
    // Create the modal
    const suggestionModal = new ModalBuilder()
      .setCustomId("suggestionModal")
      .setTitle("Suggestion Form");

    // Add components to modal

    // Create the text input components
    const suggestionLabelInput = new TextInputBuilder()
      .setCustomId("suggestionLabelInput")
      // The label is the prompt the user sees for this input
      .setLabel("What is your suggestion about?")
      // Short means only a single line of text
      .setStyle(TextInputStyle.Short);

    const suggestionInput = new TextInputBuilder()
      .setCustomId("suggestionInput")
      .setLabel("What is your suggestion?")
      // Paragraph means multiple lines of text.
      .setStyle(TextInputStyle.Paragraph);

    // An action row only holds one text input,
    // so you need one action row per text input.
    const firstActionRow = new ActionRowBuilder().addComponents(
      suggestionLabelInput
    );
    const secondActionRow = new ActionRowBuilder().addComponents(
      suggestionInput
    );

    // Add inputs to the modal
    suggestionModal.addComponents(firstActionRow, secondActionRow);

    // Show the modal to the user
    await interaction.showModal(suggestionModal);
  },
};
