const Parser = require('rss-parser');
const cron = require('node-cron');

module.exports = {
  init(client) {
    const channelId = process.env.YOUTUBE_FEED_CHANNEL_ID;
    const feedUrl = process.env.YOUTUBE_RSS_URL;
    if (!channelId || !feedUrl) return;

    const parser = new Parser();
    let lastVideoId = null;

    // cek tiap 10 menit
    cron.schedule("*/10 * * * *", async () => {
      try {
        const feed = await parser.parseURL(feedUrl);
        if (!feed || !feed.items || feed.items.length === 0) return;

        const latest = feed.items[0];
        if (!latest || !latest.link) return;

        // ambil ID video dari link
        const videoId = latest.link.split("v=")[1];
        if (lastVideoId === videoId) return; // sudah pernah dipost

        lastVideoId = videoId;
        const channel = client.channels.cache.get(channelId);
        if (channel) {
          channel.send(`🎬 Video baru dari **${feed.title}**!\n${latest.link}`);
        }
      } catch (err) {
        console.error("YouTube feed fetch error:", err);
      }
    }, { timezone: "Asia/Makassar" });
  }
};
