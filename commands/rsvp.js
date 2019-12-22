const Discord = require("discord.js");
const Meetup = require("../models/Meetup");

module.exports = {
  name: "rsvp",
  group: "meetup",
  description: "RSVP for a meetup (react within 60 seconds)",
  guildOnly: true,
  roleRequired: 0, // 0=None 1=Admin
  argsRequired: 0,
  mentionsRequired: 0,
  minArgsRequired: 0,
  minMentionsRequired: 0,
  usage: undefined,
  async execute(msg, args) {
    const meetups = await Meetup.find({}).sort("_id");
    const embed = new Discord.RichEmbed();
    const allNums = ['1️⃣', '2️⃣', '3️⃣', '4️⃣', '5️⃣', '6️⃣', '7️⃣', '8️⃣', '9️⃣', '🔟'];
    
    if (meetups === null) {
      msg.reply("No meetups found");
      return;
    }

    embed.setTitle("Which meetup would you like to RSVP for?").setColor("GOLD");

    meetups.forEach((meetup, i) => {
      embed.addField(`${allNums[i]} Created by ${meetup.creatorName}`,
        `Date: ${meetup.date}\nLocation: ${meetup.location}\nDescription: ${meetup.desc}\nPoint of Contact: ${meetup.poc}\nAttending: ${meetup.attendees.length} people`);
    })

    try {
      const validNums = allNums.slice(0, meetups.length)
      const msg2 = await msg.channel.send(embed);

      for (let i = 0; i < meetups.length; i++) {
        await msg2.react(validNums[i]);
      }
      
      const filter = (reaction, user) => {
        return validNums.includes(reaction.emoji.name) && msg.author.id === user.id;
      }
      
      const collected = await msg2.awaitReactions(filter, { max: 1, time: 60000, errors: ["time"] });
      
      if (collected.size) {
        const choice = validNums.indexOf(collected.first().emoji.name);
        const exists = await Meetup.exists({ _id: meetups[choice]._id, attendees: { $elemMatch: { _id: msg.author.id } } })
        if (exists) {
          msg.reply("You have already RSVP'd for that event");
          return;
        }
        await Meetup.updateOne(
          { _id: meetups[choice]._id },
          { $push: { attendees : { _id: msg.author.id, discordName: msg.author.tag } } } );
      }
    } catch (e) {
      return;
    }

    msg.reply("Successfully RSVP'd for that event");
    return;
  },
};