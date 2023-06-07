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
    .setName("ban")
    .setDescription("Ban a user from the server")
    .addUserOption((option) =>
      option.setName("user").setDescription("User to ban").setRequired(true)
    )
    .addStringOption((option) =>
      option
        .setName("reason")
        .setDescription("Reason of the ban")
        .setRequired(false)
    )
    .setDefaultMemberPermissions(PermissionsBitField.Flags.BanMembers),
  global: true,
  async execute(interaction) {
    const user = interaction.options.getUser("user");
    const reason =
      interaction.options.getString("reason") ||
      `Banned by Fresh. No reason given.`;

    // Check if the bot has the necessary permissions to ban members
    if (
      !interaction.guild.members.me.permissions.has(
        PermissionsBitField.Flags.BanMembers
      )
    ) {
      await interaction.reply("I don't have permission to ban members.");
      return;
    }

    const confirm = new ButtonBuilder()
      .setCustomId("confirmban")
      .setLabel("Confirm Ban")
      .setStyle(ButtonStyle.Danger);

    const cancel = new ButtonBuilder()
      .setCustomId("cancelban")
      .setLabel("Cancel Ban")
      .setStyle(ButtonStyle.Success);

    const row = new ActionRowBuilder().addComponents(confirm, cancel);
    const response = await interaction.reply({
      content: `Are you sure you want to **ban** ${user}?`,
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

        if (i.customId === "confirmban") {
          await interaction.guild.members.ban(user, { reason: reason });

          const replyEmbed = new EmbedBuilder()
            .setColor("Random")
            .setTitle(`Successfully banned ${user.username}`)
            .setDescription(`**${user.tag}** has been successfully banned.`)
            .addFields({ name: `\`Reason:\``, value: reason })
            .setTimestamp();

          await i.editReply({
            content: "",
            embeds: [replyEmbed],
            components: [],
          });
          collector.stop();
        } else if (i.customId === "cancelban") {
          await i.editReply({
            content: "You cancelled the ban.",
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
