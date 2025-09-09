const Parser = require("rss-parser");
const cron = require("node-cron");
const parser = new Parser();

module.exports = (client) => {
  client.on("clientReady", () => {
    const channel = client.channels.cache.get(process.env.GITHUB_FEED_CHANNEL_ID);
    if (!channel) return;

    const feeds = (process.env.GITHUB_FEEDS || "").split(",");
    cron.schedule("*/15 * * * *", async () => {
      for (const url of feeds) {
        try {
          const feed = await parser.parseURL(url.trim());
          if (feed.items.length > 0) {
            const latest = feed.items[0];
            channel.send(`🐙 Commit baru di **${feed.title}**:\n${latest.link}`);
          }
        } catch (err) {
          console.error("Gagal ambil feed GitHub:", err.message);
        }
      }
    });
  });
};
