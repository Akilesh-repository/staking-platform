import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

// --- ICONS (SVGs) ---
const RocketIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#00D09C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"></path>
    <path d="M12 15l-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"></path>
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"></path>
    <path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"></path>
  </svg>
);

const EyeIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path>
    <circle cx="12" cy="12" r="3"></circle>
  </svg>
);

const EyeOffIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#6B7280" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17.94 17.94A10.07 10.07 0 0 1 12 20c-7 0-11-8-11-8a18.45 18.45 0 0 1 5.06-5.94M9.9 4.24A9.12 9.12 0 0 1 12 4c7 0 11 8 11 8a18.5 18.5 0 0 1-2.16 3.19m-6.72-1.07a3 3 0 1 1-4.24-4.24"></path>
    <line x1="1" y1="1" x2="23" y2="23"></line>
  </svg>
);

function Register() {
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    referralCode: '' 
  });
  
  // State to toggle password visibility
  const [showPassword, setShowPassword] = useState(false);
  
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/auth/register', formData);
      alert(res.data.message); 
      navigate('/login'); 
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Registration Failed");
    }
  };

  // --- STYLES (GrowwPark Premium Theme) ---
  const styles = {
    container: {
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
    iconCircle: {
      width: '70px',
      height: '70px',
      borderRadius: '50%',
      background: 'rgba(0, 208, 156, 0.1)', // Very light green
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      margin: '0 auto 20px auto'
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
      marginBottom: '30px',
      marginTop: 0
    },
    
    // Form Elements
    inputGroup: {
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
    
    // Password Wrapper for Eye Icon
    passwordWrapper: {
      position: 'relative',
      display: 'flex',
      alignItems: 'center',
      width: '100%'
    },
    passwordInput: {
      width: '100%',
      padding: '14px 45px 14px 16px', // Extra right padding so text doesn't hide behind icon
      fontSize: '1rem',
      border: '1px solid #D1D5DB',
      borderRadius: '10px',
      outline: 'none',
      transition: 'all 0.3s ease',
      background: '#F9FAFB',
      color: '#111827',
      boxSizing: 'border-box'
    },
    eyeBtn: {
      position: 'absolute',
      right: '12px',
      background: 'transparent',
      border: 'none',
      cursor: 'pointer',
      padding: '0',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },

    // Referral Input Style
    referralInput: {
      width: '100%',
      padding: '14px 16px',
      fontSize: '1rem',
      border: '1px dashed #00D09C', // Dashed Brand Green border
      borderRadius: '10px',
      outline: 'none',
      transition: 'all 0.3s ease',
      background: '#F0FDFA', // Light teal/green tint
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
    
    // Footer
    loginText: {
      marginTop: '25px',
      fontSize: '0.95rem',
      color: '#6B7280'
    },
    loginLink: {
      color: '#111827',
      fontWeight: '700',
      textDecoration: 'none',
      marginLeft: '5px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        
        <div style={styles.iconCircle}>
          <RocketIcon />
        </div>

        <h2 style={styles.title}>Create Account</h2>
        <p style={styles.subtitle}>Join us and start growing your wealth</p>

        <form onSubmit={handleSubmit}>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <input 
              type="text" 
              name="username" 
              onChange={handleChange} 
              required 
              style={styles.input}
              placeholder="Choose a username"
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
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Email Address</label>
            <input 
              type="email" 
              name="email" 
              onChange={handleChange} 
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

          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <div style={styles.passwordWrapper}>
              <input 
                type={showPassword ? "text" : "password"} 
                name="password" 
                onChange={handleChange} 
                required 
                style={styles.passwordInput}
                placeholder="Create a strong password"
                onFocus={(e) => {
                  e.target.style.borderColor = '#00D09C';
                  e.target.style.background = '#FFFFFF';
                }}
                onBlur={(e) => {
                  e.target.style.borderColor = '#D1D5DB';
                  e.target.style.background = '#F9FAFB';
                }}
              />
              <button 
                type="button" 
                onClick={() => setShowPassword(!showPassword)} 
                style={styles.eyeBtn}
                title={showPassword ? "Hide Password" : "Show Password"}
              >
                {showPassword ? <EyeOffIcon /> : <EyeIcon />}
              </button>
            </div>
          </div>

          {/* REFERRAL CODE INPUT */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Referral Code (Required)</label>
            <input 
              type="text" 
              name="referralCode" 
              onChange={handleChange} 
              required 
              style={styles.referralInput}
              placeholder="e.g. REF123"
              onFocus={(e) => {
                e.target.style.borderColor = '#059669'; // Darker green on focus
                e.target.style.background = '#FFFFFF';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#00D09C'; // Return to dashed green
                e.target.style.background = '#F0FDFA';
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
            Sign Up Now
          </button>

          <div style={styles.loginText}>
            Already have an account? 
            <Link 
              to="/login" 
              style={styles.loginLink}
              onMouseOver={(e) => e.target.style.color = '#00D09C'}
              onMouseOut={(e) => e.target.style.color = '#111827'}
            >
              Login here
            </Link>
          </div>

        </form>
      </div>
    </div>
  );
}

export default Register;