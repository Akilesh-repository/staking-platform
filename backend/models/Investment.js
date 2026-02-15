const mongoose = require('mongoose');

const investmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  planAmount: {
    type: Number,
    required: true
  },
  monthlyReturnAmount: { 
    type: Number,
    required: true
  },
  startDate: {
    type: Date,
    default: Date.now
  },
  endDate: { 
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'completed', 'disabled'], 
    default: 'active'
  },
  totalEarnings: {
    type: Number,
    default: 0
  },
  nextPayoutDate: { 
    type: Date,
    required: true
  }
});

// --- THE FIX IS HERE ---
// Check if model exists before compiling
module.exports = mongoose.models.Investment || mongoose.model('Investment', investmentSchema);