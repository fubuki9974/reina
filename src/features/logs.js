const { EmbedBuilder } = require('discord.js');

function safeChannel(client) {
  const id = process.env.LOG_CHANNEL_ID || client.config._logChannelId;
  if (!id) return null;
  return client.channels.cache.get(id);
}

module.exports = {
  init(client) {
    // optional setup
  },
  async sendLog(client, title, description) {
    const ch = safeChannel(client);
    if (!ch) return;
    const embed = new EmbedBuilder()
      .setTitle(title)
      .setDescription(description)
      .setTimestamp();
    ch.send({ embeds: [embed] }).catch(console.error);
  },
  logMessageDelete(client, message) {
    const author = message.author ? `${message.author.tag} (${message.author.id})` : 'Unknown';
    const desc = `**Author:** ${author}\n**Channel:** <#${message.channel.id}>\n**Content:** ${message.content || '[embed/attachment]'}`;
    this.sendLog(client, 'Message Deleted', desc);
  },
  async logMemberUpdate(client, oldMember, newMember) {
    // role changes
    const oldRoles = oldMember.roles.cache.map(r=>r.id).sort().join(',');
    const newRoles = newMember.roles.cache.map(r=>r.id).sort().join(',');
    if (oldRoles !== newRoles) {
      const removed = oldMember.roles.cache.filter(r => !newMember.roles.cache.has(r.id)).map(r => r.name);
      const added = newMember.roles.cache.filter(r => !oldMember.roles.cache.has(r.id)).map(r => r.name);
      const desc = `**User:** ${newMember.user.tag} (${newMember.id})\n**Added Roles:** ${added.join(', ') || 'None'}\n**Removed Roles:** ${removed.join(', ') || 'None'}`;
      this.sendLog(client, 'Member Roles Updated', desc);
    }
    // timeout detection
    const oldTimeout = oldMember.communicationDisabledUntilTimestamp || null;
    const newTimeout = newMember.communicationDisabledUntilTimestamp || null;
    if (oldTimeout !== newTimeout) {
      const desc = `**User:** ${newMember.user.tag} (${newMember.id})\n**Old timeout:** ${oldTimeout || 'None'}\n**New timeout:** ${newTimeout || 'None'}`;
      this.sendLog(client, 'Member Timeout Changed', desc);
    }
  },
  async logGuildBan(client, ban) {
    const desc = `**User:** ${ban.user.tag} (${ban.user.id})\n**Reason:** ${ban.reason || 'None'}`;
    this.sendLog(client, 'User Banned', desc);
  }
};
