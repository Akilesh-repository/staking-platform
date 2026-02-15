const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const dotenv = require('dotenv');
const path = require('path'); // 🟢 Added this import

// --- IMPORT ROUTES ---
const authRoutes = require('./routes/auth');
const adminRoutes = require('./routes/admin');
const passwordResetRoutes = require('./routes/passwordReset');
const walletRoutes = require('./routes/wallet');
const stakeRoutes = require('./routes/stake');

// --- IMPORT AUTOMATION (CRON JOB) ---
const startCronJob = require('./cron'); 

dotenv.config();
const app = express();

// --- MIDDLEWARE ---
app.use(express.json());
app.use(cors());

// --- DATABASE CONNECTION ---
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("✅ MongoDB Connected Successfully");
    
    // 🚀 START THE PAYOUT ENGINE (Only after DB connects)
    startCronJob(); 
  })
  .catch((err) => console.log("❌ MongoDB Connection Error:", err));

// --- USE ROUTES ---
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/password-reset', passwordResetRoutes);
app.use('/api/wallet', walletRoutes);
app.use('/api/stake', stakeRoutes);
app.use('/api/bank', require('./routes/bank'));
app.use('/api/admin/users', require('./routes/userManagement'));

// -------------------------------------------
// 🟢 SERVE FRONTEND (Deployment Config)
// -------------------------------------------

// 1. Tell Node to serve the static files from the "dist" folder
app.use(express.static(path.join(__dirname, 'dist')));

// 2. "Catch-All" Route: Use Regex /.*/ to match all routes (Fixed for Express v5+)
app.get(/.*/, (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// -------------------------------------------

// --- START SERVER ---
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});