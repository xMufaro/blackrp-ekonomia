import { CommandInteractionOptionResolver,
    InteractionType,
    ActionRowBuilder,
    ModalActionRowComponentBuilder,
    TextInputBuilder,
    ModalBuilder,
    TextInputStyle
} from "discord.js";
import { client } from "..";
import { Event } from "../structures/Event";
import { ExtendedInteraction } from "../typings/Command";
import { Economy } from "../models/economy";

export default new Event("interactionCreate", async (interaction) => {
    // Chat Input Commands
    const user = interaction.user
    if (interaction.isCommand()) {
        await interaction.deferReply();
        const command = client.commands.get(interaction.commandName);
        if (!command)
            return interaction.followUp("You have used a non existent command");

        command.run({
            args: interaction.options as CommandInteractionOptionResolver,
            client,
            interaction: interaction as ExtendedInteraction
        });
    } else if (interaction.type === InteractionType.MessageComponent) {

        if(interaction.customId == "economy.deposit")
        {
            
        const user = interaction.user;

        const db = await Economy.findOne({ userId: user.id }) || await Economy.create({ userId: user.id });
        console.log(1)
        const row = new ActionRowBuilder<ModalActionRowComponentBuilder>()
            .addComponents(
                new TextInputBuilder()
                    .setCustomId("deposit.input")
                    .setPlaceholder(`Wpłać MAX: ${db.wallet}`)
                    .setLabel("Kwota")
                    .setStyle(TextInputStyle.Short)
            )
        console.log(3)
        const modal = new ModalBuilder()
            .setTitle("Wpłata")
            .setCustomId(`economy.deposit`)
            .addComponents(row)
        await interaction.showModal(modal);
        } else if(interaction.customId == "economy.withdraw")
        {
            
        const user = interaction.user;

        const db = await Economy.findOne({ userId: user.id }) || await Economy.create({ userId: user.id });
        console.log(1)
        const row = new ActionRowBuilder<ModalActionRowComponentBuilder>()
            .addComponents(
                new TextInputBuilder()
                    .setCustomId("withdraw.input")
                    .setPlaceholder(`Wpłać MAX: ${db.bank}`)
                    .setLabel("Kwota")
                    .setStyle(TextInputStyle.Short)
            )
        console.log(3)
        const modal = new ModalBuilder()
            .setTitle("Wpłata")
            .setCustomId(`economy.withdraw`)
            .addComponents(row)
        await interaction.showModal(modal);
        }
    } else if(interaction.type == InteractionType.ModalSubmit) {


        if(interaction.customId.startsWith("economy.deposit")) {
            const user = interaction.user;
            const db = await Economy.findOne({ userId: user.id }) || await Economy.create({ userId: user.id });
            const amount = parseInt(interaction.fields.getTextInputValue("deposit.input"));

            if(typeof amount != "number") return interaction.reply("Podaj prawidłową kwotę");

            if(amount > db.wallet) {
                interaction.reply("Nie masz tyle pieniędzy w portfelu");
            } else {
                db.wallet -= amount;
                db.bank += amount;
                await db.save();
                interaction.reply(`Wpłacono ${amount} na konto`);
            }
        } else if(interaction.customId.startsWith("economy.withdraw")) {
            const user = interaction.user;
            const db = await Economy.findOne({ userId: user.id }) || await Economy.create({ userId: user.id });
            const amount = parseInt(interaction.fields.getTextInputValue("withdraw.input"));

            if(typeof amount != "number") return interaction.reply("Podaj prawidłową kwotę");

            if(amount > db.bank) {
                interaction.reply("Nie masz tyle pieniędzy na koncie");
            } else {
                db.bank -= amount;
                db.wallet += amount;
                await db.save();
                interaction.reply(`Wypłacono ${amount}`);
            }
        }



    }
});
