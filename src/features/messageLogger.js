const { Events } = require("discord.js");
const { embedLogger } = require("../utils/embedLogger");

module.exports = (client) => {
  const logChannelId = process.env.LOG_CHANNEL_ID; // pastikan sudah ada di .env / Env Vars Railway
  if (!logChannelId) return console.warn("LOG_CHANNEL_ID belum diatur.");

  const logChannel = () => client.channels.cache.get(logChannelId);

  // Log pesan dihapus
  client.on(Events.MessageDelete, (message) => {
    if (!message.guild || message.author?.bot) return;

    const embed = embedLogger(
      "🗑 Pesan Dihapus",
      `**Author:** ${message.author.tag}\n**Channel:** ${message.channel}\n**Isi:** ${message.content || "Tidak ada teks"}`
    );

    logChannel()?.send({ embeds: [embed] }).catch(console.error);
  });

  // Log pesan diedit
  client.on(Events.MessageUpdate, (oldMessage, newMessage) => {
    if (!oldMessage.guild || oldMessage.author?.bot) return;
    if (oldMessage.content === newMessage.content) return;

    const embed = embedLogger(
      "✏️ Pesan Diedit",
      `**Author:** ${oldMessage.author.tag}\n**Channel:** ${oldMessage.channel}\n**Sebelum:** ${oldMessage.content || "Tidak ada teks"}\n**Sesudah:** ${newMessage.content || "Tidak ada teks"}`
    );

    logChannel()?.send({ embeds: [embed] }).catch(console.error);
  });

  console.log("✅ Fitur messageLogger siap.");
};
