const {Events} = require('discord.js');
const fs = require("node:fs");
const path = require("node:path");
const schedule = require("node-schedule");

module.exports = {
    name: Events.ClientReady,
    once: false,
    execute(client) {
        let crons = JSON.parse(fs.readFileSync(path.join(__dirname, '..', "cron.json"), "utf8"));
        crons.forEach(crono => {
            if (crono.action === 0) {
                try {
                    schedule.scheduleJob(crono.cron.toString(), async function () {
                        console.log('cachot job');
                        try {
                            let user = await (await client.guilds.fetch(crono.guildId)).members.fetch(crono.target);
                            user.roles.add(user.guild.roles.cache.find(r => r.name === 'Prisonnier')).catch(console.error);
                            user.roles.remove(user.guild.roles.cache.find(r => r.name === 'Membre')).catch(console.error);
                            console.info(user.username + ' au cachot');
                            await user.send(crono.author + ' t\'a envoyé(e) au cachot');
                        } catch (ex) {
                            console.info(ex);
                        }
                    });
                } catch (e) {
                    console.info(e);
                }
            } else {
                try {
                    schedule.scheduleJob(crono.cron.toString(), async function () {
                        let user = await (await client.guilds.fetch(crono.guildId)).members.fetch(crono.target);
                        user.roles.remove(user.guild.roles.cache.find(r => r.name === 'Prisonnier')).catch(console.error);
                        user.roles.add(user.guild.roles.cache.find(r => r.name === 'Membre')).catch(console.error);
                        console.info(user.username + ' dehors');
                        await user.send(crono.author + ' t\'a libéré(e)');
                    });
                } catch (e) {
                    console.info(e);
                }
            }
        });
        console.log(`Ready! Logged in as ${client.user.tag}`);
    },
};
