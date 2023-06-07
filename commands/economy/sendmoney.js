const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  EmbedBuilder,
  PermissionsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require("discord.js");
const fs = require("fs");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("sendmoney")
    .setDescription("send money to a user's balance")
    .addUserOption((option) =>
      option
        .setName("user")
        .setDescription("User to send money to")
        .setRequired(true)
    )
    .addIntegerOption((option) =>
      option
        .setName("amount")
        .setDescription("Amount of money to send")
        .setRequired(true)
    ),
  global: true,
  async execute(interaction) {
    const targetUser = interaction.options.getUser("user");
    const amount = interaction.options.getInteger("amount");

    if (amount <= 0) {
      await interaction.reply("Please enter a positive amount to send.");
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
      await interaction.reply(
        "An error occurred while accessing the database."
      );
      return;
    }

    // Check if targetUser exists in the database
    if (!database[targetUser.id]) {
      await interaction.reply(
        "The specified user is not registered in the database."
      );
      return;
    }
    // Check if sender exists in the database
    if (!database[interaction.user.id]) {
      await interaction.reply("You are not registered in the database.");
      return;
    }

    const confirm = new ButtonBuilder()
      .setCustomId("confirmsend")
      .setLabel("Confirm Sending Money")
      .setStyle(ButtonStyle.Success);

    const cancel = new ButtonBuilder()
      .setCustomId("cancelsend")
      .setLabel("Cancel Sending Money")
      .setStyle(ButtonStyle.Danger);

    const row = new ActionRowBuilder().addComponents(confirm, cancel);
    const response = await interaction.reply({
      content: `Are you sure you want to send **${amount}** coins to ${targetUser}?`,
      components: [row],
    });

    try {
      const collector = response.createMessageComponentCollector({
        componentType: ComponentType.Button,
        time: 3_600_000,
      });

      collector.on("collect", async (i) => {
        if (i.user.id !== interaction.user.id) {
          interaction.followUp({
            content: "Only the command user can use these buttons.",
            ephemeral: true,
          });
          return;
        }
        await i.reply("Please wait...");

        if (i.customId === "confirmsend") {
          database[interaction.user.id].walletBalance -= amount;
          database[targetUser.id].walletBalance += amount;

          // Write the updated database back to the file
          fs.writeFileSync(databasePath, JSON.stringify(database));

          const replyEmbed = new EmbedBuilder()
            .setColor("Random")
            .setTitle("Money Sent")
            .setDescription(
              `Sent **${amount}** coins to ${targetUser}'s wallet balance.`
            )
            .setTimestamp();

          await i.editReply({
            content: "",
            embeds: [replyEmbed],
            components: [],
          });
          collector.stop();
        } else if (i.customId === "cancelsend") {
          await i.editReply({
            content: "You cancelled the money transfer.",
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
