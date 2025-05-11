const mongoose = require('mongoose');

const ChatMessageSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    index: true // Add index for faster queries by username
  },
  message: {
    type: String,
    required: true
  },
  response: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now,
    index: true // Add index for faster chronological sorting
  }
});

// Create a compound index for username + createdAt for optimal sorting and filtering
ChatMessageSchema.index({ username: 1, createdAt: 1 });

module.exports = mongoose.model('ChatMessage', ChatMessageSchema);