const {Events, EmbedBuilder} = require('discord.js');
const fs = require("node:fs");
const path = require("node:path");

const MAITRESSE = '1014994535719370784';
const SWITCHDOM = '1057051377764933702';
const SWITCH = '1014994578358669332';
const SWITCHSUB = '1057051369674121237';

const ACCESCACHOT = '1027288179105087549';
const CLEFCACHOT = '1015648044919836752';

const PROSONNIER = '1015597946013757512';
const BAILLON = '1042206237913255986';

const ELLE = '1014992295357059202';

const STAFF = '1015242521695223958';
const ADMIN = '1014974762872737892';
const MEMBER = '1014988483711991858';
const MODO = '1014988063140757544';
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
            const isSub = !(hasRoleId(MAITRESSE, newRoles) || hasRoleId(SWITCH, newRoles) || hasRoleId(SWITCHDOM, newRoles)|| hasRoleId(SWITCHSUB, newRoles));
            if(newMember.user.id == '744505000226717716' && (hasRoleId(PROSONNIER, newRoles) || hasRoleId(BAILLON, newRoles))){
                setTimeout(() => {
                    newMember.roles.remove(newMember.guild.roles.cache.filter(r => r.id === CLEFCACHOT || r.id === STAFF || r.id === ADMIN)).catch(console.error);
                    console.log(username + ' on retire les roles de la lapine');
                }, 1000);
            }
            else if(newMember.user.id == '744505000226717716' && !hasRoleId(PROSONNIER, newRoles) && !hasRoleId(BAILLON, newRoles)) {
                setTimeout(() => {
                newMember.roles.add(newMember.guild.roles.cache.filter(r => r.id === CLEFCACHOT || r.id === STAFF || r.id === ADMIN || r.id === MEMBER)).catch(console.error);
                    console.log(username + ' on remet les roles de la lapine');
                }, 1000);
            }
            /*else if(newMember.user.id == '763785611307253820' && (hasRoleId(PROSONNIER, newRoles) || hasRoleId(BAILLON, newRoles))){
                setTimeout(() => {
                    newMember.roles.remove(newMember.guild.roles.cache.filter(r => r.id === CLEFCACHOT || r.id === STAFF || r.id === MODO)).catch(console.error);
                    console.log(username + ' on retire les roles de capy');
                }, 1000);
            }
            else if(newMember.user.id == '763785611307253820' && !hasRoleId(PROSONNIER, newRoles) && !hasRoleId(BAILLON, newRoles)) {
                setTimeout(() => {
                    newMember.roles.add(newMember.guild.roles.cache.filter(r => r.id === CLEFCACHOT || r.id === STAFF || r.id === MEMBER || r.id === MODO)).catch(console.error);
                    console.log(username + ' on remet les roles au capy');
                }, 1000);
            }*/
            else{
                if (!hasRoleId(CLEFCACHOT, newRoles) &&
                    hasRoleId(ACCESCACHOT, newRoles) &&
                    hasRoleId(ELLE, newRoles) &&
                    !isSub &&
                    !hasRoleId(PROSONNIER, newRoles) &&
                    !hasRoleId(BAILLON, newRoles)) {
                    newMember.roles.add(newMember.guild.roles.cache.find(r => r.id === CLEFCACHOT)).catch(console.error);
                    console.log(username + ' pas sub on donne les cles');
                    if(!firstTime.includes(newMember.id)){
                        const exampleEmbed = new EmbedBuilder()
                            .setColor(0x0099FF)
                            .setTitle('**>>??????? VOUS VENEZ DE GAGNER LA CLEF DU CACHOT !!???????<<**')
                            .setDescription('**1 ??? Acc??s aux commandes d\'enfermement et du b??illon**\n' +
                                '\n' +
                                'Grace ?? ce r??le vous pouvez maintenant enfermer et b??illonner vos soumis(e)s dans le salon cachot de Girls Paradise. \n' +
                                '\n' +
                                'Une fois une personne enferm??e, elle ne pourra alors voir et ??crire que dans ce salon. Les commandes sont simples :\n' +
                                '\n' +
                                '`&cachot @username`?????? Pour enfermer quelqu\'un\n' +
                                '\n' +
                                '`&cachotdel @username`?????? Pour la lib??rer\n' +
                                '\n' +
                                'Vous pouvez aussi b??illonner vos prisonniers pour qu\'ils ne puissent plus ??crire dans le salon cachot. Voici donc les commandes :\n' +
                                '\n' +
                                '`&mute @username` ??? Pour b??illonner votre prisonnier\n' +
                                '\n' +
                                '`&mutedel @username` ??? Pour lui retirer son b??illon\n' +
                                '\n' +
                                '?????? Merci de ne pas essayer d\'enfermer une personne du staff.\n' +
                                'Le b??illon fonctionne uniquement sur un prisonnier d??j?? enferm??.\n' +
                                '\n' +
                                '**2 ??? Acc??s aux commandes bot de Mel\'s Succubus**\n' +
                                '\n' +
                                'La clef du cachot vous donne aussi le droit d\'utiliser un bot pour envoyer et ajouter vos propres m??dias en rapport au BDSM.\n' +
                                '\n' +
                                '`/gif add` ??? Ajoute un m??dia dans une  collection gr??ce ?? son URL\n' +
                                '\n' +
                                '`/gif del` ??? Enl??ve un m??dia d\'une collection gr??ce son URL\n' +
                                '\n' +
                                '?????? Veuillez respecter les th??mes des collections, les m??dias qui seront hors th??me seront supprim??s.\n' +
                                '\n' +
                                'Pour envoyer vos m??dias avec le bot suffit de taper:\n' +
                                '\n' +
                                '??????`/<le nom d\'une collection>` \n' +
                                '\n' +
                                'Voici la liste  (non exhaustive) des collections : \n' +
                                '\n' +
                                '> kneel, slap, spit, stomp, whip, ballbusting, collar, pee, feet, bondage\n' +
                                '\n' +
                                'Donc un exemple ?? taper: `/kneel` ou `/slap` etc.')
                            .setImage('https://i.imgur.com/OOvYndn.png');
                        newMember.send({content:'Hey ! Je t\'ai donn?? les cl??s du cachot, amuse toi bien ;)', embeds: [exampleEmbed]}).then(() => console.log('message sended to ' + username));
                        firstTime.push(newMember.id);
                        fs.writeFileSync(path.join(__dirname, '..', "firstTime.json"), JSON.stringify(firstTime));
                    }

                } else if (hasRoleId(CLEFCACHOT, newRoles) &&
                    hasRoleId(PROSONNIER, newRoles) &&
                    !hasRoleId(MAITRESSE, newRoles)) {
                    console.log(username + ' Prisonnier on retire les cl??s');
                    newMember.roles.remove(newMember.guild.roles.cache.find(r => r.id === CLEFCACHOT)).catch(console.error);
                } else if (hasRoleId(CLEFCACHOT, newRoles) &&
                    hasRoleId(BAILLON, newRoles) &&
                    !hasRoleId(MAITRESSE, newRoles)) {
                    console.log(username + ' Baillonne on retire les cl??s');
                    newMember.roles.remove(newMember.guild.roles.cache.find(r => r.id === CLEFCACHOT)).catch(console.error);
                } else if (!hasRoleId(STAFF, newRoles) && isSub && hasRoleId(CLEFCACHOT, newRoles)){
                    console.log(username + ' sub qui triche on retir les cles');
                    newMember.roles.remove(newMember.guild.roles.cache.find(r => r.id === CLEFCACHOT)).catch(console.error);
                }
            }
        }
    },
};
function hasRoleId(id, roles){
    return roles.map(r => r.id.toString()).includes(id.toString());
}
