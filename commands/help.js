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
    const embed = new Discord.RichEmbed().setTitle("Command List").setColor("BLUE");

    let generalCommands = "\n\`\`\`GENERAL\`\`\`\n";
    let healthCommands = "\n\`\`\`HEALTH\`\`\`\n";
    let meetupCommands = "\n\`\`\`MEETUP\`\`\`\n";

    commands.map(command => {
      const argsList = (command.usage != undefined) ? `*${command.usage}*` : "";
      const adminOnly = (command.roleRequired) ? "(Admins & Mods)" : "";
      if (command.group === "health") {
        healthCommands += `* **${command.name} ${adminOnly}** ${argsList} - ${command.description}\n`;
      } else if (command.group === "meetup") {
        meetupCommands += `* **${command.name} ${adminOnly}** ${argsList} - ${command.description}\n`;
      } else {
        generalCommands += `* **${command.name} ${adminOnly}** ${argsList} - ${command.description}\n`;
      }
    });

    generalCommands += "* **status (Admins & Mods)** *<text>* - Sets a custom status for the bot\n";
    const allCommands = generalCommands + healthCommands + meetupCommands;
    embed.setDescription(allCommands);

    try {
      msg.author.send(embed);
      if (msg.channel.type === 'dm') return;
      else msg.reply("I sent you a DM with all my commands");
    } catch (e) {
      msg.reply("failed to send you a DM.  Do you have DMs disabled?");
    }

    return;
  },
};