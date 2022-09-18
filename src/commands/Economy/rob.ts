import { Command } from "../../structures/Command";
import { Economy } from "../../models/economy";
import { EmbedBuilder, ApplicationCommandOptionType } from "discord.js";
import ms from 'ms';

export default new Command({
    name: "okradnij",
    description: "🔫 Zabierz pieniądze od innych",
    options: [
        {
            name: "użytkownik",
            description: "Użytkownik którego pieniądze chcesz okraść",
            type: ApplicationCommandOptionType.User,
            required: true
        }
    ],
    run: async ({ interaction }) => {
            
            const user = interaction.user;
            const target = interaction.options.getUser("użytkownik");
    
            const db = await Economy.findOne({ userId: user.id }) || await Economy.create({ userId: user.id });
            const targetDB = await Economy.findOne({ userId: target.id }) || await Economy.create({ userId: target.id });
    
            if(db.cooldowns.rob.getTime() > Date.now()) {
                const time = ms(db.cooldowns.rob.getTime() - Date.now(), { long: false });
                return interaction.followUp({ content: `Musisz poczekać jeszcze ${time} aby móc okraść kogoś!` });
            }
    
            if(target.id === user.id) return interaction.followUp({ content: "Nie możesz okraść siebie!" });
    
            const amount = Math.floor(Math.random() * (targetDB.wallet * 0.5));
    
            db.wallet += amount;
            targetDB.wallet -= amount;
            db.cooldowns.rob = Date.now() + ms("20min");
            db.save();
            targetDB.save();
    
            const embed = new EmbedBuilder()
                .setAuthor({ name: "Okradanie", iconURL: user.displayAvatarURL() })
                .setDescription(`Okradłeś ${amount} od <@${target.id}>`)
                .setColor("LuminousVividPink")
                .setTimestamp()
    
            interaction.followUp({ embeds: [embed] });
    
    }
})