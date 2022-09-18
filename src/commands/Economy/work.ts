import { Command } from "../../structures/Command";
import { Economy } from "../../models/economy";
import { EmbedBuilder } from "discord.js";
import ms from "ms";

// 👮‍♂️🕵️💂‍♂️🥷👷‍♂️👨‍⚕️👨‍🏫👨‍🌾👨‍🍳👨‍🔧👨‍🏭👨‍🔬👨‍💻👨‍🎨👨‍✈️
const jobList = [
    "👮‍♂️ Policjant",
    "🕵️ Detektyw",
    "💂‍♂️ Strażnik",
    "🥷 Najemnik",
    "👷‍♂️ Budowniczy",
    "👨‍⚕️ Lekarz",
    "👨‍🏫 Nauczyciel",
    "👨‍🌾 Rolnik",
    "👨‍🍳 Kucharz",
    "👨‍🔧 Mechanik",
    "👨‍🏭 Robotnik",
    "👨‍🔬 Naukowiec",
    "👨‍💻 Programista",
    "👨‍🎨 Artysta",
    "👨‍✈️ Pilot",
]

export default new Command({
    name: "pracuj",
    description: "👨‍💼 Pracujesz i zarabiasz pieniądze",
    run: async ({ interaction, client }) => {

        const user = interaction.user;

        const db = await Economy.findOne({ userId: user.id }) || await Economy.create({ userId: user.id });

        const job = jobList[Math.floor(Math.random() * jobList.length)];

        const amount = Math.floor(Math.random() * (500 + (Math.random() * ((db.wallet + db.bank) * 0.05)))) + 300 ;


        if(db.cooldowns.work.getTime() > Date.now()) {
            const time = new Date(db.cooldowns.work.getTime() - Date.now()).toISOString().slice(11, 19);
            return interaction.followUp(`⏱ Musisz odczekać **${ms(db.cooldowns.work.getTime() - Date.now())}** przed ponownym użyciem tej komendy!`);
        }

        db.wallet += amount;
        db.cooldowns.work = new Date((new Date()).getTime() + 1000 * 60 * 60);
        db.save();

        const embed = new EmbedBuilder()
            .setAuthor({ name: "Praca", iconURL: user.displayAvatarURL() })
            .setDescription(`👨‍💼 Pracowałeś jako \`${job.split(" ")[0]}\` ${job.split(" ")[1]} i zarobiłeś ${amount} 💸`)
            .setColor("LuminousVividPink")
            .setTimestamp()

        interaction.followUp({ embeds: [embed] });

    }
})

