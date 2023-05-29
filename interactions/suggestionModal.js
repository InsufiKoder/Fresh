const {
  ModalBuilder,
  ActionRowBuilder,
  TextInputBuilder,
  TextInputStyle,
  EmbedBuilder,
  WebhookClient,
} = require("discord.js");
const { webhookId, webhookToken } = require("../config.json");
const webhookClient = new WebhookClient({ id: webhookId, token: webhookToken });

module.exports = {
  data: {
    id: "suggestionModal",
    builder: new ModalBuilder()
      .setCustomId("suggestionModal")
      .setTitle("Suggestion Modal")
      .addComponents(
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("suggestionLabel")
            .setRequired(true)
            .setMinLength(1)
            .setMaxLength(100)
            .setLabel("What is the feature you want in the bot?")
            .setStyle(TextInputStyle.Short)
            .setPlaceholder("coinflip")
        ),
        new ActionRowBuilder().addComponents(
          new TextInputBuilder()
            .setCustomId("suggestion")
            .setRequired(true)
            .setMaxLength(1000)
            .setLabel("Explain your suggestion")
            .setStyle(TextInputStyle.Paragraph)
        )
      ),
  },
  async execute(interaction) {
    const suggestionLabel =
      interaction.fields.getTextInputValue("suggestionLabel");
    const user = interaction.user;
    const userName = user.tag;
    const suggestion = interaction.fields.getTextInputValue("suggestion");

    const embed = new EmbedBuilder()
      .setColor("Random")
      .setTitle(`${userName}'s Suggestion:`)
      .addFields({ name: `\`Suggestion\``, value: suggestion })
      .setDescription(suggestionLabel)
      .setTimestamp();

    webhookClient.send({
      username: userName,
      avatarURL: user.displayAvatarURL(),
      embeds: [embed],
    });

    await interaction.reply({
      content: `Thanks, ${userName}. Your suggestion is received by the developer team.`,
      ephemeral: true,
    });
  },
};
