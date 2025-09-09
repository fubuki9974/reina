const { Events, AuditLogEvent } = require("discord.js");
const { embedLogger } = require("../utils/embedLogger");

module.exports = (client) => {
  const logChannelId = process.env.LOG_CHANNEL_ID;
  if (!logChannelId) return console.warn("LOG_CHANNEL_ID belum diatur.");

  const logChannel = () => client.channels.cache.get(logChannelId);

  // ===== Pesan dihapus =====
  client.on(Events.MessageDelete, (message) => {
    if (!message.guild || message.author?.bot) return;

    const embed = embedLogger(
      "🗑 Pesan Dihapus",
      `**Author:** ${message.author.tag}\n**Channel:** ${message.channel}\n**Isi:** ${message.content || "Tidak ada teks"}`
    );

    logChannel()?.send({ embeds: [embed] }).catch(console.error);
  });

  // ===== Pesan diedit =====
  client.on(Events.MessageUpdate, (oldMessage, newMessage) => {
    if (!oldMessage.guild || oldMessage.author?.bot) return;
    if (oldMessage.content === newMessage.content) return;

    const embed = embedLogger(
      "✏️ Pesan Diedit",
      `**Author:** ${oldMessage.author.tag}\n**Channel:** ${oldMessage.channel}\n**Sebelum:** ${oldMessage.content || "Tidak ada teks"}\n**Sesudah:** ${newMessage.content || "Tidak ada teks"}`
    );

    logChannel()?.send({ embeds: [embed] }).catch(console.error);
  });

  // ===== Member Ban =====
  client.on(Events.GuildBanAdd, async (ban) => {
    const embed = embedLogger(
      "⛔ Member Diban",
      `**Member:** ${ban.user.tag}\n**Guild:** ${ban.guild.name}`
    );
    logChannel()?.send({ embeds: [embed] }).catch(console.error);
  });

  // ===== Member Unban =====
  client.on(Events.GuildBanRemove, async (ban) => {
    const embed = embedLogger(
      "✅ Member Unban",
      `**Member:** ${ban.user.tag}\n**Guild:** ${ban.guild.name}`
    );
    logChannel()?.send({ embeds: [embed] }).catch(console.error);
  });

  // ===== Role / Member Update =====
  client.on(Events.GuildMemberUpdate, async (oldMember, newMember) => {
    if (!oldMember.guild) return;

    // Role ditambahkan
    const addedRoles = newMember.roles.cache.filter(r => !oldMember.roles.cache.has(r.id));
    if (addedRoles.size > 0) {
      const embed = embedLogger(
        "➕ Role Ditambahkan",
        `**Member:** ${newMember.user.tag}\n**Role:** ${addedRoles.map(r => r.name).join(", ")}`
      );
      logChannel()?.send({ embeds: [embed] }).catch(console.error);
    }

    // Role dihapus
    const removedRoles = oldMember.roles.cache.filter(r => !newMember.roles.cache.has(r.id));
    if (removedRoles.size > 0) {
      const embed = embedLogger(
        "➖ Role Dihapus",
        `**Member:** ${newMember.user.tag}\n**Role:** ${removedRoles.map(r => r.name).join(", ")}`
      );
      logChannel()?.send({ embeds: [embed] }).catch(console.error);
    }

    // Kick / Timeout detection via audit log (opsional)
    // Note: Discord.js tidak menyediakan event langsung untuk kick
    try {
      const audit = await newMember.guild.fetchAuditLogs({ type: AuditLogEvent.MemberKick, limit: 1 });
      const kickLog = audit.entries.first();
      if (kickLog && kickLog.target.id === newMember.id) {
        const embed = embedLogger(
          "👢 Member Dikeluarkan (Kick)",
          `**Member:** ${newMember.user.tag}\n**Oleh:** ${kickLog.executor.tag}`
        );
        logChannel()?.send({ embeds: [embed] }).catch(console.error);
      }
    } catch (err) {
      // ignore
    }
  });

  console.log("✅ Fitur messageLogger lengkap siap.");
};
