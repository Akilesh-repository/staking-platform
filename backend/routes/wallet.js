const router = require('express').Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction');

// 1. DEPOSIT REQUEST
router.post('/deposit', async (req, res) => {
  try {
    const { userId, amount, transactionId } = req.body;
    const newTx = new Transaction({
      userId,
      type: 'deposit',
      amount,
      status: 'pending',
      paymentDetails: { transactionId }
    });
    await newTx.save();
    res.status(200).json({ message: "Deposit request submitted." });
  } catch (err) {
    res.status(500).json(err);
  }
});

// 2. WITHDRAW REQUEST (Updated with Fund Locking)
router.post('/withdraw', async (req, res) => {
  try {
    const { userId, amount, bankDetails } = req.body; 
    // bankDetails is an object: { accountHolder, accountNumber, ifsc, bankName, branch }

    const user = await User.findById(userId);
    
    // Check Balance
    if (user.walletBalance < amount) {
      return res.status(400).json({ message: "Insufficient Balance" });
    }

    // 🔒 FUND LOCKING: Deduct money immediately
    user.walletBalance -= amount;
    await user.save();

    // Create Transaction Record
    const newTx = new Transaction({
      userId,
      type: 'withdraw',
      amount,
      status: 'pending',
      paymentDetails: bankDetails // Save full bank info
    });

    await newTx.save();
    res.status(200).json({ message: "Withdrawal request submitted. Funds locked." });

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

// 3. GET USER WALLET DATA
router.get('/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });
    
    const history = await Transaction.find({ userId: req.params.userId }).sort({ date: -1 });
    
    res.status(200).json({ balance: user.walletBalance, history });
  } catch (err) {
    res.status(500).json(err);
  }
});

// 4. ADMIN: GET PENDING REQUESTS
router.get('/admin/pending', async (req, res) => {
  try {
    const pendingTx = await Transaction.find({ status: 'pending' }).populate('userId', 'username email');
    res.status(200).json(pendingTx);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 5. ADMIN: HANDLE REQUEST (Approve/Reject/Refund)
router.post('/admin/handle', async (req, res) => {
  try {
    const { transactionId, action } = req.body; 
    // action can be: 'approve' (for deposits), 'paid' (for withdrawals), 'reject'
    
    const tx = await Transaction.findById(transactionId);
    if (!tx || tx.status !== 'pending') return res.status(400).json({ message: "Transaction invalid" });

    const user = await User.findById(tx.userId);

    // --- SCENARIO A: DEPOSIT ---
    if (tx.type === 'deposit') {
      if (action === 'approve') {
        user.walletBalance += tx.amount; // Add money
        tx.status = 'approved';
        await user.save();
        await tx.save();
        return res.status(200).json({ message: "Deposit Approved." });
      } 
      else if (action === 'reject') {
        tx.status = 'rejected';
        await tx.save();
        return res.status(200).json({ message: "Deposit Rejected." });
      }
    }

    // --- SCENARIO B: WITHDRAWAL ---
    if (tx.type === 'withdraw') {
      if (action === 'paid') {
        // Money was already deducted, so just mark complete
        tx.status = 'paid'; 
        await tx.save();
        return res.status(200).json({ message: "Withdrawal marked as Paid." });
      }
      else if (action === 'reject') {
        // 🔄 REFUND LOGIC: Give money back
        user.walletBalance += tx.amount; 
        tx.status = 'rejected';
        await user.save();
        await tx.save();
        return res.status(200).json({ message: "Withdrawal Rejected. Funds Refunded." });
      }
    }

  } catch (err) {
    console.log(err);
    res.status(500).json(err);
  }
});

module.exports = router;