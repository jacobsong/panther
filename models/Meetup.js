const mongoose = require("mongoose");
const { Schema } = mongoose;

const meetupSchema = new Schema(
  {
    _id: Number,
    creatorId: String,
    creatorName: String,
    creatorAvatar: String,
    desc: String,
    location: String,
    date: String,
    poc: String,
    attendees: [{
      _id: String,
      discordName: String
    }]
  }
);

module.exports = Meetup = mongoose.model("meetup", meetupSchema);
