const {SlashCommandBuilder} = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('couvre-feu')
        .setDescription('Couvre feu a un user')
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
        var cron = JSON.parse(fs.readFileSync(path.join(__dirname, '..', "cron.json"), "utf8"));
        const action = interaction.options.getSubcommand();
        const target = interaction.options.getUser('target').id;
        if(action === 'add'){
            cron.push({cron:'0 0 0 * * *', action:0, author:interaction.user.username, target:target})
            cron.push({cron:'0 10 0 * * *', action:1, author:interaction.user.username, target:target})
        } else {
            cron.filter(c => c.author === interaction.user.username && c.target === target).forEach(c => cron.pop(c));
        }
        fs.writeFileSync(path.join(__dirname, '..', "cron.json"), JSON.stringify(cron));
        await interaction.reply({
            content: 'C\'est pas encore prèt, mais ça arrive',
            ephemeral: true
        });
    },
};