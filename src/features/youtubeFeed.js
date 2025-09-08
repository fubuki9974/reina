const Parser = require('rss-parser');
const cron = require('node-cron');

module.exports = {
  init(client) {
    const channelId = process.env.YOUTUBE_FEED_CHANNEL_ID;
    const urls = (process.env.YOUTUBE_RSS_URLS || "").split(",").map(u => u.trim()).filter(Boolean);
    if (!channelId || urls.length === 0) return;

    const parser = new Parser();
    const lastVideos = {};

    // cek tiap 10 menit
    cron.schedule("*/10 * * * *", async () => {
      for (const feedUrl of urls) {
        try {
          const feed = await parser.parseURL(feedUrl);
          if (!feed || !feed.items || feed.items.length === 0) continue;

          const latest = feed.items[0];
          if (!latest || !latest.link) continue;

          const videoId = latest.link.split("v=")[1];
          if (lastVideos[feedUrl] === videoId) continue; // sudah dipost sebelumnya

          lastVideos[feedUrl] = videoId;

          const channel = client.channels.cache.get(channelId);
          if (channel) {
            channel.send(`🎬 Video baru dari **${feed.title}**!\n${latest.link}`);
          }
        } catch (err) {
          console.error("YouTube feed fetch error:", err.message);
        }
      }
    }, { timezone: "Asia/Makassar" });
  }
};
