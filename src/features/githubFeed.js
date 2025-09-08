const Parser = require('rss-parser');
const cron = require('node-cron');

module.exports = {
  init(client) {
    const channelId = process.env.GITHUB_FEED_CHANNEL_ID;
    const urls = (process.env.GITHUB_RSS_URLS || "").split(",").map(u => u.trim()).filter(Boolean);
    if (!channelId || urls.length === 0) return;

    const parser = new Parser();
    const lastCommits = {};

    // cek tiap 10 menit
    cron.schedule("*/10 * * * *", async () => {
      for (const feedUrl of urls) {
        try {
          const feed = await parser.parseURL(feedUrl);
          if (!feed || !feed.items || feed.items.length === 0) continue;

          const latest = feed.items[0];
          if (!latest || !latest.link) continue;

          const commitId = latest.id || latest.link;
          if (lastCommits[feedUrl] === commitId) continue; // sudah dipost

          lastCommits[feedUrl] = commitId;

          const channel = client.channels.cache.get(channelId);
          if (channel) {
            channel.send(`📝 Commit baru di **${feed.title}**\n**${latest.title}**\n${latest.link}`);
          }
        } catch (err) {
          console.error("GitHub feed fetch error:", err.message);
        }
      }
    }, { timezone: "Asia/Makassar" });
  }
};
