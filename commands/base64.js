const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("base64")
    .setDescription("Encrypt/Decrypt text")
    .addStringOption((option) =>
      option
        .setName("data")
        .setDescription("Data to encrypt or decrypt")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("operation")
        .setDescription("Choose the operation")
        .setRequired(true)
        .addChoices(
          {
            name: "encrypt",
            value: "encrypt",
          },
          {
            name: "decrypt",
            value: "decrypt",
          }
        )
    ),
  global: true,
  async execute(interaction) {
    const data = interaction.options.getString("data");
    const operation = interaction.options.getString("operation");

    try {
      if (operation == "encrypt") {
        buff = new Buffer.from(data);
        converted = buff.toString("base64");
      } else if (operation == "decrypt") {
        buff = new Buffer.from(data, "base64");
        converted = buff.toString("ascii");
      }

      const replyEmbed = new EmbedBuilder()
        .setColor("Random")
        .setTitle(`${operation}ion sucessful`)
        .addFields(
          { name: `\`Original data\``, value: data },
          { name: `\`Converted data\``, value: converted }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [replyEmbed] });
    } catch (error) {
      interaction.reply("An error occured. Please try again later.");
      console.log(error);
    }
  },
};
