module.exports = {
  name: 'guildMemberUpdate',
  execute(client, oldMember, newMember) {
    client.logger.logMemberUpdate(client, oldMember, newMember);
  }
};
