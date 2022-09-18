import { EmbedBuilder } from "discord.js";

export class ExtendedEmbed extends EmbedBuilder {
    constructor() {
        super();
    }
    public moderationEmbed(userId: string, userTag: string) {
        this.setColor("LuminousVividPink");
        this.setFooter({ text: `Wykonane przez ${userTag} | ${userId}` })
        this.setTimestamp();
        return this;
    }
    public defaultEmbed(cmdName: string, avatarURL: string) {
        this.setColor("LuminousVividPink");
        this.setAuthor({ name: `${cmdName}`, iconURL: avatarURL })
        return this;
    }
    public helpEmbed(cmdList: string[]) {
        this.setTitle("Lista komend");
        this.setColor("LuminousVividPink")
        let str: string;
        (async () => {
            await Promise.all(cmdList.map(async (cmd, i) => {
                str += `</${cmd[0]}:${cmd[1]}>`
            }))
        })();
        this.setDescription(str)
    }
    public rouletteEmbed(color: string, userTag: string, avatarURL: string) {
        this.setAuthor({ name: "Ruletka", iconURL: avatarURL })
        this.setTitle(`Wylosowano ${color}`)
        return this
    }
}