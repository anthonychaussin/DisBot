const {Client, GatewayIntentBits, REST, Routes, Collection, SlashCommandBuilder} = require('discord.js');
const fs = require('node:fs');
const path = require('node:path');
const schedule = require('node-schedule');
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

const eventsPath = path.join(__dirname, 'events');
const eventFiles = fs.readdirSync(eventsPath).filter(file => file.endsWith('.js'));

const rest = new REST({version: '10'}).setToken(process.env.TOKEN);

const CLEFCACHOT = '1015648044919836752';

let collections = Object.keys(JSON.parse(fs.readFileSync(path.join(__dirname, "collection.json"), "utf8"))).sort();

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

for (const c of collections) {
    const command = {
        data: new SlashCommandBuilder()
            .setName(c)
            .setDescription('Send a random ' + c + ' gif'),
        async execute(interaction) {
            if(hasRoleId(CLEFCACHOT, interaction.member.roles.cache.map(r => {return {id: r.id, name: r.name}}))){
                const collectionsUrl = JSON.parse(fs.readFileSync(path.join( __dirname, "collection.json"), "utf8"))[c];
                if(collectionsUrl.length > 0){
                    await interaction.reply({content: collectionsUrl[Math.floor(Math.random() * collectionsUrl.length)]});
                } else {
                    await interaction.reply({content: 'Aucune image dans cette collection', ephemeral: true});
                }
            } else {
                await interaction.reply({content: 'Reste ?? ta place\nhttps://s3.gifyu.com/images/ezgif-1-7cfd0fae35.gif', ephemeral: true});
            }
        },
    };

    commands.push(command.data.toJSON());
    // Set a new item in the Collection with the key as the command name and the value as the exported module
    if ('data' in command && 'execute' in command) {
        client.commands.set(command.data.name, command);
    }
}

// and deploy your commands!
(async () => {
    try {
        const data = await rest.put(
            Routes.applicationCommands(process.env.CLIENT_ID),
            {body: commands},
        );
   console.log(`Successfully reloaded ${data.length} application (/) commands.`);
    } catch (error) {
        console.error(error);
    }
})();

for (const file of eventFiles) {
    const event = require(path.join(eventsPath, file));
    if (event.once) {
        client.once(event.name, (...args) => event.execute(...args));
    } else {
        client.on(event.name, (...args) => event.execute(...args));
    }
}

console.log(eventFiles.length + ' events listened');
client.login(process.env.TOKEN);
function hasRoleId(id, roles){
    return roles.map(r => r.id.toString()).includes(id.toString());
}