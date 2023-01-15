const {SlashCommandBuilder} = require('discord.js');
const shell = require('shelljs');
const fs = require('node:fs');
const path = require('node:path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('couvre-feu')
        .setDescription('Couvre feu a un user')
        .setDefaultMemberPermissions(0)
        .addSubcommand((subCommand) =>
            subCommand.setName('add')
                .setDescription('Ajoute un couvre feu à un user')
                .addIntegerOption((option) =>
                    option.setName('heure')
                        .setDescription('Heure de mise en cage')
                        .setRequired(true))
                .addIntegerOption((option) =>
                    option.setName('minute')
                        .setDescription('Minute de mise en cage')
                        .setRequired(true))
                .addIntegerOption((option) =>
                    option.setName('heure2')
                        .setDescription('Heure de libération')
                        .setRequired(true))
                .addIntegerOption((option) =>
                    option.setName('minute2')
                        .setDescription('Minute de libération')
                        .setRequired(true))
                .addUserOption((option) =>
                    option.setName('target')
                        .setDescription('Soumis(e) à mettre en cage')
                        .setRequired(true)))
        .addSubcommand((subCommand) =>
            subCommand.setName('del')
                .setDescription('Supprime un couvre-feu')
                .addUserOption((option) =>
                    option.setName('target')
                        .setDescription('Soumis(e) à mettre en cage')
                        .setRequired(true))),
    async execute(interaction) {
        const author = interaction.user;
        if (hasRoleName('👑 Staff', interaction.member.roles.cache.map(r => {
            return {id: r.id, name: r.name}
        }))) {
            let crons = JSON.parse(fs.readFileSync(path.join(__dirname, '..', "cron.json"), "utf8"));
            const action = interaction.options.getSubcommand();
            const target = interaction.options.getUser('target');
            if (action === 'add') {
                crons.push({
                    cron: '0 ' + interaction.options.getInteger('minute') + ' ' + (interaction.options.getInteger('heure')-1) + ' * * *',
                    action: 0,
                    author: author.username,
                    target: target,
                    guildId: interaction.guildId
                })
                crons.push({
                    cron: '0 ' + interaction.options.getInteger('minute2') + ' ' + (interaction.options.getInteger('heure2')-1) + ' * * *',
                    action: 1,
                    author: author.username,
                    target: target,
                    guildId: interaction.guildId
                })
            } else {
                crons.filter(c => c.author === author.username && c.target === target).forEach(c => crons.pop(c));
            }
            fs.writeFileSync(path.join(__dirname, '..', "cron.json"), JSON.stringify(crons));
            await interaction.reply({
                content: 'Ok je m\'en souviendrais ! ',
                ephemeral: true
            });
            setTimeout(() => {
                shell.exec('pm2 restart index');
            }, 3*1000);
        } else {
            await interaction.reply({
                content: 'Nope, cette commande n\'est pas pour toi :P',
                ephemeral: true
            });
        }
    },
};


function hasRoleName(roleName, roles) {
    return roles.map(r => r.name).includes(roleName);
}
