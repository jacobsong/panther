const Discord = require("discord.js");

module.exports = {
  name: "help",
  group: "general",
  description: "List all of my commands",
  guildOnly: false,
  roleRequired: 0, // 0=None 1=Admin
  argsRequired: 0,
  mentionsRequired: 0,
  minArgsRequired: 0,
  minMentionsRequired: 0,
  usage: undefined,
  async execute(msg, args) {
    const { commands } = msg.client;
    const generalEmbed = new Discord.RichEmbed().setTitle("General Commands").setColor("BLUE");
    const healthEmbed = new Discord.RichEmbed().setTitle("Health Commands").setColor("BLUE");
    const meetupEmbed = new Discord.RichEmbed().setTitle("Meetup Commands").setColor("BLUE");

    generalEmbed.addField("**status (Admins & Mods)** *<text>*", " - Sets a custom status for the bot");

    commands.map(command => {
      const argsList = (command.usage != undefined) ? `*${command.usage}*` : "";
      const adminOnly = (command.roleRequired) ? "(Admins & Mods)" : "";
      if (command.group === "health") {
        healthEmbed.addField(`**${command.name} ${adminOnly}** ${argsList}`, ` - ${command.description}`);
      } else if (command.group === "meetup") {
        meetupEmbed.addField(`**${command.name} ${adminOnly}** ${argsList}`, ` - ${command.description}`);
      } else {
        generalEmbed.addField(`**${command.name} ${adminOnly}** ${argsList}`, ` - ${command.description}`);
      }
    });

    try {
      const msg1 = await msg.author.send(generalEmbed);
      await msg.author.send(healthEmbed);
      await msg.author.send(meetupEmbed);
      if (msg.channel.type === 'dm') return;
      else msg.reply("I sent you a DM with all my commands");
    } catch (e) {
      msg.reply("failed to send you a DM.  Do you have DMs disabled?");
    }

    return;
  },
};