import { Command } from "../../structures/Command";
import { Economy } from "../../models/economy";
import { EmbedBuilder } from "discord.js";
import ms from 'ms';

export default new Command({
    name: "dzienne",
    description: "💳 Otrzymujesz dziennie pieniądze",
    run: async ({interaction}) => {

        const db = await Economy.findOne({ userId: interaction.user.id }) || await Economy.create({ userId: interaction.user.id });

        if(db.cooldowns.daily.getTime() > Date.now()) {
            const time = ms(db.cooldowns.daily.getTime() - Date.now(), { long: true });
            return interaction.followUp({ content: `Musisz poczekać jeszcze ${time} aby móc otrzymać dziennie pieniądze!` });
        }
        
        const amount = Math.floor(Math.random() * 1000) + 500;

        db.wallet += amount;
        db.cooldowns.daily = Date.now() + ms("1d");
        db.save();

        const embed = new EmbedBuilder()
            .setAuthor({ name: "Dzienne", iconURL: interaction.user.displayAvatarURL() })
            .setDescription(`Otrzymałeś ${amount}!`)
            .setColor("LuminousVividPink")
            .setTimestamp()
    }
    
})