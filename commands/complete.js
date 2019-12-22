const Event = require("../models/Event");
const Player = require("../models/Player");

module.exports = {
  name: "complete",
  group: "health",
  description: "Complete the current event and reset everything",
  guildOnly: true,
  roleRequired: 1, // 0=None 1=Admin
  argsRequired: 0,
  mentionsRequired: 0,
  minArgsRequired: 0,
  minMentionsRequired: 0,
  usage: undefined,
  async execute(msg, args) {
    try {
      const result = await Event.deleteMany({ });
      const result2 = await Player.deleteMany({ });

      if (result.deletedCount || result2.deletedCount) {
        msg.reply("Event has been completed and reset");
      } else {
        msg.reply("No event found");
      }
      
    } catch (e) {
      msg.reply("There was an error");
      return;
    }
  },
};