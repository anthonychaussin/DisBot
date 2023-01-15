const {Events} = require('discord.js');

module.exports = {
    name: Events.GuildMemberUpdate,
    once: false,
    execute(oldMember, newMember) {
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
    },
};

function hasRoleName(roleName, roles) {
    return roles.map(r => r.name).includes(roleName);
}
