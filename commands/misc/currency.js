const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const CC = require("currency-converter-lt");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("currency")
    .setDescription("Convert a currency into another")
    .addStringOption((option) =>
      option
        .setName("from")
        .setDescription("The currency to convert from")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("to")
        .setDescription("The currency to convert to")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Amount to convert")
        .setRequired(true)
    ),
  global: false,
  async execute(interaction) {
    const ccfrom = interaction.options.getString("from");
    const ccto = interaction.options.getString("to");
    const amount = interaction.options.getInteger("amount");

    try {
      let currencyConverter = new CC({
        from: ccfrom,
        to: ccto,
        amount: amount,
        isDecimalComma: false,
      });

      const response = await currencyConverter.convert();

      const replyEmbed = new EmbedBuilder()
        .setColor("Random")
        .setTitle(`Converted **${ccfrom}** to **${ccto}**`)
        .addFields(
          { name: `\`${ccfrom}\``, value: `${amount.toString()} ${ccfrom}` },
          { name: `\`${ccto}\``, value: `${response.toString()} ${ccto}` }
        )
        .setTimestamp();
      await interaction.reply({ embeds: [replyEmbed] });
    } catch (error) {
      await interaction.reply(
        "An error occured. Please try again later. You could've used wrong names for currencies, for example, JPY is for the japanese yen."
      );
      console.log(error);
    }
  },
};
