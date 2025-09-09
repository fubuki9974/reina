const { embedLogger } = require("../utils/embedLogger");

module.exports = (client) => {
  client.on("guildMemberAdd", async (member) => {
    const channel = client.channels.cache.get(process.env.WELCOME_CHANNEL_ID);
    if (!channel) return;

    const embed = embedLogger(
      "🎉 Selamat Datang!",
      `Halo ${member.user}, selamat bergabung di server!`
    );
    channel.send({ embeds: [embed] });

    // kasih role otomatis (opsional)
    if (process.env.WELCOME_ROLE_ID) {
      const role = member.guild.roles.cache.get(process.env.WELCOME_ROLE_ID);
      if (role) await member.roles.add(role);
    }
  });
};
