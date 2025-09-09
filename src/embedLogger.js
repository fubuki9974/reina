const { EmbedBuilder } = require("discord.js");

function embedLogger(title, description, color = 0x2f3136) {
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(color)
    .setTimestamp();
}

module.exports = { embedLogger };
