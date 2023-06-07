const { Events, WebhookClient, EmbedBuilder } = require("discord.js");
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
