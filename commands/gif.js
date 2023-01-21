const {SlashCommandBuilder} = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');

const collections = Object.keys(JSON.parse(fs.readFileSync(path.join(__dirname, '..', "collection.json"), "utf8")))
.sort((e) => e.name).map(e => {return { name: e, value: e}});

const STAFF = '1015242521695223958';

module.exports = {
    data: new SlashCommandBuilder()
        .setName('gif')
        .setDescription('Controlez vos collections de gif')
        .addSubcommand((subCommand) =>
            subCommand.setName('add')
                .setDescription('Ajoute un gif à une collection')
                .addStringOption((option) =>
                    option.setName('collection')
                        .setDescription('Nom de la collection de gif')
                        .addChoices(...collections)
                        .setRequired(true))
                .addStringOption((option) =>
                    option.setName('url')
                        .setDescription('Url du gif')
                        .setRequired(true)))
        .addSubcommand((subCommand) =>
            subCommand.setName('del')
                .setDescription('Supprime un gif de la collection')
                .addStringOption((option) =>
                    option.setName('collection')
                        .setDescription('Nom de la collection de gif')
                        .addChoices(...collections)
                        .setRequired(true))
                .addStringOption((option) =>
                    option.setName('url')
                        .setDescription('Url du gif')
                        .setRequired(true))),
    async execute(interaction) {

        const author = interaction.user;
        if(hasRoleId(STAFF, interaction.member.roles.cache.map(r => {return {id: r.id, name: r.name}}))) {
            let collectionsUrl = JSON.parse(fs.readFileSync(path.join(__dirname, '..', "collection.json"), "utf8"));
            const collection = interaction.options.getString('collection');
            const url = interaction.options.getString('url');
            const action = interaction.options.getSubcommand();
            if (action === 'add') {
                if (collectionsUrl[collection].filter(k => k === url).length === 0) {
                    collectionsUrl[collection].push(url);
                }
            } else {
                if (collectionsUrl[collection].filter(k => k === url).length > 0) {
                    collectionsUrl[collection].remove(url);
                }
            }
            fs.writeFileSync(path.join(__dirname, '..', "collection.json"), JSON.stringify(collectionsUrl));
            await interaction.reply({
                content: (action === 'add' ? 'Ajout' : 'Suppression') + ' à la collection ' + collection + ' faite !',
                ephemeral: true
            });
        }else {
            await interaction.reply({
                content: 'https://s3.gifyu.com/images/ezgif-1-7cfd0fae35.gif',
                ephemeral: true
            });
        }
    },
};


function hasRoleId(id, roles) {
    return roles.map(r => r.id.toString()).includes(id.toString());
}
