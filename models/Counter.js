const mongoose = require("mongoose");
const { Schema } = mongoose;

const counterSchema = new Schema(
  {
    _id: String,
    sequenceValue: Number
  }
);

module.exports = Counter = mongoose.model("counter", counterSchema);
