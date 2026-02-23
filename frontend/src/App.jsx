import { useEffect } from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import axios from 'axios';

// Page Imports
import Register from './pages/Register';
import Login from './pages/Login';
import OtpVerify from './pages/OtpVerify';
import ForgotPassword from './pages/ForgotPassword';

// User Imports
import UserDashboard from './pages/UserDashboard';
import Wallet from './pages/Wallet';
import Withdraw from './pages/Withdraw';
import StakingDashboard from './pages/StakingDashboard';
import CreateStake from './pages/CreateStake';
import StakingHistory from './pages/StakingHistory';
import IncomeHistory from './pages/IncomeHistory';
import ReferralHub from './pages/ReferralHub';
import BankManagement from './pages/BankManagement';

// Admin Imports
import AdminSetup from './pages/AdminSetup';
import AdminLogin from './pages/AdminLogin';
import AdminDashboard from './pages/AdminDashboard';
import AdminDepositRequest from './pages/AdminDepositRequest';
import AdminStaking from './pages/AdminStaking';
import AdminUserManagement from './pages/AdminUserManagement';

// --- 🔴 FIX 1: USE YOUR BACKEND TUNNEL URL ---
// OLD:
axios.defaults.baseURL = "http://gpkgrowth.cloud";

// --- 🔴 FIX 2: SET THIS TO FALSE (Fixes the CORS Error) ---
axios.defaults.withCredentials = false; 

function App() {
  return (
    <div>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/otp-verify" element={<OtpVerify />} /> 
        <Route path="/forgot-password" element={<ForgotPassword />} />
        <Route path="/dashboard" element={<UserDashboard />} />
        <Route path="/wallet" element={<Wallet />} />
        <Route path="/withdraw" element={<Withdraw />} />
        <Route path="/staking" element={<StakingDashboard />} />
        <Route path="/staking/create" element={<CreateStake />} /> 
        <Route path="/staking/history" element={<StakingHistory />} />
        <Route path="/staking/income" element={<IncomeHistory />} />
        <Route path="/referrals" element={<ReferralHub />} />
        <Route path="/bank-details" element={<BankManagement />} />
        <Route path="/secret-setup" element={<AdminSetup />} />
        <Route path="/admin-login" element={<AdminLogin />} />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin-deposits" element={<AdminDepositRequest />} />
        <Route path="/admin-staking" element={<AdminStaking />} />
        <Route path="/admin-users" element={<AdminUserManagement />} />
      </Routes>
    </div>
  )
}

export default App;