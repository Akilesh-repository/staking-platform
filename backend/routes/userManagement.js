const router = require('express').Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// 1. GET ALL USERS (For Admin Dashboard)
router.get('/all', async (req, res) => {
  try {
    // Fetch all users but hide passwords
    const users = await User.find().select('-password').sort({ createdAt: -1 });
    res.status(200).json(users);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 2. BLOCK / UNBLOCK USER
router.put('/status', async (req, res) => {
  try {
    const { userId, isBlocked } = req.body;
    
    await User.findByIdAndUpdate(userId, { isBlocked });
    
    res.status(200).json({ 
      message: `User ${isBlocked ? 'Blocked 🛑' : 'Unblocked ✅'}` 
    });
  } catch (err) {
    res.status(500).json(err);
  }
});

// 3. ADJUST WALLET BALANCE (Add or Deduct Money)
router.post('/adjust-balance', async (req, res) => {
  try {
    const { userId, type, amount, note } = req.body; 
    // type: 'credit' (add) or 'debit' (deduct)

    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Update Balance
    if (type === 'credit') {
      user.walletBalance += Number(amount);
    } else {
      user.walletBalance -= Number(amount);
    }
    await user.save();

    // Create a Transaction Record (So user sees it in history)
    const newTx = new Transaction({
      userId,
      type: type === 'credit' ? 'deposit' : 'withdraw', // Reusing existing types
      amount: Number(amount),
      status: 'approved', // Auto-approved since Admin did it
      paymentDetails: {
        method: 'Admin Adjustment',
        transactionId: `ADMIN-${Date.now()}`,
        note: note || 'Manual Balance Adjustment by Admin'
      }
    });
    await newTx.save();

    res.status(200).json({ message: "Balance Updated Successfully!" });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Adjustment Failed" });
  }
});

module.exports = router;