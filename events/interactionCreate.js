const {
  ActionRowBuilder,
  Events,
  WebhookClient,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  EmbedBuilder,
} = require("discord.js");
const { webhookId, webhookToken } = require("../config.json");

const webhookClient = new WebhookClient({ id: webhookId, token: webhookToken });

module.exports = {
  name: Events.InteractionCreate,
  async execute(interaction, client) {
    if (interaction.isChatInputCommand()) {
      const command = interaction.client.commands.get(interaction.commandName);

      if (!command) {
        console.error(
          `No command matching ${interaction.commandName} was found.`
        );
        return;
      }

      try {
        await command.execute(interaction);
      } catch (error) {
        console.error(`Error executing ${interaction.commandName}`);
        console.error(error);
      }
    }

    // Modal Handling
    if (interaction.commandName == "suggestion") {
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
    }
    // Collect and respond to modals
    if (interaction.isModalSubmit()) {
      if (interaction.customId == "suggestionModal") {
        const suggestionLabel = interaction.fields.getTextInputValue(
          "suggestionLabelInput"
        );
        const suggestionInput =
          interaction.fields.getTextInputValue("suggestionInput");

        const replyEmbed = new EmbedBuilder()
          .setColor("Random")
          .setTitle(`Suggestion from ${interaction.user.tag}`)
          .setDescription(suggestionLabel)
          .addFields({ name: "Suggestion:", value: suggestionInput })
          .setTimestamp();

        webhookClient.send({ embeds: [replyEmbed] });
        await interaction.reply({
          content: "Your suggestion was received successfully.",
          ephemeral: true,
        });
      }
    }
  },
};
