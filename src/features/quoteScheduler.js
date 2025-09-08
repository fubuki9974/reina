const cron = require('node-cron');
const axios = require('axios');

module.exports = {
  init(client) {
    const q = client.config.quote;
    if (!q || !q.enabled) return;
    // schedule using cron expression from config (server time)
    cron.schedule(q.cron, async () => {
      try {
        const res = await axios.get(q.api);
        const data = res.data;
        const text = data.content || data.quote || JSON.stringify(data);
        const author = data.author ? ` — ${data.author}` : '';
        const chId = process.env.QUOTE_CHANNEL_ID;
        if (!chId) return;
        const ch = client.channels.cache.get(chId);
        if (!ch) return;
        ch.send(`"${text}"${author}`).catch(console.error);
      } catch (err) {
        console.error('Quote fetch failed', err);
      }
    }, { timezone: 'Asia/Makassar' });
  }
};
