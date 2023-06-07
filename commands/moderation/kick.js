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
    .setName("kick")
    .setDescription("kick a user from the server")
    .addUserOption((option) =>
      option.setName("user").setDescription("User to kick").setRequired(true)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.KickMembers),
  global: true,
  async execute(interaction) {
    const user = interaction.options.getUser("user");

    // Check if the bot has the necessary permissions to kick members
    if (
      !interaction.guild.members.me.permissions.has(
        PermissionsBitField.Flags.KickMembers
      )
    ) {
      await interaction.reply("I don't have permission to kick members.");
      return;
    }

    const confirm = new ButtonBuilder()
      .setCustomId("confirmkick")
      .setLabel("Confirm Kick")
      .setStyle(ButtonStyle.Danger);

    const cancel = new ButtonBuilder()
      .setCustomId("cancelkick")
      .setLabel("Cancel Kick")
      .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder().addComponents(confirm, cancel);
    const response = await interaction.reply({
      content: `Are you sure you want to **kick** ${user}?`,
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

        if (i.customId === "confirmkick") {
          await interaction.guild.members.kick(user);
          const replyEmbed = new EmbedBuilder()
            .setColor("Random")
            .setTitle(`Successfully kicked ${user.username}`)
            .setDescription(`**${user.tag}** has been successfully kicked.`)
            .setTimestamp();

          await i.editReply({
            content: "",
            embeds: [replyEmbed],
            components: [],
          });
          collector.stop();
        } else if (i.customId === "cancelkick") {
          await i.editReply({
            content: "You cancelled the kick.",
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
