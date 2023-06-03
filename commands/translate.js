const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const translate = require("google-translate-api-x");
const ISO6391 = require("iso-639-1");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("translate")
    .setDescription("Translate some text to another language")
    //.setDefaultMemberPermissions(0) Set Permission
    .addStringOption((option) =>
      option
        .setName("text")
        .setDescription("Text to translate")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("language")
        .setDescription("Language to translate to")
        .setRequired(true)
    ),
  global: true,
  async execute(interaction) {
    try {
      await interaction.deferReply();
      const text = interaction.options.getString("text");
      const lang = interaction.options.getString("language");

      const res = await translate(text, { to: lang });
      const iso = ISO6391.getName(lang) || lang;
      await interaction.reply(`Translating **${text}** to: **${iso}**`);

      const replyEmbed = new EmbedBuilder()
        .setColor("Random")
        .setTitle(`Translated to: ${iso}`)
        .addFields(
          { name: `\`Original Message:\``, value: text },
          { name: `\`Translated Message:\``, value: res.text },
          {
            name: `\`Original Message Language:\``,
            value: `${ISO6391.getName(
              res.from.language.iso
            )} | ${ISO6391.getNativeName(res.from.language.iso)}`,
          }
        )
        .setTimestamp();

      await interaction.editReply({ content: "", embeds: [replyEmbed] });
    } catch (err) {
      await interaction.deferReply();
      await interaction.reply({
        content: "Please enter a valid language and try again.",
      });
      console.log(err);
    }
  },
};
