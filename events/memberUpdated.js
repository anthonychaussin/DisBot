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
                        .setTitle('**>>🗝️ VOUS VENEZ DE GAGNER LA CLEF DU CACHOT !!🗝️<<**')
                        .setDescription('**1 • Accès aux commandes d\'enfermement et du bâillon**\n' +
                            '\n' +
                            'Grace à ce rôle vous pouvez maintenant enfermer et bâillonner vos soumis(e)s dans le salon cachot de Girls Paradise. \n' +
                            '\n' +
                            'Une fois une personne enfermée, elle ne pourra alors voir et écrire que dans ce salon. Les commandes sont simples :\n' +
                            '\n' +
                            '`&cachot @username`⠀➛ Pour enfermer quelqu\'un\n' +
                            '\n' +
                            '`&cachotdel @username`⠀➛ Pour la libérer\n' +
                            '\n' +
                            'Vous pouvez aussi bâillonner vos prisonniers pour qu\'ils ne puissent plus écrire dans le salon cachot. Voici donc les commandes :\n' +
                            '\n' +
                            '`&mute @username` ➛ Pour bâillonner votre prisonnier\n' +
                            '\n' +
                            '`&mutedel @username` ➛ Pour lui retirer son bâillon\n' +
                            '\n' +
                            '⚠️ Merci de ne pas essayer d\'enfermer une personne du staff.\n' +
                            'Le bâillon fonctionne uniquement sur un prisonnier déjà enfermé.\n' +
                            '\n' +
                            '**2 • Accès aux commandes bot de Mel\'s Succubus**\n' +
                            '\n' +
                            'La clef du cachot vous donne aussi le droit d\'utiliser un bot pour envoyer et ajouter vos propres médias en rapport au BDSM.\n' +
                            '\n' +
                            '`/gif add` ➛ Ajoute un média dans une  collection grâce à son URL\n' +
                            '\n' +
                            '`/gif del` ➛ Enlève un média d\'une collection grâce son URL\n' +
                            '\n' +
                            '⚠️ Veuillez respecter les thèmes des collections, les médias qui seront hors thème seront supprimés.\n' +
                            '\n' +
                            'Pour envoyer vos médias avec le bot suffit de taper:\n' +
                            '\n' +
                            '•⠀`/<le nom d\'une collection>` \n' +
                            '\n' +
                            'Voici la liste  (non exhaustive) des collections : \n' +
                            '\n' +
                            '> kneel, slap, spit, stomp, whip, ballbusting, collar, pee, feet, bondage\n' +
                            '\n' +
                            'Donc un exemple à taper: `/kneel` ou `/slap` etc.')
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
