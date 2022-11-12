const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("freshcalculator")
    .setDescription(
      "Calculates your basedness, simpness, cringeness, gayness, dicksize and more (%99 correct!)"
    )
    .addStringOption((option) =>
      option
        .setName("calculator")
        .setDescription("Select a calculator")
        .setRequired(true)
        .addChoices(
          {
            name: "Based",
            value: "based",
          },
          {
            name: "Simp",
            value: "simp",
          },
          {
            name: "Gay",
            value: "gay",
          },
          {
            name: "Cringe",
            value: "cringe",
          },
          {
            name: "Gamer",
            value: "gamer",
          },
          {
            name: "Dicksize",
            value: "dicksize",
          }
        )
    )
    .addStringOption((option) =>
      option
        .setName("thing")
        .setDescription("The thing to calculate it's stuff")
        .setRequired(false)
    ),
  global: true,
  async execute(interaction) {
    const type = interaction.options.getString("calculator");
    const target =
      interaction.options.getString("thing") || interaction.user.username;
    const rng = Math.floor(Math.random() * 101);

    const first = type.charAt(0).toUpperCase();
    const rest = type.slice(1);
    const all = first + rest;

    if (all == "Dicksize") {
      let ppSize = Math.floor(Math.random() * 50) + 1;
      ppSize = "=".repeat(ppSize);
      const replyEmbed = new EmbedBuilder()
        .setColor("Random")
        .setTitle(`${all} Calculator`)
        .setDescription(`${target}'s ${all} is: 8` + `${ppSize}` + "D")
        .setTimestamp();

      await interaction.reply({ embeds: [replyEmbed] });
    } else {
      const replyEmbed = new EmbedBuilder()
        .setColor("Random")
        .setTitle(`${all}ness Calculator`)
        .setDescription(`${target} is ` + rng + `% ${all}`)
        .setTimestamp();

      await interaction.reply({ embeds: [replyEmbed] });
    }
  },
};
