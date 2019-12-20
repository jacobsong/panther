const { prefix } = require("../config/config");

const checkCommand = (msg, command, args) => {
  const re = /<@/;
  //Check if command is guild only
  if (command.guildOnly && msg.channel.type !== 'text') {
    msg.reply("I can't execute that command inside DMs");
    return false;
  }

  //Check if command requires role
  if (command.roleRequired) {
    let isAdmin = false;
    msg.member.roles.some((role) => { 
      if (role.name === 'admin') {
        isAdmin = true;
      }
    });
    if (!isAdmin) {
      msg.reply("you do not have permission to use this command");
      return false;
    }
  }

  //Check if command requires args
  if (command.argsRequired) {
    const argsOnly = args.filter(arg => !re.test(arg));
    if (command.argsRequired != argsOnly.length) {
      if (command.usage) {
        msg.reply(`the proper usage would be: \`${prefix}${command.name} ${command.usage}\``);
        return false;
      }
    }
  }

  //Check if command requires min args
  if (command.minArgsRequired) {
    const argsOnly = args.filter(arg => !re.test(arg));
    if (command.minArgsRequired > argsOnly.length) {
      if (command.usage) {
        msg.reply(`the proper usage would be: \`${prefix}${command.name} ${command.usage}\``);
        return false;
      }
    }
  }

  //Check if command requires mentions
  if (command.mentionsRequired) {
    if (msg.mentions.members.size != command.mentionsRequired) {
      msg.reply(`expected ${command.mentionsRequired} mention(s), received ${msg.mentions.members.size}`);
      return false;
    }
  }

  //Check if command requires min mentions
  if (command.minMentionsRequired) {
    if (msg.mentions.members.size < command.minMentionsRequired) {
      msg.reply(`expected at least ${command.minMentionsRequired} mention(s), received ${msg.mentions.members.size}`);
      return false;
    }
  }

  //Return true if no validation errors
  return true;
};


module.exports = {
  checkCommand
};
