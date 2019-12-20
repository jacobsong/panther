const Event = require("../models/Event");

module.exports = {
  name: "event",
  description: "Create an event for people to register in (respond within 60 seconds)",
  guildOnly: true,
  roleRequired: 1, // 0=None 1=Admin
  argsRequired: 0,
  mentionsRequired: 0,
  minArgsRequired: 0,
  minMentionsRequired: 0,
  usage: undefined,
  async execute(msg, args) {
    const isDaysValid = days => {
      const x = parseInt(days)
      if (isNaN(x)) return false
      else if (x < 1 || x > 30) return false
      else return true
    }

    try {
      const count = await Event.countDocuments({});
      if (count) {
        msg.reply("You already have an active event");
        return;
      }

      const filter = (response) => {
        return msg.author.id === response.author.id;
      }

      msg.reply("What is the event description?");
      const description = await msg.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ["time"] });

      let days;
      msg.reply("How many days will this event last? (1-30 days)");
      days = await msg.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ["time"] });
      while (isDaysValid(days.first().content) === false) {
        msg.reply("How many days will this event last? (1-30 days)");
        days = await msg.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ["time"] });
      }
      
      const beginDate = new Date();
      const endDate = new Date();
      endDate.setDate(beginDate.getDate() + parseInt(days.first().content));

      await new Event({
        creatorId: msg.author.id,
        creatorName: msg.author.tag,
        creatorAvatar: msg.author.avatarURL,
        desc: description.first().content,
        dateCreated: beginDate.get,
        dateEnds: endDate
      }).save();

      msg.reply("Event has been created")
      
    } catch (e) {
      return;
    }
  },
};