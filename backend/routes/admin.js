const router = require('express').Router();
const Admin = require('../models/Admin');

// Admin Login
router.post('/login', async (req, res) => {
  try {
    const { username, password } = req.body;
    
    const admin = await Admin.findOne({ username });
    if (!admin) return res.status(404).json({ message: "Admin not found" });

    if (admin.password !== password) {
      return res.status(400).json({ message: "Wrong Credentials" });
    }

    res.status(200).json({ message: "Admin Login Success", adminId: admin._id });

  } catch (err) {
    res.status(500).json(err);
  }
});

// Create Admin (Run this once via Postman to create your account, then delete this route if you want)
router.post('/create', async (req, res) => {
  const newAdmin = new Admin(req.body);
  try {
    const savedAdmin = await newAdmin.save();
    res.status(200).json(savedAdmin);
  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;