const cron = require("node-cron");
const fetch = require("node-fetch");

module.exports = {
  init(client) {
    const channelId = process.env.IMAGE_FEED_CHANNEL_ID;
    if (!channelId) return;

    // setiap 10 menit
    cron.schedule("*/10 * * * *", async () => {
      try {
        // API gratis: waifu.pics (kategori sfw/waifu)
        const res = await fetch("https://api.waifu.pics/sfw/waifu");
        const data = await res.json();

        const channel = client.channels.cache.get(channelId);
        if (channel && data && data.url) {
          await channel.send({
            content: "🖼️ Anime wallpaper random:",
            files: [data.url],
          });
        }
      } catch (err) {
        console.error("Anime wallpaper fetch error:", err.message);
      }
    }, { timezone: "Asia/Makassar" });
  }
};
