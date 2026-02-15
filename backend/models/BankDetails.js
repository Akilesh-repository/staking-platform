const mongoose = require('mongoose');

const bankDetailsSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
    // NOTE: 'unique: true' is REMOVED to allow multiple bank accounts per user
  },
  accountHolder: {
    type: String,
    required: true
  },
  accountNumber: {
    type: String,
    required: true
  },
  ifsc: {
    type: String,
    required: true
  },
  bankName: {
    type: String,
    required: true
  },
  branch: {
    type: String,
    required: true
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
});

// Crash-proof export
module.exports = mongoose.models.BankDetails || mongoose.model('BankDetails', bankDetailsSchema);