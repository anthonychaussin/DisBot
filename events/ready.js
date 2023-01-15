const { Events } = require('discord.js');
const fs = require("node:fs");
const path = require("node:path");
const schedule = require("node-schedule");

module.exports = {
    name: Events.ClientReady,
    once: false,
    execute(client) {
        let crons = JSON.parse(fs.readFileSync(path.join(__dirname, '..', "cron.json"), "utf8"));
        /*crons.forEach(crono => {
            if(crono.action === 1){
                try{
                    console.info(crono.target.id)
                    console.info(client.users.cache.get(crono.target.id));
                    schedule.scheduleJob(crono.cron.toString(), function() {
                        try {
                            let user = client.users.get(crono.target.id);
                            user.roles.add(crono.target.guild.roles.cache.find(r => r.name === 'Prisonnier')).catch(console.error);
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
                    schedule.scheduleJob(crono.cron.toString(), function() {
                        crono.object.target.roles.remove(crono.target.guild.roles.cache.find(r => r.name === 'Prisonnier')).catch(console.error);
                        console.info(crono.target.username + ' dehors');
                    });
                } catch (e){
                    console.info(e);
                }
            }
        });*/
        console.log(`Ready! Logged in as ${client.user.tag}`);
    },
};