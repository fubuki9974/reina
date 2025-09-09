const { EmbedBuilder } = require("discord.js");

/**
 * Membuat embed log
 * @param {string} title - Judul embed
 * @param {string} description - Isi embed
 * @param {number} color - Warna embed (default: abu-abu gelap)
 * @returns {EmbedBuilder}
 */
function embedLogger(title, description, color = 0x2f3136) {
  return new EmbedBuilder()
    .setTitle(title)
    .setDescription(description)
    .setColor(color)
    .setTimestamp();
}

module.exports = { embedLogger };
