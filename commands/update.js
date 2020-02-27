const Player = require("../models/Player");
const Event = require("../models/Event");

module.exports = {
  name: "update",
  group: "health",
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
    const validEmojis = ['680863088450600970', '680853613366870090'];
    
    if (event === null) {
      msg.reply("No event found");
      return;
    } else if (event.dateEnds < today) {
      msg.reply("The event has ended"); 
      return;
    }

    // const isResponseValid = miles => {
    //   const x = parseFloat(miles)
    //   if (isNaN(x)) return false
    //   else return true
    // }
    
    const filter = (reaction, user) => {
      return validEmojis.includes(reaction.emoji.id) && msg.author.id === user.id;
    }

    // const filter = (response) => {
    //   return msg.author.id === response.author.id;
    // }
    
    try {
      const msg2 = await msg.reply("Did you meet your Drinking Goal today?");
      await msg2.react(msg.guild.emojis.get('680863088450600970'));
      await msg2.react(msg.guild.emojis.get('680853613366870090'));
      const collected = await msg2.awaitReactions(filter, { max: 1, time: 60000, errors: ["time"] });
      
      if (collected.size) {
        const choice = validEmojis.indexOf(collected.first().emoji.id);
        if (choice === 0 || undefined) { return; }
        
        await Player.updateOne(
          { discordId: msg.author.id },
          {
            $set: { discordId: msg.author.id, discordName: msg.author.tag, discordAvatar: msg.author.avatarURL },
            //$inc: { miles: parseFloat(miles.first().content) }
            $inc: { miles: 1 }
          },
          { upsert: true }
        );
      }
      // msg.reply("How many ounces did you drink?");
      // let miles = await msg.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ["time"] });
      // while (isResponseValid(miles.first().content) === false) {
      //   msg.reply("How many ounces did you drink?");
      //   miles = await msg.channel.awaitMessages(filter, { max: 1, time: 60000, errors: ["time"] });
      // }

      // await Player.updateOne(
      //   { discordId: msg.author.id },
      //   {
      //     $set: { discordId: msg.author.id, discordName: msg.author.tag, discordAvatar: msg.author.avatarURL },
      //     //$inc: { miles: parseFloat(miles.first().content) }
      //     $inc: { miles: 1 }
      //   },
      //   { upsert: true }
      // );
    } catch (e) {
      return;
    }

    msg.reply("Successfully updated your progress");
    return;
  },
};