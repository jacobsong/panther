const mongoose = require("mongoose");
const { Schema } = mongoose;

const playerSchema = new Schema(
  {
    discordId: { type: String, unique: true, index: true },
    discordName: String,
    discordAvatar: String,
    miles: { type: Number, default: 0 }
  }
);

module.exports = Player = mongoose.model("player", playerSchema);
