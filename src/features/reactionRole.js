module.exports = (client) => {
  const roleMap = {};
  (process.env.REACTION_ROLE_MAP || "").split(",").forEach(pair => {
    const [emoji, roleName] = pair.split(":");
    roleMap[emoji] = roleName;
  });

  client.on("messageReactionAdd", async (reaction, user) => {
    if (user.bot) return;
    if (reaction.partial) await reaction.fetch();

    const roleName = roleMap[reaction.emoji.name];
    if (!roleName) return;

    const member = await reaction.message.guild.members.fetch(user.id);
    const role = reaction.message.guild.roles.cache.find(r => r.name === roleName);
    if (role) await member.roles.add(role);
  });

  client.on("messageReactionRemove", async (reaction, user) => {
    if (user.bot) return;
    if (reaction.partial) await reaction.fetch();

    const roleName = roleMap[reaction.emoji.name];
    if (!roleName) return;

    const member = await reaction.message.guild.members.fetch(user.id);
    const role = reaction.message.guild.roles.cache.find(r => r.name === roleName);
    if (role) await member.roles.remove(role);
  });
};
