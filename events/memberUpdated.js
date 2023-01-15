const {Events, EmbedBuilder} = require('discord.js');
const fs = require("node:fs");
const path = require("node:path");

module.exports = {
    name: Events.GuildMemberUpdate,
    once: false,
    execute(oldMember, newMember) {
        const userCollection = JSON.parse(fs.readFileSync(path.join(__dirname, '..', "userIgnore.json"), "utf8"));
        const firstTime = JSON.parse(fs.readFileSync(path.join(__dirname, '..', "firstTime.json"), "utf8"));
        if(!userCollection.includes(newMember.user.id)){
            const newRoles = newMember.roles.cache.map(r => {
                return {id: r.id, name: r.name}
            });
            const username = newMember.user.username;
            console.log(username + ' updated');
            const isSub = !(hasRoleName('Maîtresse', newRoles) || hasRoleName('Switch', newRoles) || hasRoleName('Switch à tendance Soumise', newRoles)|| hasRoleName('Switch à tendance Dominante', newRoles));
            if (!hasRoleName('Clef cachot', newRoles) &&
                hasRoleName('Accès cachot', newRoles) &&
                hasRoleName('Pronom: Elle', newRoles) &&
                !isSub &&
                !hasRoleName('Prisonnier', newRoles) &&
                !hasRoleName('Bâillonné(e)', newRoles)) {
                newMember.roles.add(newMember.guild.roles.cache.find(r => r.name === 'Clef cachot')).catch(console.error);
                newMember.send('Hey ! Je t\'ai donné les clés du cachot, amuse toi bien ;)').then(() => console.log(username + ' pas sub on donne les cles'));
                if(!firstTime.includes(newMember.id)){
                    const exampleEmbed = new EmbedBuilder()
                        .setColor(0x0099FF)
                        .setTitle('       💀 ༻ Le cachot ༺ 💀')
                        .setDescription('Le cachot est un salon caché permettant d\'emprisonner les soumis(e)s qui méritent une correction.\n' +
                            '\n' +
                            'Pour pouvoir emprisonner (et voir le salon) vous devez avoir le rôle: @Clef cachot Pour le gagner vous devez être une maitresse (switch inclus) et être au niveau 10.\n' +
                            '\n' +
                            'Une fois une personne enfermée, elle ne pourra alors voir que ce seul et unique salon dans tout le serveur. Les commandes sont simples :\n' +
                            '\n' +
                            '•⠀&cachot @username⠀➛ Pour enfermer quelqu\'un\n' +
                            '\n' +
                            '•⠀&cachotdel @username⠀➛ Pour libérer la personne\n' +
                            '\n' +
                            'Si vous êtes très sadique, vous pouvez aussi bâillonner vos prisonniers pour qu\'ils ne puissent plus écrire dans le cachot, voici les commands :\n' +
                            '\n' +
                            '•⠀&mute @username ➛ Pour mettre un bâillon à votre prisonnier\n' +
                            '\n' +
                            '•⠀&mutedel @username ➛ Pour retirer son bâillon\n' +
                            '\n' +
                            '⚠️ Merci de ne pas essayer d\'enfermer une personne du staff.\n' +
                            'Le bâillon fonctionne uniquement sur un prisonnier déjà enfermé.\n' +
                            '\n' +
                            'La @Clef cachot vous donne aussi le droit d\'utiliser le bot: @Mel\'s Succubus qui permet d\'envoyer mais aussi d\'ajouter vos propres gifs/images liés au bdsm selon des thèmes définis.\n' +
                            '\n' +
                            'Toutes les commands du bot se font avec les commandes slash, pour ajouter/enlever des medias :\n' +
                            '\n' +
                            '•⠀/gif add ➛ Pour ajouter des gifs/images dans une collection\n' +
                            '\n' +
                            '•⠀/gif del ➛ Pour enlever des gifs/images en définissant son lien')
                        .setImage('https://i.imgur.com/90mPyON.png');
                    newMember.send({content:'Hey ! Je t\'ai donné les clés du cachot, amuse toi bien ;)', embeds: [exampleEmbed]}).then(() => console.log('message sended to ' + username));
                    firstTime.push(newMember.id);
                    fs.writeFileSync(path.join(__dirname, '..', "firstTime.json"), JSON.stringify(firstTime));
                }

            } else if (hasRoleName('Clef cachot', newRoles) &&
                hasRoleName('Prisonnier', newRoles) &&
                !hasRoleName('Maîtresse', newRoles)) {
                console.log(username + ' Prisonnier on retire les clés');
                newMember.roles.remove(newMember.guild.roles.cache.find(r => r.name === 'Clef cachot')).catch(console.error);
            } else if (hasRoleName('Clef cachot', newRoles) &&
                hasRoleName('Bâillonné(e)', newRoles) &&
                !hasRoleName('Maîtresse', newRoles)) {
                console.log(username + ' Baillonne on retire les clés');
                newMember.roles.remove(newMember.guild.roles.cache.find(r => r.name === 'Clef cachot')).catch(console.error);
            } else if (!hasRoleName('👑 Staff', newRoles) && isSub && hasRoleName('Clef cachot', newRoles)){
                console.log(username + ' sub qui triche on retir les cles');
                newMember.roles.remove(newMember.guild.roles.cache.find(r => r.name === 'Clef cachot')).catch(console.error);
            }
        }
    },
};

function hasRoleName(roleName, roles) {
    return roles.map(r => r.name).includes(roleName);
}
