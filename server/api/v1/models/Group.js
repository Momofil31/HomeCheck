const mongoose = require('mongoose');

const groupSchema = mongoose.Schema({
  _id: mongoose.Schema.Types.ObjectId,
  name: { type: String, required: true },
});

module.exports = mongoose.model('Group', groupSchema);
