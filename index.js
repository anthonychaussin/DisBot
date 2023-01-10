const {Client, GatewayIntentBits, REST, Routes, Collection, SlashCommandBuilder} = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const cron = require('node-cron');
require('dotenv').config()
const client = new Client({intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers,
    ]});
client.commands = new Collection();
const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

const commands = [];

for (const file of commandFiles) {
    const filePath = path.join(commandsPath, file);
    const command = require(filePath);
    commands.push(command.data.toJSON());
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command at ${filePath} is missing a required "data" or "execute" property.`);
    }
}

var collections = Object.keys(JSON.parse(fs.readFileSync(path.join(__dirname, "collection.json"), "utf8"))).sort();
for (const c of collections) {
    const command = {
        data: new SlashCommandBuilder()
            .setName(c)
            .setDescription('Send a random ' + c + ' gif'),
        async execute(interaction) {
            var userRoles = interaction.member.roles.cache.map(r => {return {id: r.id, name: r.name}});
            if(hasRoleName('Clef cachot', userRoles)){
                var collectionsUrl = JSON.parse(fs.readFileSync(path.join( __dirname, "collection.json"), "utf8"))[c];
                if(collectionsUrl.length > 0){
                    await interaction.reply({content: collectionsUrl[Math.floor(Math.random() * collectionsUrl.length)]});
                } else {
                    await interaction.reply({content: 'Aucune image dans cette collection', ephemeral: true});
                }
            } else {
                await interaction.reply({content: 'Non non', ephemeral: true});
            }
        },
    };
    commands.push(command.data.toJSON());
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    } else {
        console.log(`[WARNING] The command ${c} is missing a required "data" or "execute" property.`);
    }
}

// Construct and prepare an instance of the REST module
const rest = new REST({version: '10'}).setToken(process.env.TOKEN);

// and deploy your commands!
(async () => {
    try {
        console.log(`Started refreshing ${commands.length} application (/) commands.`);
        // The put method is used to fully refresh all commands in the guild with the current set
        const data = await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            {body: commands},
        );

        console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        // And of course, make sure you catch and log any errors!
        console.error(error);
    }
})();

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

for (const file of eventFiles) {
    const filePath = path.join(eventsPath, file);
    const event = require(filePath);
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

console.log(eventFiles.length + ' events listened');

client.login(process.env.TOKEN);

function hasRoleName(roleName, roles){
    return roles.map(r => r.name).includes(roleName);
}