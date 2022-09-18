import { Command } from "../../structures/Command";
import { Economy } from "../../models/economy";
import { EmbedBuilder } from "discord.js";

export default new Command({
    name: "leaderboard",
    description: "📊 Sprawdź ranking",
    run: async ({interaction}) => {
            
            const db = await Economy.find().sort({ bank: -1 }).limit(10);
    
            // make a function that will take 10 most richest users and return them in a string
            const leaderboard = (await Promise.all(db.map(async (data, i) => {
                const user = await interaction.client.users.fetch(data.userId);
                return `${i + 1}. <@${data.userId}> - ${data.bank + data.wallet}$`;
            }))).join("\n");

            const embed = new EmbedBuilder()
                .setAuthor({ name: "Ranking", iconURL: interaction.user.displayAvatarURL() })
                .setColor("LuminousVividPink")
                .setTimestamp()
                .setDescription(leaderboard)
            
            interaction.followUp({ embeds: [embed] });
    }
})