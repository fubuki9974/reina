const Parser = require("rss-parser");
const cron = require("node-cron");
const parser = new Parser();

module.exports = (client) => {
  client.on("clientReady", () => {
    const channelId = process.env.YOUTUBE_FEED_CHANNEL_ID;
    const feeds = (process.env.YOUTUBE_FEED_URLS || "").split(",");

    cron.schedule("*/10 * * * *", async () => {
      const channel = client.channels.cache.get(channelId);
      if (!channel) return;

      for (const url of feeds) {
        try {
          const feed = await parser.parseURL(url);
          if (feed.items.length > 0) {
            const latest = feed.items[0];
            channel.send(`📺 Video baru di **${feed.title}**:\n${latest.link}`);
          }
        } catch (err) {
          console.error("Gagal ambil feed YouTube:", err.message);
        }
      }
    });
  });
};
