const mongoose = require('mongoose');

const commandSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true
  },
  command: {
    type: String,
    required: true
  },
  category: {
    type: String,
    required: true
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Command', commandSchema);