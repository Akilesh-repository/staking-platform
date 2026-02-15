const cron = require('node-cron');
const User = require('./models/User');
const Investment = require('./models/Investment');
const Transaction = require('./models/Transaction');

const startCronJob = () => {
  console.log("🕒 Cron Job Started: Checking for payouts...");

  // Run every 5 seconds to be safe and efficient
  cron.schedule('*/5 * * * * *', async () => {
    try {
      const now = new Date();

      // 1. Find active investments where nextPayoutDate is NOW or in the PAST
      const dueInvestments = await Investment.find({
        status: 'active',
        nextPayoutDate: { $lte: now } // $lte means "Less Than or Equal to" now
      });

      if (dueInvestments.length > 0) {
        console.log(`⚡ Processing ${dueInvestments.length} payouts...`);
      }

      for (const inv of dueInvestments) {
        
        // A. PAY THE USER
        const user = await User.findById(inv.userId);
        if (user) {
          user.walletBalance += inv.monthlyReturnAmount;
          await user.save();

          // B. LOG THE TRANSACTION (Interest)
          await Transaction.create({
            userId: inv.userId,
            type: 'interest',
            amount: inv.monthlyReturnAmount,
            status: 'approved',
            paymentDetails: { note: 'Daily/Monthly ROI Payout' }
          });

          // C. UPDATE THE INVESTMENT RECORD
          inv.totalEarnings += inv.monthlyReturnAmount;
          
          // Determine if this is a "Test" plan (10s) or "Standard" plan (1 Month)
          // We can guess based on the amount or just add time logic
          // If the gap between Start and End is small (< 1 hour), it's a test plan
          const isTestPlan = (inv.endDate - inv.startDate) < (1000 * 60 * 60);

          if (isTestPlan) {
             // Add 10 Seconds
             inv.nextPayoutDate = new Date(inv.nextPayoutDate.getTime() + 10 * 1000);
          } else {
             // Add 1 Month
             const nextDate = new Date(inv.nextPayoutDate);
             nextDate.setMonth(nextDate.getMonth() + 1);
             inv.nextPayoutDate = nextDate;
          }

          // D. CHECK IF PLAN IS EXPIRED
          // If the NEW nextPayoutDate is beyond the endDate, the plan is over.
          if (inv.nextPayoutDate > inv.endDate) {
            inv.status = 'completed';
            console.log(`✅ Investment ${inv._id} Completed!`);
          }

          await inv.save();
          console.log(`💰 Paid ₹${inv.monthlyReturnAmount} to User ${user.username}`);
        }
      }

    } catch (err) {
      console.error("❌ Cron Job Error:", err);
    }
  });
};

module.exports = startCronJob;