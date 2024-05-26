/* eslint-disable func-names */
const mongoose = require('mongoose');

const donationSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  amount: {
    type: Number,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  isAnonymous: {
    type: Boolean,
    default: false,
  },
  orderId: {
    type: String,
    required: true,
  },
});

const fundraiserSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: true,
    },
    description: {
      type: String,
      required: true,
    },
    goal: {
      type: Number,
      required: true,
    },
    collectedAmount: {
      type: Number,
      default: 0,
    },
    image: {
      type: String,
      required: true,
    },
    isClosed: {
      type: Boolean,
      default: false,
    },
    endDate: {
      type: Date,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    donations: [donationSchema],
  },
  { timestamps: true },
);

// Middleware to update collectedAmount
fundraiserSchema.pre('save', function (next) {
  this.collectedAmount = this.donations.reduce(
    (total, donation) => total + donation.amount,
    0,
  );
  next();
});

fundraiserSchema.virtual('remainingDays').get(function () {
  const now = new Date();
  const end = new Date(this.endDate);
  const diff = Math.ceil((end - now) / (1000 * 60 * 60 * 24));
  return diff > 0 ? diff : 0;
});

module.exports = mongoose.model('Fundraiser', fundraiserSchema);
