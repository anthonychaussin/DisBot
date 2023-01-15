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
                            let user = await (await client.guilds.fetch(crono.guildId)).members.fetch(crono.target.id);
                            console.info(user);
                            user.roles.add(user.guild.roles.cache.find(r => r.name === 'Prisonnier')).catch(console.error);
                            console.info(user.username + ' au cachot');
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
                        console.log('cachot action1');
                        let user = await (await client.guilds.fetch(crono.guildId)).members.fetch(crono.target.id);
                        user.roles.remove(user.guild.roles.cache.find(r => r.name === 'Prisonnier')).catch(console.error);
                        console.info(crono.target.username + ' dehors');
                    });
                } catch (e) {
                    console.info(e);
                }
            }
        });
        console.log(`Ready! Logged in as ${client.user.tag}`);
    },
};