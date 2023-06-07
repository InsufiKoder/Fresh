const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("shop")
    .setDescription("View the items available for purchase"),
  global: true,
  async execute(interaction) {
    const items = [
      {
        name: "Multiplier 1.5x",
        description:
          "Multiply your earnings by 1.5 from work, daily, slotmachine, and coinflip commands.",
        price: 35000,
      },
      {
        name: "Fishing Rod",
        description: "Catch fish and earn rewards.",
        price: 5000,
      },
    ];

    const replyEmbed = new EmbedBuilder()
      .setColor("Random")
      .setTitle("Shop")
      .setDescription("Welcome to the shop! Here are the available items:");

    items.forEach((item) => {
      replyEmbed.addFields(
        { name: "Item", value: item.name },
        { name: "Description", value: item.description },
        { name: "Price", value: `**${item.price}** coins` }
      );
    });
    replyEmbed.setTimestamp();

    await interaction.reply({ embeds: [replyEmbed] });
  },
};
