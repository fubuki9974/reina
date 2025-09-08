# Discord Bot — Railway-ready
Folder structure:
- index.js (bootstrap)
- src/
  - events/
    - ready.js
    - messageDelete.js
    - guildMemberUpdate.js
    - guildBanAdd.js
    - messageReaction.js
  - features/
    - welcome.js
    - quoteScheduler.js
    - reactionRole.js
    - automod.js
    - logs.js
  - config.json
- .env.example

Install:
```
npm install
```

Run:
```
npm start
```

Fill `.env` with your tokens and IDs. See `.env.example`.

This project is intended as a starting point. Edit `src/config.json` to add roles, banned words, welcome image, and IDs.
