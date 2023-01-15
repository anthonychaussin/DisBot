const {SlashCommandBuilder} = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('keys')
        .setDescription('Ajoute ou retire les clés du cachot à un membre')
        .setDefaultMemberPermissions(0)
        .addSubcommand((subCommand) =>
            subCommand.setName('ignore')
                .setDescription('Ajoute un user à la liste des utilisateurs à ignorer')
                .addUserOption((option) =>
                    option.setName('target')
                        .setDescription('Utilisateur')
                        .setRequired(true)))
        .addSubcommand((subCommand) =>
            subCommand.setName('watch')
                .setDescription('Retire un user à la liste des utilisateurs à ignorer')
                .addUserOption((option) =>
                    option.setName('target')
                        .setDescription('Utilisateur')
                        .setRequired(true))),
    async execute(interaction) {
        const userCollection = JSON.parse(fs.readFileSync(path.join(__dirname, '..', "userIgnore.json"), "utf8"));
        const action = interaction.options.getSubcommand();
        if(action === 'ignore'){
            userCollection.add(interaction.options.getUser('target').id);
        } else {
            userCollection.remove(interaction.options.getUser('target').id);
        }
        fs.writeFileSync(path.join(__dirname, '..', "userIgnore.json"), JSON.stringify(userCollection));
        await interaction.reply({
            content: 'je ' + action === 'ignore' ? 'ne surveillerais plus ' : 'surveillerais ' + interaction.options.getUser('target').username,
            ephemeral: true
        });
    },
};