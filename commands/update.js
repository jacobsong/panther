const Player = require("../models/Player");
const Event = require("../models/Event");

module.exports = {
  name: "update",
  description: "Updates your progress for the event (respond within 60 seconds)",
  guildOnly: true,
  roleRequired: 0, // 0=None 1=Admin
  argsRequired: 0,
  mentionsRequired: 0,
  minArgsRequired: 0,
  minMentionsRequired: 0,
  usage: undefined,
  async execute(msg, args) {
    const today = new Date();
    const event = await Event.findOne({});
    
    if (event === null) {
      msg.reply("No event found");
      return;
    } else if (event.dateEnds < today) {
      msg.reply("The event has ended"); 
      return;
    }

    const isResponseValid = miles => {
      const x = parseFloat(miles)
      if (isNaN(x)) return false
      else return true
    }
    
    const filter = (response) => {
      return msg.author.id === response.author.id;
    }
    
    try {
      msg.reply("How many miles did you run?");
      let miles = await msg.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ["time"] });
      while (isResponseValid(miles.first().content) === false) {
        msg.reply("How many miles did you run?");
        miles = await msg.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ["time"] });
      }

      await Player.updateOne(
        { discordId: msg.author.id },
        {
          $set: { discordId: msg.author.id, discordName: msg.author.tag, discordAvatar: msg.author.avatarURL },
          $inc: { miles: parseFloat(miles.first().content) }
        },
        { upsert: true }
      );
    } catch (e) {
      return;
    }

    msg.reply("Successfully updated your progress");
    return;
  },
};