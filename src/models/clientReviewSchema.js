const mongoose = require('mongoose');

const clientReviewSchema = new mongoose.Schema({
 
  reviewText: {
    type: String,
    required: true
  },
  rating: {
    type: Number,
    required: true,
    min: 1,
    max: 5
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ClientReview = mongoose.model('ClientReview', clientReviewSchema);

module.exports = ClientReview;
