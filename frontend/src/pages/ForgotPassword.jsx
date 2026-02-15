import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// --- ICONS (SVGs) ---
const LockIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#00D09C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const BackArrowIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

function ForgotPassword() {
  const [step, setStep] = useState(1); // 1 = Email, 2 = OTP & New Password
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [newPassword, setNewPassword] = useState('');
  
  const navigate = useNavigate();

  // Handle Step 1: Send OTP
  const handleRequestOtp = async (e) => {
    e.preventDefault();
    try {
      // ✅ CHANGED: Removed localhost
      const res = await axios.post('/api/password-reset/request-otp', { email });
      alert(res.data.message); 
      setStep(2); 
    } catch (err) {
      alert(err.response?.data?.message || "Error sending OTP");
    }
  };

  // Handle Step 2: Reset Password
  const handleResetPassword = async (e) => {
    e.preventDefault();
    try {
      // ✅ CHANGED: Removed localhost
      const res = await axios.post('/api/password-reset/reset', { 
        email, 
        otp, 
        newPassword 
      });
      alert(res.data.message);
      navigate('/login');
    } catch (err) {
      alert(err.response?.data?.message || "Reset Failed");
    }
  };

  // --- STYLES (GrowwPark Premium Theme) ---
  const styles = {
    wrapper: {
      minHeight: '100vh',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: '#F3F4F6', // Soft Light Grey
      fontFamily: "'Inter', 'Segoe UI', sans-serif"
    },
    card: {
      width: '100%',
      maxWidth: '450px',
      background: '#FFFFFF',
      padding: '40px',
      borderRadius: '20px',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      border: '1px solid #E5E7EB',
      textAlign: 'center',
      boxSizing: 'border-box'
    },
    // Header Section
    header: {
      marginBottom: '30px',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center'
    },
    logoImage: {
      width: '50px',
      height: '50px',
      borderRadius: '10px',
      marginBottom: '15px',
      objectFit: 'contain'
    },
    iconCircle: {
      width: '60px',
      height: '60px',
      borderRadius: '50%',
      background: 'rgba(0, 208, 156, 0.1)', // Very light green
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '15px'
    },
    title: {
      color: '#111827', // Dark Black
      fontSize: '1.6rem',
      fontWeight: '800',
      marginBottom: '8px',
      marginTop: 0,
      letterSpacing: '-0.5px'
    },
    subtitle: {
      color: '#6B7280',
      fontSize: '0.95rem',
      marginTop: '0',
      lineHeight: '1.5'
    },
    
    // Form Elements
    formGroup: {
      marginBottom: '20px',
      textAlign: 'left',
      width: '100%'
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      color: '#374151',
      fontSize: '0.9rem',
      fontWeight: '600'
    },
    input: {
      width: '100%',
      padding: '14px 16px',
      fontSize: '1rem',
      border: '1px solid #D1D5DB',
      borderRadius: '10px',
      outline: 'none',
      transition: 'all 0.3s ease',
      background: '#F9FAFB',
      color: '#111827',
      boxSizing: 'border-box'
    },
    button: {
      width: '100%',
      padding: '16px',
      marginTop: '10px',
      background: '#00D09C', // Brand Green
      color: '#064E3B', // Deep Green Text
      border: 'none',
      borderRadius: '12px',
      fontSize: '1.05rem',
      fontWeight: '700',
      cursor: 'pointer',
      boxShadow: '0 4px 6px -1px rgba(0, 208, 156, 0.2)',
      transition: 'transform 0.2s, background 0.2s',
      boxSizing: 'border-box'
    },
    
    // Navigation
    backButton: {
      marginTop: '25px',
      background: 'transparent',
      border: 'none',
      color: '#6B7280',
      cursor: 'pointer',
      fontSize: '0.9rem',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px',
      width: '100%',
      transition: 'color 0.2s'
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        
        <div style={styles.header}>
          {/* Using Logo or Lock Icon based on preference, here using Lock Icon for context */}
          <div style={styles.iconCircle}>
            <LockIcon />
          </div>
          <h2 style={styles.title}>Reset Password</h2>
          <p style={styles.subtitle}>
            {step === 1 
              ? "Enter your email address and we'll send you an OTP to reset your password." 
              : `We've sent a verification code to ${email}`}
          </p>
        </div>
        
        {step === 1 && (
          <form onSubmit={handleRequestOtp}>
            <div style={styles.formGroup}>
              <label style={styles.label}>Email Address</label>
              <input 
                type="email" 
                value={email} 
                onChange={(e) => setEmail(e.target.value)} 
                required 
                style={styles.input}
                placeholder="name@example.com"
                onFocus={(e) => {
                  e.target.style.borderColor = '#00D09C';
                  e.target.style.background = '#FFFFFF';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#D1D5DB';
                  e.target.style.background = '#F9FAFB';
                }}
              />
            </div>
            <button 
              type="submit" 
              style={styles.button}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.background = '#00c493';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = '#00D09C';
              }}
            >
              Send OTP
            </button>
          </form>
        )}

        {step === 2 && (
          <form onSubmit={handleResetPassword}>
            
            <div style={styles.formGroup}>
              <label style={styles.label}>Enter OTP</label>
              <input 
                type="text" 
                value={otp} 
                onChange={(e) => setOtp(e.target.value)} 
                required 
                style={{...styles.input, letterSpacing: '2px', textAlign: 'center', fontWeight: 'bold'}}
                placeholder="------"
                maxLength="6"
                onFocus={(e) => {
                  e.target.style.borderColor = '#00D09C';
                  e.target.style.background = '#FFFFFF';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#D1D5DB';
                  e.target.style.background = '#F9FAFB';
                }}
              />
            </div>

            <div style={styles.formGroup}>
              <label style={styles.label}>New Password</label>
              <input 
                type="password" 
                value={newPassword} 
                onChange={(e) => setNewPassword(e.target.value)} 
                required 
                style={styles.input}
                placeholder="Enter new password"
                onFocus={(e) => {
                  e.target.style.borderColor = '#00D09C';
                  e.target.style.background = '#FFFFFF';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#D1D5DB';
                  e.target.style.background = '#F9FAFB';
                }}
              />
            </div>

            <button 
              type="submit" 
              style={styles.button}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.background = '#00c493';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = '#00D09C';
              }}
            >
              Reset Password
            </button>
          </form>
        )}

        <button 
          onClick={() => navigate('/login')} 
          style={styles.backButton}
          onMouseOver={(e) => e.currentTarget.style.color = '#111827'}
          onMouseOut={(e) => e.currentTarget.style.color = '#6B7280'}
        >
          <BackArrowIcon /> Back to Login
        </button>

      </div>
    </div>
  );
}

export default ForgotPassword;