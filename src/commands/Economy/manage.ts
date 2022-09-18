import { Command } from "../../structures/Command";
import { Economy } from "../../models/economy";
import { EmbedBuilder, ApplicationCommandOptionType } from "discord.js";
import { ExtendedEmbed } from "../../structures/Embed";

export default new Command({
    name: "zarzadzaj",
    description: "🏦 Zarządzaj balansem uzytkownika",
    options: [
        {
            name: "uzytkownik",
            description: "Użytkownik którego pieniądze chcesz zarządzać",
            type: ApplicationCommandOptionType.SubcommandGroup,
            options: [
                {
                    name: "ustaw_saldo",
                    description: "Ustawia saldo użytkownika",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "uzytkownik",
                            description: "Użytkownik którego pieniądze chcesz zarządzać",
                            type: ApplicationCommandOptionType.User,
                            required: true

                        },
                        {
                            name: "kwota",
                            description: "Kwota którą chcesz ustawić",
                            type: ApplicationCommandOptionType.Integer,
                            required: true
                        },
                        {
                            name: "cel",
                            description: "Cel na który chcesz ustawić kwotę",
                            type: ApplicationCommandOptionType.String,
                            required: true,
                            choices: [
                                {
                                    name: "Portfel",
                                    value: "wallet"
                                },
                                {
                                    name: "Bank",
                                    value: "bank"
                                }
                            ]
                        }
                    ]
                },
                {
                    name: "resetuj_saldo",
                    description: "Resetuje saldo użytkownika",
                    type: ApplicationCommandOptionType.Subcommand,
                    options: [
                        {
                            name: "uzytkownik",
                            description: "Użytkownik którego pieniądze chcesz zarządzać",
                            type: ApplicationCommandOptionType.User,
                            required: true
                        }
                    ]
                }
            ]
        }
    ],
    run: async ({ interaction }) => {

        if(!interaction.isChatInputCommand()) return;
        const scg = interaction.options.getSubcommandGroup();
        const sc = interaction.options.getSubcommand();

        switch(scg) {

            case "uzytkownik": {

                switch(sc) {

                    case "ustaw_saldo": {
                        const user = interaction.user,
                        target = interaction.options.getUser("uzytkownik"),
                        amount = interaction.options.getInteger("kwota"),
                        c = interaction.options.getString("cel"),
                        targetDB = await Economy.findOne({ userId: target.id }) || await Economy.create({ userId: target.id });
                        let oldAmount: number;
                        if(c == "wallet") {
                            targetDB.wallet = amount;
                            targetDB.save();
                            oldAmount = targetDB.wallet;
                        } else {
                            targetDB.bank = amount;
                            targetDB.save();
                            oldAmount = targetDB.bank;
                        }
                    
                        const embed = new ExtendedEmbed().moderationEmbed(user.tag, user.id)
                            .setAuthor({ name: "Zarządzanie ⚒️", iconURL: user.displayAvatarURL() })
                            .setDescription(`Ustawiono ${oldAmount}:\n na ${amount}\n dla <@${target.id}>\n do ${c}`)
                    
                        interaction.followUp({ embeds: [embed] })
                        break;
                    }
                    case "resetuj_saldo": {
                        const user = interaction.user,

                        target = interaction.options.getUser("uzytkownik"),
                        targetDB = await Economy.findOne({ userId: target.id }) || await Economy.create({ userId: target.id });

                        targetDB.wallet = 0;
                        targetDB.bank = 0;
                        targetDB.save();

                        const embed = new ExtendedEmbed().moderationEmbed(user.tag, user.id)
                            .setAuthor({ name: "Zarządzanie ⚒️", iconURL: user.displayAvatarURL() })
                            .setDescription(`Zresetowano saldo:\n dla <@${target.id}>`)
                        interaction.followUp({ embeds: [embed] })
                        break;

                    }

                }
        
              break;
            }

        }
    }
})