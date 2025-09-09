const { createLogEmbed, colors } = require("../utils/embedLogger");

module.exports = (client) => {
  const getLogChannel = (guild) => guild.channels.cache.find(ch => ch.name === "logs");

  // 🗑 Pesan dihapus
  client.on("messageDelete", async (message) => {
    if (!message.guild) return;
    const logChannel = getLogChannel(message.guild);
    if (!logChannel) return;

    const embed = createLogEmbed({
      color: colors.delete,
      title: "🗑 Pesan Dihapus",
      fields: [
        { name: "Pengirim", value: message.author ? message.author.tag : "Unknown", inline: true },
        { name: "Channel", value: `<#${message.channel.id}>`, inline: true },
        { name: "Isi", value: message.content || "[Embed/Attachment]" }
      ],
    });

    logChannel.send({ embeds: [embed] });
  });

  // ✏️ Pesan diedit
  client.on("messageUpdate", async (oldMessage, newMessage) => {
    if (!oldMessage.guild || oldMessage.content === newMessage.content) return;
    const logChannel = getLogChannel(oldMessage.guild);
    if (!logChannel) return;

    const embed = createLogEmbed({
      color: colors.edit,
      title: "✏️ Pesan Diedit",
      fields: [
        { name: "Pengirim", value: newMessage.author ? newMessage.author.tag : "Unknown", inline: true },
        { name: "Channel", value: `<#${newMessage.channel.id}>`, inline: true },
        { name: "Sebelum", value: oldMessage.content || "[Kosong]" },
        { name: "Sesudah", value: newMessage.content || "[Kosong]" }
      ],
    });

    logChannel.send({ embeds: [embed] });
  });

  // ➕➖ Role
  client.on("guildMemberUpdate", async (oldMember, newMember) => {
    const logChannel = getLogChannel(newMember.guild);
    if (!logChannel) return;

    const addedRoles = newMember.roles.cache.filter(r => !oldMember.roles.cache.has(r.id));
    const removedRoles = oldMember.roles.cache.filter(r => !newMember.roles.cache.has(r.id));

    addedRoles.forEach(role => {
      const embed = createLogEmbed({
        color: colors.roleAdd,
        title: "➕ Role Ditambahkan",
        description: `${newMember.user.tag} mendapatkan role **${role.name}**`,
      });
      logChannel.send({ embeds: [embed] });
    });

    removedRoles.forEach(role => {
      const embed = createLogEmbed({
        color: colors.roleRemove,
        title: "➖ Role Dihapus",
        description: `${newMember.user.tag} kehilangan role **${role.name}**`,
      });
      logChannel.send({ embeds: [embed] });
    });

    // ⏱ Timeout check
    if (oldMember.communicationDisabledUntilTimestamp !== newMember.communicationDisabledUntilTimestamp) {
      const embed = createLogEmbed({
        color: colors.timeout,
        title: "⏱ Timeout Update",
        description: `${newMember.user.tag} status timeout diperbarui.`,
        fields: [
          { name: "Sebelum", value: oldMember.communicationDisabledUntilTimestamp ? `<t:${Math.floor(oldMember.communicationDisabledUntilTimestamp / 1000)}:F>` : "❌ Tidak Timeout" },
          { name: "Sesudah", value: newMember.communicationDisabledUntilTimestamp ? `<t:${Math.floor(newMember.communicationDisabledUntilTimestamp / 1000)}:F>` : "✅ Timeout Dihapus" },
        ],
      });
      logChannel.send({ embeds: [embed] });
    }
  });

  // 🚪 Member keluar
  client.on("guildMemberRemove", async (member) => {
    const logChannel = getLogChannel(member.guild);
    if (!logChannel) return;

    const embed = createLogEmbed({
      color: colors.memberLeave,
      title: "🚪 Member Keluar",
      description: `${member.user.tag} keluar dari server.`,
    });

    logChannel.send({ embeds: [embed] });
  });

  // 🔨 Ban / Unban
  client.on("guildBanAdd", async (ban) => {
    const logChannel = getLogChannel(ban.guild);
    if (!logChannel) return;

    const embed = createLogEmbed({
      color: colors.ban,
      title: "🔨 Member Dibanned",
      description: `${ban.user.tag} dibanned dari server.`,
    });

    logChannel.send({ embeds: [embed] });
  });

  client.on("guildBanRemove", async (ban) => {
    const logChannel = getLogChannel(ban.guild);
    if (!logChannel) return;

    const embed = createLogEmbed({
      color: colors.unban,
      title: "♻️ Member Diunban",
      description: `${ban.user.tag} diunban dari server.`,
    });

    logChannel.send({ embeds: [embed] });
  });
};
