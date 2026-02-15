const router = require('express').Router();
const User = require('../models/User');
const Transaction = require('../models/Transaction'); // <--- IMPORTANT: Added for Earnings History

// Helper to generate random 6-char code (e.g., "A7X29B")
const generateReferralCode = () => {
  return Math.random().toString(36).substring(2, 8).toUpperCase();
};

// 1. REGISTER ROUTE (Updated with Referral Logic)
router.post('/register', async (req, res) => {
  try {
    const { username, email, password, referralCode } = req.body; 

    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) return res.status(400).json({ message: "Email already exists" });

    // Handle Referral Logic
    let referrerId = null;
    if (referralCode) {
      const referrer = await User.findOne({ referralCode: referralCode });
      if (referrer) {
        referrerId = referrer._id;
      } else {
        console.log("Invalid referral code used, skipping link.");
      }
    }

    // Generate Unique Code for New User
    const newMyCode = generateReferralCode();

    // Create new user
    const newUser = new User({
      username,
      email,
      password, 
      isVerified: true, 
      walletBalance: 0,
      referralCode: newMyCode, 
      referredBy: referrerId,
      referralEarnings: 0
    });

    await newUser.save();

    res.status(200).json({ message: "Registration Successful! Please Login." });

  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json(err);
  }
});

// 2. LOGIN ROUTE
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;

    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ message: "User not found" });

    if (user.password !== password) {
      return res.status(400).json({ message: "Wrong Password" });
    }

    const { password: key, ...others } = user._doc;
    res.status(200).json(others);

  } catch (err) {
    res.status(500).json(err);
  }
});

// 3. GET REFERRAL STATS & HISTORY (Updated for Detailed View)
router.get('/referrals/:userId', async (req, res) => {
  try {
    const user = await User.findById(req.params.userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    // A. Get List of People Referred by this User ("My Network")
    const referredUsers = await User.find({ referredBy: req.params.userId })
      .select('username email createdAt isVerified') // Only fetch safe fields
      .sort({ createdAt: -1 });

    // B. Get Referral Income Transactions ("Earnings History")
    const earningsHistory = await Transaction.find({
        userId: req.params.userId,
        type: 'referral'
    }).sort({ date: -1 });

    res.status(200).json({
      referralCode: user.referralCode,
      referralEarnings: user.referralEarnings,
      totalReferred: referredUsers.length,
      referredUsers,      // List of users
      earningsHistory     // List of payouts
    });

  } catch (err) {
    console.error(err);
    res.status(500).json(err);
  }
});

module.exports = router;