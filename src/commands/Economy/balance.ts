import { Command } from "../../structures/Command";
import { Economy } from "../../models/economy";
import { EmbedBuilder, ActionRowBuilder, ButtonBuilder, ButtonStyle, MessageActionRowComponentBuilder } from "discord.js";

export default new Command({
    name: "balans",
    description: "💳 Pokazuje twój stan konta",
    run: async ({ interaction, client }) => {

        const user = interaction.user;

        const db = await Economy.findOne({ userId: user.id }) || await Economy.create({ userId: user.id });

        const row = new ActionRowBuilder<MessageActionRowComponentBuilder>()
            .addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Success)
                    .setLabel("Wpłać")
                    .setCustomId("economy.deposit")
            ).addComponents(
                new ButtonBuilder()
                    .setStyle(ButtonStyle.Danger)
                    .setLabel("Wypłać")
                    .setCustomId("economy.withdraw")
            )

        const embed = new EmbedBuilder()
            .setAuthor({ name: "Balans", iconURL: user.displayAvatarURL() })
            .addFields(
                { name: "Portfel 💸⠀⠀", value: `${db.wallet}`, inline: true },
                { name: "Bank 💳", value: `${db.bank}`, inline: true },
            )
            .setColor("LuminousVividPink")
            .setTimestamp()

        interaction.followUp({ embeds: [embed], components: [row] });
    }
})