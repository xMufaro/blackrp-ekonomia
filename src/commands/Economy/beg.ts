import { Command } from "../../structures/Command";
import { Economy } from "../../models/economy";
import { EmbedBuilder } from "discord.js";
import ms from 'ms';

export default new Command({
    name: "zebraj",
    description: "🤲 Zbieraj pieniądze od innych",
    run: async ({interaction}) => {

        const db = await Economy.findOne({ userId: interaction.user.id }) || await Economy.create({ userId: interaction.user.id });

        if(db.cooldowns.beg.getTime() > Date.now()) {
            const time = ms(db.cooldowns.beg.getTime() - Date.now(), { long: false   });
            return interaction.followUp({ content: `Musisz poczekać jeszcze ${time} aby móc zebrać pieniądze!` });
        }
        
        const amount = Math.floor(Math.random() * 250) + 10;

        db.wallet += amount;
        db.cooldowns.beg = Date.now() + ms("20min");
        db.save();

        const embed = new EmbedBuilder()
            .setAuthor({ name: "Żebranie", iconURL: interaction.user.displayAvatarURL() })
            .setDescription(`Zebrałeś ${amount}!`)
            .setColor("LuminousVividPink")
            .setTimestamp()

        interaction.followUp({ embeds: [embed] });
    }
})