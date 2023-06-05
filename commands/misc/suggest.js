const { SlashCommandBuilder } = require("@discordjs/builders");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("suggestion")
    .setDescription("Suggest a new feature for the bot"),
  global: true,
  async execute(interaction) {},
};
