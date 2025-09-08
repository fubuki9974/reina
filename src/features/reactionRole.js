module.exports = {
  init(client) {
    // nothing on init; handler is called from reaction event
  },
  async handleAdd(client, reaction, user) {
    if (user.bot) return;
    const cfg = client.config.reactionRoles;
    const messageId = process.env.REACTION_ROLE_MESSAGE_ID || cfg.messageId || '';
    if (!messageId) return;
    if (reaction.message.id !== messageId) return;
    const emoji = reaction.emoji.id || reaction.emoji.name;
    const mapping = (cfg.roles || []).find(r => r.emoji === emoji);
    if (!mapping) return;
    const guild = reaction.message.guild;
    const member = await guild.members.fetch(user.id).catch(()=>null);
    if (!member) return;
    const role = guild.roles.cache.get(mapping.roleId);
    if (!role) return;
    if (member.roles.cache.has(role.id)) {
      await member.roles.remove(role).catch(console.error);
      client.logger.sendLog(client, 'Reaction Role Removed', `${member.user.tag} had role ${role.name} removed via reaction.`);
    } else {
      await member.roles.add(role).catch(console.error);
      client.logger.sendLog(client, 'Reaction Role Added', `${member.user.tag} was given role ${role.name} via reaction.`);
    }
  }
};
