const { embedLogger } = require("../utils/embedLogger");

module.exports = (client) => {
  const logChannel = () => client.channels.cache.get(process.env.LOG_CHANNEL_ID);

  client.on("messageDelete", async (message) => {
    if (!message.guild) return;
    const channel = logChannel();
    if (!channel) return;

    channel.send({
      embeds: [embedLogger("🗑 Pesan Dihapus", `${message.author?.tag || "Unknown"} di <#${message.channel.id}>:\n${message.content || "[Embed/Attachment]"}`, 0xFF0000)]
    });
  });

  client.on("messageUpdate", async (oldMsg, newMsg) => {
    if (!oldMsg.guild || oldMsg.content === newMsg.content) return;
    const channel = logChannel();
    if (!channel) return;

    channel.send({
      embeds: [embedLogger("✏️ Pesan Diedit", `Sebelum: ${oldMsg.content || "[Kosong]"}\nSesudah: ${newMsg.content || "[Kosong]"}`, 0xFFA500)]
    });
  });
};
