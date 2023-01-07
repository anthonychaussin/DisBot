const { Events } = require('discord.js');

module.exports = {
    name: Events.GuildMemberUpdate,
    once: false,
    execute(client) {
        console.log(`User updated ${client.user.tag}`);
    },
};