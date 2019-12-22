const Discord = require("discord.js");
const Meetup = require("../models/Meetup");

module.exports = {
  name: "edit",
  group: "meetup",
  description: "Edit a meetup (react within 60 seconds)",
  guildOnly: true,
  roleRequired: 1, // 0=None 1=Admin
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

    embed.setTitle("Which meetup would you like to edit?").setColor("LUMINOUS_VIVID_PINK");

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
        const filter2 = (response) => {
          return msg.author.id === response.author.id;
        }

        const isResponseValid = (resp) => {
          const valid = [1, 2, 3, 4];
          if (valid.includes(resp)) return true;
          else return false;
        }

        try {
          await msg.reply("What do you want to edit?\nType:\n1 for Date\n2 for Location\n3 for Description\n4 for Point of Contact");
          const editField = await msg.channel.awaitMessages(filter2, { max: 1, time: 60000, errors: ["time"] });
          const resp1 = parseInt(editField.first().content);
          let dbField = ""
          if (isResponseValid(resp1)) {
            switch (resp1) {
              case 1: dbField = 'date'; break;
              case 2: dbField = 'location'; break;
              case 3: dbField = 'desc'; break;
              case 4: dbField = 'poc'; break;
            }
            await msg.reply("Enter new value:");
            const newValue = await msg.channel.awaitMessages(filter2, { max: 1, time: 60000, errors: ["time"] });
            const resp2 = newValue.first().content;

            const choice = validNums.indexOf(collected.first().emoji.name);     
            const result = await Meetup.updateOne(
              { _id: meetups[choice]._id },
              { $set: { [dbField]: resp2 } });
            if (result.nModified) msg.reply("Successfully edited that meetup");
          }
        } catch (e) { return }
      }
    } catch (e) {
      return;
    }
    return;
  },
};