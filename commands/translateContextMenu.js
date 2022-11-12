const { ContextMenuCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, ApplicationCommandType } = require("discord.js");
const translate = require("google-translate-api-x");
const ISO6391 = require("iso-639-1");

module.exports = {
  data: new ContextMenuCommandBuilder()
    .setName("Translate")
    .setType(ApplicationCommandType.Message), // Message
  global: false,
  async execute(interaction) {
    const msg = interaction.targetMessage.content;
    const res = await translate(msg, { to: "en" });
    const replyEmbed = new EmbedBuilder()
      .setColor("Random")
      .setTitle(`Translated to: English`)
      .addFields(
        { name: `\`Original Message:\``, value: msg },
        { name: `\`Translated Message:\``, value: res.text },
        {
          name: `\`Original Message Language:\``,
          value: ISO6391.getName(res.from.language.iso),
        }
      );

    await interaction.reply({ embeds: [replyEmbed] });
  },
};
