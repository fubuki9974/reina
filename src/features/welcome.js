module.exports = (client) => {
  client.on("guildMemberAdd", async (member) => {
    const channel = member.guild.channels.cache.find(ch => ch.name === "welcome");
    if (!channel) return;

    channel.send({
      content: `Selamat datang ${member.user}! 🎉`,
    });
  });
};
