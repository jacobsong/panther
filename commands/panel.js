const Discord = require("discord.js");
const Player = require("../models/Player");
const Event = require("../models/Event");

module.exports = {
  name: "panel",
  group: "health",
  description: "Display event status and everyone's progress",
  guildOnly: true,
  roleRequired: 0, // 0=None 1=Admin
  argsRequired: 0,
  mentionsRequired: 0,
  minArgsRequired: 0,
  minMentionsRequired: 0,
  usage: undefined,
  async execute(msg, args) {
    const embed = new Discord.RichEmbed().setColor("PURPLE");

    try {
      const event = await Event.findOne({});
      
      if (event === null) {
        msg.reply("No event found");
        return;
      }

      const dateFormat = { timeZone: 'America/Chicago', month: 'short', day: 'numeric', year: 'numeric', hour: 'numeric', minute: 'numeric' };

      embed.setTitle(event.desc)
        .setAuthor(`Event created by ${event.creatorName}`, event.creatorAvatar)
        .addField(`**Start Date**`, event.dateCreated.toLocaleString('en-US', dateFormat), true)
        .addBlankField(true)
        .addField(`**End Date**`, event.dateEnds.toLocaleString('en-US', dateFormat), true)
        .addBlankField();
      
      const players = await Player.find({}).sort("-miles");

      if (players.length) {
        players.forEach((player, i) => {
          embed.addField(`${i + 1}. ${player.discordName}`, `completed ${player.miles.toFixed(2)} miles`);
        })
      }

      msg.channel.send(embed);

    } catch (e) {
      msg.reply("There was an error");
      return;
    }

    return;
  },
};