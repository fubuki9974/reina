module.exports = {
  init(client) {
    client.on('messageCreate', async message => {
      if (!message.guild || message.author.bot) return;
      const cfg = client.config.automod || {};
      const content = message.content.toLowerCase();
      // banned words
      for (const w of (cfg.bannedWords || [])) {
        if (!w) continue;
        if (content.includes(w.toLowerCase())) {
          await message.delete().catch(()=>null);
          client.logger.sendLog(client, 'AutoMod: Deleted Message', `User ${message.author.tag} sent a banned word in <#${message.channel.id}>`);
          return;
        }
      }
      // too many links basic check
      const links = (message.content.match(/https?:\/\//g) || []).length;
      if (cfg.maxLinks && links > cfg.maxLinks) {
        await message.delete().catch(()=>null);
        client.logger.sendLog(client, 'AutoMod: Too Many Links', `User ${message.author.tag} posted ${links} links in <#${message.channel.id}>`);
      }
    });
  }
};
