require("dotenv").config();
const { Client, GatewayIntentBits } = require("discord.js");
const fs = require("fs");
const path = require("path");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMessageReactions,
  ],
});

const featuresPath = path.join(__dirname, "features");
fs.readdirSync(featuresPath).forEach(file => {
  try {
    const feature = require(path.join(featuresPath, file));
    if (typeof feature === "function") {
      feature(client);
      console.log(`📦 Loaded feature: ${file}`);
    } else {
      console.log(`❌ Error loading feature ${file}: feature is not a function`);
    }
  } catch (err) {
    console.log(`❌ Error loading feature ${file}:`, err.message);
  }
});

client.once("clientReady", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);
});

client.login(process.env.BOT_TOKEN);
