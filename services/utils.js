const Counter = require('../models/Counter');

const getNextSequenceValue = async (sequenceName) => {
  try {
    const sequenceDocument = await Counter.findOneAndUpdate(
      { _id: sequenceName },
      { $inc: { sequenceValue: 1 } },
      { new: true, useFindAndModify: false, upsert: true }
    );

    return sequenceDocument.sequenceValue;
  } catch (e) {
    return false;
  }
}

module.exports = {
  getNextSequenceValue
}