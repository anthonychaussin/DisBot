const {SlashCommandBuilder} = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('list')
        .setDescription('Affiche les stats de vos collections')
        .setDefaultMemberPermissions(0),
    async execute(interaction) {
        const collectionsUrl = JSON.parse(fs.readFileSync(path.join(__dirname, '..', "collection.json"), "utf8"));
        await interaction.reply({
            content: Object.keys(collectionsUrl).sort()
                .map(k => ' - ' + k + ' : ' + collectionsUrl[k].length).join("\r\n"),
            ephemeral: true
        });
    },
};