module.exports = {
  name: 'guildBanAdd',
  execute(client, ban) {
    client.logger.logGuildBan(client, ban);
  }
};
