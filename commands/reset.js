const Player = require("../models/Player");

module.exports = {
  name: "reset",
  group: "health",
  description: "Reset an individual's event progress",
  guildOnly: true,
  roleRequired: 1, // 0=None 1=Admin
  argsRequired: 1,
  mentionsRequired: 1,
  minArgsRequired: 0,
  minMentionsRequired: 0,
  usage: "<user> <number>",
  async execute(msg, args) {
    const re = /<@/;
    const player = msg.mentions.users.first();
    const miles = args.filter(arg => !re.test(arg))[0];

    const isResponseValid = miles => {
      const x = parseFloat(miles)
      if (isNaN(x)) return false
      else return true
    }

    if (isResponseValid(miles) === false) { 
      msg.reply(`${miles} is not a number`);
      return;
    }

    try {
      const result = await Player.updateOne(
        { discordId: player.id },
        { $set: { miles: miles } }
      );

      if (result.n) {
        msg.reply(`Successfully reset ${player.tag}`);
      } else {
        msg.reply(`${player.tag} is not registered`);
      }
    } catch (e) {
      return;
    }

    return;
  },
};