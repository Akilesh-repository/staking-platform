const mongoose = require('mongoose');

const transactionSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  type: {
    type: String,
    // UPDATED: Added 'referral' to the list so rewards can be saved
    enum: ['deposit', 'withdraw', 'interest', 'referral'], 
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'paid', 'rejected', 'completed'], 
    default: 'pending'
  },
  paymentDetails: {
    transactionId: { type: String, default: '' }, // For Deposits
    
    // For Withdrawals
    bankName: { type: String, default: '' },
    accountHolder: { type: String, default: '' },
    accountNumber: { type: String, default: '' },
    ifsc: { type: String, default: '' },
    branch: { type: String, default: '' },
    
    // For System Notes (e.g., "Referral Bonus from UserX")
    note: { type: String, default: '' }
  },
  date: {
    type: Date,
    default: Date.now
  }
});

// --- THE FIX ---
// Check if model exists before compiling to prevent crashes
module.exports = mongoose.models.Transaction || mongoose.model('Transaction', transactionSchema);