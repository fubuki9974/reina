module.exports = {
  name: 'messageDelete',
  execute(client, message) {
    if (!message.guild) return;
    client.logger.logMessageDelete(client, message);
  }
};
