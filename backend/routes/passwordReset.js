const router = require('express').Router();
const User = require('../models/User');
const nodemailer = require('nodemailer'); // Import Nodemailer directly

// 1. REQUEST OTP ROUTE
router.post('/request-otp', async (req, res) => {
  try {
    const { email } = req.body;

    // Check if user exists
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    // Save OTP to Database
    user.otp = otp;
    await user.save();

    // --- SETUP EMAIL SENDER ---
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: process.env.EMAIL_USER, // Reads from your .env file
        pass: process.env.EMAIL_PASS, // Reads from your .env file
      },
    });

    // --- SEND THE EMAIL ---
    await transporter.sendMail({
      from: '"GrowwPark Support" <no-reply@growwpark.com>', // Sender Name
      to: email, // Receiver Email
      subject: 'Reset Your Password - GrowwPark',
      text: `Your Verification Code is: ${otp}`, // The body of the email
    });

    console.log(`✅ Email sent to ${email}`);
    res.status(200).json({ message: "OTP sent to your email!" });

  } catch (err) {
    console.error("❌ Email Error:", err);
    res.status(500).json({ message: "Failed to send email. Check server logs." });
  }
});

// 2. RESET PASSWORD ROUTE
router.post('/reset', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;

    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    // Verify OTP
    if (user.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Update Password
    user.password = newPassword;
    user.otp = null; // Clear OTP so it can't be used again
    await user.save();

    res.status(200).json({ message: "Password Reset Successfully. Please Login." });

  } catch (err) {
    res.status(500).json(err);
  }
});

module.exports = router;