const { Events } = require('discord.js');

module.exports = {
    name: Events.GuildMemberUpdate,
    once: false,
    execute(oldMember, newMember) {
        const oldRoles = oldMember.roles.cache.map(r => {return {id: r.id, name:r.name}});
        const newRoles = newMember.roles.cache.map(r => {return {id: r.id, name:r.name}});
        if(newRoles.length > oldRoles.length){
            if(!hasRoleName('Clef cachot', newRoles) &&
                hasRoleName('Accès cachot', newRoles) &&
                hasRoleName('Pronom: Elle', newRoles) &&
                !hasRoleName('Soumis(e)', newRoles) ){
                newMember.roles.add(newMember.guild.roles.cache.find(r => r.name === 'Clef cachot')).catch(console.error);
            }
        }
        if(hasRoleName('Clef cachot', newRoles) &&
            (!hasRoleName('Accès cachot', newRoles) ||
            !hasRoleName('Pronom: Elle', newRoles) ||
            hasRoleName('Soumis(e)', newRoles)) ){
            newMember.roles.remove(newMember.guild.roles.cache.find(r => r.name === 'Clef cachot')).catch(console.error);
        }
    },
};

function hasRoleName(roleName, roles){
    return roles.map(r => r.name).includes(roleName);
}