module.exports = (client) => {
  client.on("messageCreate", async (message) => {
    if (message.author.bot) return;

    // contoh simple filter
    const bannedWords = ["badword1", "badword2"];
    if (bannedWords.some(word => message.content.toLowerCase().includes(word))) {
      await message.delete();
      message.channel.send(`${message.author}, kata itu dilarang ❌`);
    }
  });
};
