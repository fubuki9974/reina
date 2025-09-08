module.exports = {
  name: 'messageReactionAdd',
  execute(client, reaction, user) {
    // Reaction role handler
    if (reaction.partial) return;
    const rr = require('../features/reactionRole');
    rr.handleAdd(client, reaction, user).catch(console.error);
  }
};
