const { SlashCommandBuilder } = require("@discordjs/builders");
const { EmbedBuilder } = require("discord.js");
const answers = [
  "It is certain.",
  "It is decidedly so.",
  "Without a doubt.",
  "Yes - definitely.",
  "You may rely on it.",
  "As I see it, yes.",
  "Most likely.",
  "Outlook good.",
  "Yes.",
  "Signs point to yes.",
  "Reply hazy, try again.",
  "Ask again later.",
  "Better not tell you now.",
  "Cannot predict now.",
  "Concentrate and ask again.",
  "Don't count on it.",
  "My reply is no.",
  "My sources say no.",
  "Outlook not so good.",
  "Very doubtful.",
];

module.exports = {
  data: new SlashCommandBuilder()
    .setName("8ball")
    .setDescription("Ask something to the magic 8-Ball")
    .addStringOption((option) =>
      option
        .setName("question")
        .setDescription("Question to ask")
        .setRequired(true)
    ),
  global: true,
  async execute(interaction) {
    const question = interaction.options.getString("question");

    try {
      const replyEmbed = new EmbedBuilder()
        .setColor("Random")
        .setTitle(`🎱  The Magic 8-Ball  🎱`)
        .addFields(
          { name: "Question", value: question },
          {
            name: "Answer",
            value: answers[Math.floor(Math.random() * answers.length)],
          }
        )
        .setTimestamp();

      await interaction.reply({ embeds: [replyEmbed] });
    } catch (error) {
      await interaction.reply("An error occured. Please try again later.");
      console.log(error);
    }
  },
};
