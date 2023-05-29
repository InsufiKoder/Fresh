const {
  StringSelectMenuBuilder,
  StringSelectMenuOptionBuilder,
} = require("discord.js");

module.exports = {
  data: {
    id: "mySelectMenu",
    builder: new StringSelectMenuBuilder()
      .setCustomId("mySelectMenu")
      .setPlaceholder("Nothing selected")
      //.setMinValues(1)
      //.setMaxValues(2)
      .addOptions(
        new StringSelectMenuOptionBuilder()
          .setLabel("Option A")
          .setValue("a")
          .setDescription("Description"),
        new StringSelectMenuOptionBuilder()
          .setLabel("Option B")
          .setValue("b")
          .setDescription("Description"),
        new StringSelectMenuOptionBuilder()
          .setLabel("Option C")
          .setValue("c")
          .setDescription("Description")
          .setEmoji({ name: "😎" })
      ),
  },
  async execute(interaction) {
    const selected = interaction.values[0];
    await interaction.reply({
      content: `You selected option ${selected}!`,
      ephemeral: true,
    });
  },
};
