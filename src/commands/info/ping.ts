import { Command } from "../../structures/Command";
import { EmbedBuilder } from "discord.js";

export default new Command({
    name: "ping",
    description: "replies with pong",
    run: async ({ interaction, client }) => {

        interaction.followUp({
            embeds: [
                new EmbedBuilder()
                    .setAuthor({ name: "Ping", iconURL: client.user.displayAvatarURL() })
                    .addFields(
                        { name: "Ping", value: `${client.ws.ping}ms`, inline: true },
                        { name: "Latency", value: `${Date.now() - interaction.createdTimestamp}ms`, inline: true },
                        { name: "Gateway", value: `${client.ws.gateway}`, inline: true },
                        { name: "Status", value: `${client.ws.status}`, inline: true }
                    )
                    .setColor("LuminousVividPink")
                    .setTimestamp()
            ]
        });
    }
});
