const router = require('express').Router();
const BankDetails = require('../models/BankDetails');

// 1. ADD NEW BANK DETAIL (Multi-Bank Support)
router.post('/add', async (req, res) => {
  try {
    const { userId, accountHolder, accountNumber, ifsc, bankName, branch } = req.body;

    // Validation
    if (!userId || !accountNumber || !ifsc || !bankName) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    // Create a NEW document
    const newBank = new BankDetails({
      userId,
      accountHolder,
      accountNumber,
      ifsc,
      bankName,
      branch,
      updatedAt: Date.now()
    });

    await newBank.save();

    res.status(200).json({ message: "Bank Account Added Successfully!", data: newBank });

  } catch (err) {
    console.error("Bank Add Error:", err);
    res.status(500).json({ message: "Failed to add bank account" });
  }
});

// 2. GET ALL BANKS FOR USER
router.get('/:userId', async (req, res) => {
  try {
    const banks = await BankDetails.find({ userId: req.params.userId });
    res.status(200).json(banks); 
  } catch (err) {
    res.status(500).json(err);
  }
});

// 3. DELETE A BANK ACCOUNT
router.delete('/:id', async (req, res) => {
  try {
    await BankDetails.findByIdAndDelete(req.params.id);
    res.status(200).json({ message: "Bank Account Removed" });
  } catch (err) {
    res.status(500).json(err);
  }
});

// =========================================================
// 4. 🛠️ DATABASE FIX ROUTE (RUN THIS ONCE)
// =========================================================
router.get('/fix/db-cleanup', async (req, res) => {
  try {
    // This command forces MongoDB to forget the old "Unique" rule
    await BankDetails.collection.dropIndex('userId_1');
    res.status(200).send("✅ SUCCESS: Database rule fixed! You can now add multiple banks.");
  } catch (err) {
    res.status(500).send("ℹ️ Note: " + err.message);
  }
});

module.exports = router;