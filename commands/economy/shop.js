const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder, Embed } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shop")
    .setDescription("View the items available for purchase"),
  global: true,
  async execute(interaction) {
    const item = {
      name: "Multiplier 1.5x",
      description:
        "Multiply your earnings by 1.5 from work, daily, slotmachine, and coinflip commands.",
      price: 35000,
    };

    const embed = new EmbedBuilder()
      .setColor("Random")
      .setTitle("Shop")
      .setDescription("Welcome to the shop! Here are the available items:")
      .addFields(
        { name: "Item", value: item.name },
        { name: "Description", value: item.description },
        { name: "Price", value: `**${item.price}** coins` }
      )
      .setTimestamp();

    await interaction.reply({ embeds: [embed] });
  },
};
