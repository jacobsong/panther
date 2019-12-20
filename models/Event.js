const mongoose = require("mongoose");
const { Schema } = mongoose;

const eventSchema = new Schema(
  {
    creatorId: String,
    creatorName: String,
    creatorAvatar: String,
    desc: String,
    dateCreated: { type: Date, default: Date.now },
    dateEnds: Date
  }
);

module.exports = Event = mongoose.model("event", eventSchema);
