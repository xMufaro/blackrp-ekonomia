import { Command } from "../../structures/Command";
import { Economy } from "../../models/economy";
import { EmbedBuilder, ApplicationCommandOptionType } from "discord.js";

export default new Command({
    name: "przelej",
    description: "💳 Przelewa pieniądze do innego użytkownika",
    options: [
        {
            name: "uzytkownik",
            description: "Użytkownik do którego chcesz przelać pieniądze",
            type: ApplicationCommandOptionType.User,
            required: true
        },
        {
            name: "kwota",
            description: "Kwota którą chcesz przelać",
            type: ApplicationCommandOptionType.Integer,
            required: true
        }
    ],
    run: async ({ interaction }) => {

        if(!interaction.isChatInputCommand()) return;

        const user = interaction.user;
        const target = interaction.options.getUser("uzytkownik");
        const amount = interaction.options.getInteger("kwota");

        const db = await Economy.findOne({ userId: user.id }) || await Economy.create({ userId: user.id });
        const targetDB = await Economy.findOne({ userId: target.id }) || await Economy.create({ userId: target.id });

        if(amount > db.wallet) return interaction.followUp({ content: "Nie masz tyle pieniędzy w portfelu!" });

        db.wallet -= amount;
        targetDB.wallet += amount;
        db.save();
        targetDB.save();

        const embed = new EmbedBuilder()
            .setAuthor({ name: "Przelew", iconURL: user.displayAvatarURL() })
            .setDescription(`Przelano ${amount} do <@${target.id}>`)
            .setColor("LuminousVividPink")
            .setTimestamp()

        interaction.followUp({ embeds: [embed]});

    }
})