const { EmbedBuilder } = require("discord.js");

function createLogEmbed({ color, title, description, fields = [] }) {
  return new EmbedBuilder()
    .setColor(color)
    .setTitle(title)
    .setDescription(description || null)
    .addFields(fields)
    .setTimestamp();
}

// 🎨 Warna standar
const colors = {
  delete: "Red",
  edit: "Orange",
  roleAdd: "Green",
  roleRemove: "Red",
  memberLeave: "Grey",
  ban: "DarkRed",
  unban: "Blue",
  timeout: "Purple",
};

module.exports = { createLogEmbed, colors };
