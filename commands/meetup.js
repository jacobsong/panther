const Discord = require("discord.js");
const Meetup = require("../models/Meetup");

module.exports = {
  name: "meetup",
  group: "meetup",
  description: "List all the meetups and the attendees (react within 60 seconds)",
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

    embed.setTitle("Which meetup would you like to view the attendees for?").setColor("BLUE");

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
        const result = await Meetup.findOne({ _id: meetups[choice]._id });
        let list = "";
        result.attendees.forEach((person, i) => { list += `**${i+1}.** ${person.discordName}\n` });
        const embedList = new Discord.RichEmbed()
          .setColor("BLUE")
          .setTitle("Attendees")
          .setDescription(list);
        msg.channel.send(embedList);
      }
    } catch (e) {
      return;
    }
    return;
  },
};