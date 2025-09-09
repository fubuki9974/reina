const { Client, GatewayIntentBits, Partials } = require("discord.js");
const fs = require("fs");
const path = require("path");
require("dotenv").config();

// Buat client dengan intents & partials lengkap
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,       // penting untuk welcome
    GatewayIntentBits.GuildMessages,      // penting untuk logs
    GatewayIntentBits.MessageContent,     // baca isi pesan
    GatewayIntentBits.GuildMessageReactions,
    GatewayIntentBits.GuildBans,          // log ban
    GatewayIntentBits.GuildPresences
  ],
  partials: [
    Partials.Message,
    Partials.Channel,
    Partials.Reaction,
    Partials.GuildMember,
    Partials.User,
  ],
});

// Path fitur
const featuresPath = path.join(__dirname, "features");

// Autoload semua fitur
fs.readdirSync(featuresPath).forEach((file) => {
  if (file.endsWith(".js")) {
    try {
      const feature = require(path.join(featuresPath, file));
      feature(client);
      console.log(`📦 Loaded feature: ${file}`);
    } catch (err) {
      console.error(`❌ Error loading feature ${file}:`, err.message);
    }
  }
});

// Event ketika bot ready
client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

// Login bot
client.login(process.env.BOT_TOKEN);
