import { useState } from 'react';
import axios from 'axios';
import { useNavigate, Link } from 'react-router-dom';

// --- ICONS (SVGs) ---
const HandWaveIcon = () => (
  <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#00D09C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 11V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2-2v0"></path>
    <path d="M14 10V4a2 2 0 0 0-2-2v0a2 2 0 0 0-2-2v2"></path>
    <path d="M10 10.5V6a2 2 0 0 0-2-2v0a2 2 0 0 0-2-2v8"></path>
    <path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"></path>
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

function Login() {
  const [formData, setFormData] = useState({
    username: '',
    password: ''
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
      const res = await axios.post('/api/auth/login', formData);
      
      // Save user info to browser storage
      localStorage.setItem('user', JSON.stringify(res.data));
      
      // Redirect to Dashboard
      navigate('/dashboard'); 
      
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Login Failed");
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
      maxWidth: '420px',
      background: '#FFFFFF',
      padding: '40px',
      borderRadius: '20px',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      border: '1px solid #E5E7EB',
      textAlign: 'center',
      boxSizing: 'border-box'
    },
    // Icon Header
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
    forgotLink: {
      display: 'block',
      textAlign: 'right',
      marginBottom: '25px',
      fontSize: '0.9rem',
      color: '#00D09C', // Brand Green
      textDecoration: 'none',
      fontWeight: '600',
      cursor: 'pointer'
    },
    button: {
      width: '100%',
      padding: '16px',
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
    registerText: {
      marginTop: '25px',
      fontSize: '0.95rem',
      color: '#6B7280'
    },
    registerLink: {
      color: '#111827',
      fontWeight: '700',
      textDecoration: 'none',
      marginLeft: '5px'
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        
        {/* Header Icon */}
        <div style={styles.iconCircle}>
          <HandWaveIcon />
        </div>

        <h2 style={styles.title}>Welcome Back</h2>
        <p style={styles.subtitle}>Please login to your account</p>

        <form onSubmit={handleSubmit}>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Username</label>
            <input 
              type="text" 
              name="username" 
              onChange={handleChange} 
              required 
              style={styles.input}
              placeholder="Enter your username"
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
                placeholder="Enter your password"
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

          {/* Forgot Password Link */}
          <Link 
            to="/forgot-password" 
            style={styles.forgotLink}
            onMouseOver={(e) => e.target.style.textDecoration = 'underline'}
            onMouseOut={(e) => e.target.style.textDecoration = 'none'}
          >
            Forgot Password?
          </Link>

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
            Login Securely
          </button>
        </form>

        {/* Register Link */}
        <div style={styles.registerText}>
          Don't have an account? 
          <Link 
            to="/register" 
            style={styles.registerLink}
            onMouseOver={(e) => e.target.style.color = '#00D09C'}
            onMouseOut={(e) => e.target.style.color = '#111827'}
          >
            Sign Up
          </Link>
        </div>

      </div>
    </div>
  );
}

export default Login;