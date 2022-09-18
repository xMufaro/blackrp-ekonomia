import { stringify } from "querystring";
import { Command } from "../../structures/Command";
import { ExtendedEmbed } from "../../structures/Embed";
import { EmbedBuilder } from "discord.js"
import axios from "axios"



export default new Command({
    name: "help",
    description: "📖 Pokazuje wszystkie komendy",
    run: async ({ interaction, client }) => {
        axios.get(`https://discord.com/api/v10/applications/${client.user.id}/guilds/${process.env.guildId}/commands`, {
            headers: {
                'Authorization': `Bot ${process.env.CLIENT_TOKEN}`
            }
        }).then(async (res: any) => {
            let arr = [];
            
            for (const cmd of res.data) {
                arr.push(`</${cmd.name}:${cmd.id}>`);
            }
            
            const embed = new EmbedBuilder()
                .setTitle("Lista komend")
                .setDescription(arr.join('\n'))
                .setColor("LuminousVividPink")
            interaction.followUp({ embeds: [embed] });
        })
    }
})