import { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import axios from 'axios';

// --- ICONS (SVGs) ---
const ShieldCheckIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#00D09C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path>
    <polyline points="9 12 11 14 15 10"></polyline>
  </svg>
);

function OtpVerify() {
  const location = useLocation();
  const navigate = useNavigate();
  
  // Get email passed from Register page, or empty string if accessed directly
  const [email, setEmail] = useState(location.state?.email || '');
  const [otp, setOtp] = useState('');

  const handleVerify = async (e) => {
    e.preventDefault();
    try {
      // ✅ CHANGED: Removed localhost
      const res = await axios.post('/api/auth/verify-otp', { email, otp });
      alert(res.data.message); // "Account Verified Successfully"
      navigate('/login'); // Send to login page
    } catch (err) {
      alert(err.response?.data?.message || "Verification Failed");
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
    iconCircle: {
      width: '70px',
      height: '70px',
      borderRadius: '50%',
      background: 'rgba(0, 208, 156, 0.1)', // Very light green
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: '20px'
    },
    title: {
      color: '#111827', // Dark Black
      fontSize: '1.8rem',
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
    // Special styling for OTP input
    otpInput: {
      letterSpacing: '4px',
      textAlign: 'center',
      fontWeight: '700',
      fontSize: '1.2rem'
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
    }
  };

  return (
    <div style={styles.wrapper}>
      <div style={styles.card}>
        
        <div style={styles.header}>
          <div style={styles.iconCircle}>
            <ShieldCheckIcon />
          </div>
          <h2 style={styles.title}>Verify Account</h2>
          <p style={styles.subtitle}>
            Please check your email <strong>{email}</strong> for the verification code.
          </p>
        </div>
        
        <form onSubmit={handleVerify}>
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

          <div style={styles.formGroup}>
            <label style={styles.label}>OTP Code</label>
            <input 
              type="text" 
              value={otp} 
              onChange={(e) => setOtp(e.target.value)} 
              required 
              placeholder="• • • • • •"
              maxLength="6"
              style={{...styles.input, ...styles.otpInput}}
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
            Verify Account
          </button>
        </form>

      </div>
    </div>
  );
}

export default OtpVerify;