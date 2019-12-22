const Player = require("../models/Player");

module.exports = {
  name: "register",
  group: "health",
  description: "Register for the current event",
  guildOnly: true,
  roleRequired: 0, // 0=None 1=Admin
  argsRequired: 0,
  mentionsRequired: 0,
  minArgsRequired: 0,
  minMentionsRequired: 0,
  usage: undefined,
  async execute(msg, args) {
    try {
      const today = new Date();
      const event = await Event.findOne({});
      
      if (event === null) {
        msg.reply("No event found");
        return;
      } else if (event.dateEnds < today) {
        msg.reply("The event has ended"); 
        return;
      }
      
      const exists = await Player.countDocuments({ discordId: msg.author.id });
      
      if (exists) {
        msg.reply("You have already registered");
      } else {
        await new Player({
          discordId: msg.author.id,
          discordName: msg.author.tag,
          discordAvatar: msg.author.avatarURL
        }).save();
        msg.reply("Successfully registered you for the event");
      }
    } catch (e) {
      msg.reply("There was an error");
      return;
    }
  },
};