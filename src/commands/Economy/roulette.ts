import { Command } from "../../structures/Command";
import { Economy } from "../../models/economy";
import { EmbedBuilder, ApplicationCommandOptionType } from "discord.js";
import { ExtendedEmbed } from "../../structures/Embed";

export default new Command({
    name: "ruletka",
    description: "🎰 Graj w ruletkę",
    options: [
        {
            name: "stawka",
            description: "Kwota którą chcesz postawić",
            type: ApplicationCommandOptionType.Integer,
            required: true
        },
        {
            name: "kolor",
            description: "Kolor na który chcesz postawić",
            type: ApplicationCommandOptionType.String,
            required: true,
            choices: [
                {
                    "name": "Czerwony",
                    "value": "red"
                },
                {
                    "name": "Czarny",
                    "value": "black"
                },
                {
                    "name": "Zielony",
                    "value": "green"
                }
            ]
        }
    ],
    run: async ({ interaction }) => {

        if(!interaction.isChatInputCommand()) return;

        const user = interaction.user;
        const amount = interaction.options.getInteger("stawka", true);
        const color = interaction.options.getString("kolor", true);

        const economy = await Economy.findOne({ id: user.id });
        if (!economy) return interaction.followUp({ content: "Nie posiadasz konta w banku!" });

        if (economy.wallet < amount) return interaction.followUp({ content: "Nie posiadasz tyle pieniędzy w portfelu!" });

        const random = Math.floor(Math.random() * 37);
        const colors = ["red", "black", "green"];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        const embed = new ExtendedEmbed().rouletteEmbed(randomColor, user.tag, user.displayAvatarURL());
        if (randomColor === color) {
            await Economy.findOneAndUpdate({ id: user.id }, { $inc: { wallet: amount } });
            embed.setDescription(`Wygrałeś ${amount}!`);
            return interaction.followUp({ embeds: [embed] });
        } else {
            await Economy.findOneAndUpdate({ id: user.id }, { $inc: { wallet: -amount } });
            embed.setDescription(`Przegrałeś ${amount}!`);
            return interaction.followUp({ embeds: [embed] });
        }


    }
})