const axios = require("axios");
const cron = require("node-cron");

module.exports = (client) => {
  client.on("clientReady", () => {
    const channelId = process.env.QUOTE_CHANNEL_ID; // set di .env

    // tiap jam 7 pagi
    cron.schedule("0 7 * * *", async () => {
      const channel = client.channels.cache.get(channelId);
      if (!channel) return;

      try {
        const res = await axios.get("https://api.quotable.io/random");
        channel.send(`💡 Quote hari ini:\n\n*"${res.data.content}"* — ${res.data.author}`);
      } catch (err) {
        console.error("Gagal ambil quote:", err.message);
      }
    });
  });
};
