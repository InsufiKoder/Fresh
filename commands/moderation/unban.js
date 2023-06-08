const { SlashCommandBuilder } = require("@discordjs/builders");
const {
  EmbedBuilder,
  PermissionsBitField,
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  ComponentType,
} = require("discord.js");

module.exports = {
  data: new SlashCommandBuilder()
    .setName("unban")
    .setDescription("Unban a user from the server")
    .addStringOption((option) =>
      option
        .setName("userid")
        .setDescription("The ID of the user to unban")
        .setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Reason for the unban")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers),
  global: true,
  async execute(interaction) {
    const userId = interaction.options.getString("userid");
    const reason =
      interaction.options.getString("reason") ||
      "Unbanned by Fresh. No reason given.";

    // Check if the bot has the necessary permissions to unban members
    if (
      !interaction.guild.members.me.permissions.has(
        PermissionsBitField.Flags.BanMembers
      )
    ) {
      await interaction.reply("I don't have permission to unban members.");
      return;
    }

    const confirm = new ButtonBuilder()
      .setCustomId("confirmunban")
      .setLabel("Confirm Unban")
      .setStyle(ButtonStyle.Danger);

    const cancel = new ButtonBuilder()
      .setCustomId("cancelunban")
      .setLabel("Cancel Unban")
      .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder().addComponents(confirm, cancel);
    const response = await interaction.reply({
      content: `Are you sure you want to **unban** the user with  the id **${userId}**?`,
      components: [row],
      ephemeral: true,
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

        if (i.customId === "confirmunban") {
          await interaction.guild.members.unban(userId, { reason: reason });
          const replyEmbed = new EmbedBuilder()
            .setColor("Random")
            .setTitle(`Successfully unbanned user`)
            .setDescription(
              `User with the ID **${userId}** has been successfully unbanned.`
            )
            .addFields({ name: `\`Reason:\``, value: reason })
            .setTimestamp();

          await i.editReply({
            content: "",
            embeds: [replyEmbed],
            components: [],
          });
          collector.stop();
        } else if (i.customId === "cancelunban") {
          await i.editReply({
            content: "You cancelled the unban.",
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
