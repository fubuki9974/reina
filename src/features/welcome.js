const { EmbedBuilder } = require('discord.js');

module.exports = {
  init(client) {
    client.on('guildMemberAdd', async member => {
      const chId = process.env.WELCOME_CHANNEL_ID;
      if (!chId) return;
      const ch = member.guild.channels.cache.get(chId);
      if (!ch) return;
      const image = client.config.welcome.image_url;
      const message = client.config.welcome.welcome_message.replace('{user}', `<@${member.id}>`);
      const embed = new EmbedBuilder()
        .setTitle('Welcome!')
        .setDescription(message)
        .setImage(image)
        .setTimestamp();
      ch.send({ embeds: [embed] }).catch(console.error);
    });
  }
};
