const {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  SlashCommandBuilder,
  ComponentType,
  EmbedBuilder,
} = require("discord.js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("requestmoney")
    .setDescription("Request money from someone")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("The user you want to request money from")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Amount of money to request (max 5000)")
        .setRequired(true)
    ),
  global: false,
  async execute(interaction) {
    await interaction.reply("Please wait...");
    const targetUser = interaction.options.getUser("user");
    const amount = interaction.options.getInteger("amount");

    if (amount <= 0) {
      await interaction.editReply("Please enter a positive amount to send.");
      return;
    }
    if (amount > 5000) {
      await interaction.editReply("You cannot request more than 5000 coins.");
      return;
    }

    const databasePath = "database.json";
    let database = {};

    // Read the database file
    try {
      const data = fs.readFileSync(databasePath);
      database = JSON.parse(data);
    } catch (error) {
      console.log("Error reading database:", error);
      await interaction.editReply(
        "An error occurred while accessing the database."
      );
      return;
    }

    // Check if targetUser exists in the database
    if (!database[targetUser.id]) {
      await interaction.editReply(
        "The specified user is not registered in the database."
      );
      return;
    }
    // Check if sender exists in the database
    if (!database[interaction.user.id]) {
      await interaction.editReply("You are not registered in the database.");
      return;
    }

    const accept = new ButtonBuilder()
      .setCustomId("accept")
      .setLabel("Accept Request")
      .setStyle(ButtonStyle.Success);

    const decline = new ButtonBuilder()
      .setCustomId("decline")
      .setLabel("Decline request")
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().addComponents(accept, decline);
    const response = await interaction.reply({
      content: `${targetUser}, ${interaction.user} has requested **${amount}** coin(s) from you. Do you accept?`,
      components: [row],
    });

    try {
      const collector = response.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 3_600_000,
      });

      collector.on("collect", async (i) => {
        if (i.user.id !== targetUser.id) {
          interaction.followUp({
            content: "Only the mentioned user can use these buttons.",
            ephemeral: true,
          });
          return;
        }
        await i.reply("Please wait...");

        if (i.customId === "accept") {
          if (database[targetUser.id].walletBalance < amount) {
            await i.editReply("You don't have enough money to send.");
            return;
          }
          database[targetUser.id].walletBalance -= amount;
          database[interaction.user.id].walletBalance += amount;

          // Write the updated database back to the file
          fs.writeFileSync(databasePath, JSON.stringify(database));
          const replyEmbed = new EmbedBuilder()
            .setColor("Random")
            .setTitle("Money Sent")
            .setDescription(`Sent **${amount}** coins to ${interaction.user}.`)
            .setTimestamp();

          await i.editReply({
            content: ``,
            embeds: [replyEmbed],
            components: [],
          });
          collector.stop();
        } else if (i.customId === "decline") {
          const replyEmbed = new EmbedBuilder()
            .setColor("Random")
            .setTitle("Request Declined")
            .setDescription(`${targetUser} has declined your money request.`)
            .setTimestamp();

          await i.editReply({
            content: "",
            embeds: [replyEmbed],
            components: [],
          });
          collector.stop();
        }
      });
    } catch (e) {
      await interaction.editReply({
        content: "Confirmation not received within 1 minute, cancelling",
        components: [],
      });
      console.log(e);
    }
  },
};
