const { Client, GatewayIntentBits, Partials } = require("discord.js");
require("dotenv").config();

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

  // === Fitur ===
  require("./features/welcome").init(client);        // Welcome embed
  require("./features/quotes").init(client);         // Auto quote jam 7 pagi
  require("./features/reactionRole").init(client);   // Reaction role
  require("./features/automod").init(client);        // Auto mod
  require("./features/logs").init(client);           // Logging
  require("./features/youtubeFeed").init(client);    // YouTube feed
  require("./features/githubFeed").init(client);     // GitHub feed
  require("./features/animeWallpaper").init(client); // Anime wallpaper auto post
});

client.login(process.env.DISCORD_TOKEN);
