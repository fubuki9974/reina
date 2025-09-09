const { Client, GatewayIntentBits, Partials } = require("discord.js");
require("dotenv").config();
const fs = require("fs");
const path = require("path");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessageReactions,
  ],
  partials: [Partials.Message, Partials.Channel, Partials.Reaction],
});

client.once("ready", () => {
  console.log(`✅ Logged in as ${client.user.tag}`);

  // === Auto load semua fitur di folder ./features ===
  const featuresPath = path.join(__dirname, "features");
  const featureFiles = fs.readdirSync(featuresPath).filter(file => file.endsWith(".js"));

  for (const file of featureFiles) {
    try {
      const f = require(`${featuresPath}/${file}`);
      if (f.init) f.init(client);
      console.log(`📦 Loaded feature: ${file}`);
    } catch (err) {
      console.error(`❌ Error loading feature ${file}:`, err.message);
    }
  }
});

client.login(process.env.TOKEN);
