const {Events} = require('discord.js');

module.exports = {
    name: Events.GuildMemberUpdate,
    once: false,
    execute(oldMember, newMember) {
        const newRoles = newMember.roles.cache.map(r => {
            return {id: r.id, name: r.name}
        });
        const username = newMember.user.username;
        const isSub = !(hasRoleName('Maîtresse', newRoles) || hasRoleName('Switch', newRoles) || hasRoleName('Switch à tendance Soumise', newRoles)|| hasRoleName('Switch à tendance Dominante', newRoles));
        if (!hasRoleName('Clef cachot', newRoles) &&
            hasRoleName('Accès cachot', newRoles) &&
            hasRoleName('Pronom: Elle', newRoles) &&
             !isSub &&
            !hasRoleName('Prisonnier', newRoles) && 
            !hasRoleName('Bailloné(e)', newRoles)) {
            console.log(username + ' pas sub on donne les cles');
            newMember.roles.add(newMember.guild.roles.cache.find(r => r.name === 'Clef cachot')).catch(console.error);
        } else if (hasRoleName('Clef cachot', newRoles) &&
            hasRoleName('Prisonnier', newRoles) &&
            !hasRoleName('Maîtresse', newRoles)) {
            console.log(username + ' Prisonnier on retire les clés');
            newMember.roles.remove(newMember.guild.roles.cache.find(r => r.name === 'Clef cachot')).catch(console.error);
        } else if (hasRoleName('Clef cachot', newRoles) &&
            hasRoleName('Bailloné(e)', newRoles) &&
            !hasRoleName('Maîtresse', newRoles)) {
            console.log(username + ' Baillonné(e) on retire les clés');
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
