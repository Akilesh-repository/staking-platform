const router = require('express').Router();
const User = require('../models/User');
const Investment = require('../models/Investment');
const Transaction = require('../models/Transaction');

// 1. CREATE NEW INVESTMENT (With Referral Rewards)
router.post('/invest', async (req, res) => {
  try {
    const { userId, amount, mode } = req.body; 
    
    // A. Validate User & Balance
    const user = await User.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.walletBalance < amount) {
      return res.status(400).json({ message: "Insufficient Wallet Balance" });
    }

    // B. Calculate Investment Details
    const interestRate = 0.06; 
    const monthlyReturn = amount * interestRate;
    
    // C. Dates Calculation
    const startDate = new Date();
    let endDate = new Date(startDate);
    let nextPayout = new Date(startDate);

    if (mode === 'test') {
      // ⚡ TEST MODE: Ends in 60 seconds, Pays every 10 seconds
      endDate = new Date(startDate.getTime() + 60 * 1000); 
      nextPayout = new Date(startDate.getTime() + 10 * 1000); 
    } 
    else if (mode === 'day') {
      // 🌤️ 1 DAY MODE: Ends in 24 Hours, Pays in 24 Hours
      endDate = new Date(startDate.getTime() + 24 * 60 * 60 * 1000); 
      nextPayout = new Date(startDate.getTime() + 24 * 60 * 60 * 1000); 
    }
    else {
      // 📅 STANDARD MODE: Ends in 60 Months, Pays every 1 Month
      endDate.setMonth(endDate.getMonth() + 60);
      nextPayout.setMonth(nextPayout.getMonth() + 1);
    }

    // D. DEDUCT MONEY FROM WALLET
    user.walletBalance -= amount;
    await user.save();

    // E. CREATE INVESTMENT RECORD
    const newInvestment = new Investment({
      userId,
      planAmount: amount,
      monthlyReturnAmount: monthlyReturn,
      startDate: startDate,
      endDate: endDate,
      nextPayoutDate: nextPayout,
      status: 'active'
    });
    await newInvestment.save();

    // F. LOG USER TRANSACTION (Withdrawal)
    const tx = new Transaction({
      userId,
      type: 'withdraw', 
      amount: amount,
      status: 'approved', 
      paymentDetails: { 
        method: 'System', 
        transactionId: `INV-${newInvestment._id}`,
        note: `Investment Mode: ${mode || 'standard'}`
      }
    });
    await tx.save();

    // ====================================================
    // 🎁 REFERRAL REWARD LOGIC START
    // ====================================================
    if (user.referredBy) {
      try {
        const referrer = await User.findById(user.referredBy);
        
        if (referrer) {
          // Check if Referrer has an ACTIVE investment
          const hasActivePlan = await Investment.exists({ 
            userId: referrer._id, 
            status: 'active' 
          });

          if (hasActivePlan) {
            // Calculate 10% Bonus
            const bonusAmount = amount * 0.10;

            // 1. Pay the Referrer
            referrer.walletBalance += bonusAmount;
            referrer.referralEarnings += bonusAmount;
            await referrer.save();

            // 2. Log Transaction for Referrer
            await Transaction.create({
              userId: referrer._id,
              type: 'referral',
              amount: bonusAmount,
              status: 'approved',
              paymentDetails: { 
                note: `Referral Bonus from ${user.username} (10%)`
              }
            });

            console.log(`🎁 Reward: Paid ₹${bonusAmount} to ${referrer.username}`);
          } else {
            console.log(`⚠️ Referral Skipped: ${referrer.username} has no active plan.`);
          }
        }
      } catch (refErr) {
        console.error("Referral Error (Non-blocking):", refErr);
      }
    }
    // ====================================================
    // 🎁 REFERRAL REWARD LOGIC END
    // ====================================================

    res.status(200).json({ 
      message: `Investment Successful! Mode: ${mode || 'Standard'}` 
    });

  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

// 2. GET ACTIVE INVESTMENT HISTORY
router.get('/history/:userId', async (req, res) => {
  try {
    const investments = await Investment.find({ userId: req.params.userId }).sort({ startDate: -1 });
    res.status(200).json(investments);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 3. GET INCOME HISTORY
router.get('/income/:userId', async (req, res) => {
  try {
    // UPDATED: Now showing 'referral' bonuses in income history too!
    const incomeTx = await Transaction.find({ 
      userId: req.params.userId, 
      type: { $in: ['interest', 'referral'] } 
    }).sort({ date: -1 });

    res.status(200).json(incomeTx);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 4. ADMIN: GET ALL INVESTMENTS
router.get('/admin/all', async (req, res) => {
  try {
    const investments = await Investment.find()
      .populate('userId', 'username email')
      .sort({ startDate: -1 });
    res.status(200).json(investments);
  } catch (err) {
    res.status(500).json(err);
  }
});

// 5. ADMIN: TOGGLE STATUS
router.put('/admin/status', async (req, res) => {
  try {
    const { investmentId, status } = req.body;
    const inv = await Investment.findById(investmentId);
    if (!inv) return res.status(404).json({ message: "Investment not found" });

    inv.status = status;
    await inv.save();
    res.status(200).json({ message: `Investment marked as ${status.toUpperCase()}` });
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;