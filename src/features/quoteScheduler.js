const axios = require("axios");
const cron = require("node-cron");

module.exports = (client) => {
  client.on("clientReady", () => {
    const channel = client.channels.cache.get(process.env.QUOTE_CHANNEL_ID);
    if (!channel) return;

    cron.schedule("0 7 * * *", async () => {
      try {
        const res = await axios.get("https://api.quotable.io/random");
        channel.send(`💡 Quote hari ini:\n*"${res.data.content}"* — ${res.data.author}`);
      } catch (err) {
        console.error("Gagal ambil quote:", err.message);
      }
    });
  });
};
