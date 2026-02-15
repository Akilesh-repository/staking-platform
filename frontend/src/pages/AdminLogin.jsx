import { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

function AdminLogin() {
  const [formData, setFormData] = useState({ username: '', password: '' });
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // ✅ CHANGED: Removed localhost
      const res = await axios.post('/api/admin/login', formData);
      // Save admin info
      localStorage.setItem('admin', JSON.stringify(res.data));
      navigate('/admin-dashboard');
    } catch (err) {
      alert("Invalid Admin Credentials");
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
      boxSizing: 'border-box' // Ensures padding doesn't break width
    },
    // Logo Section
    logoContainer: {
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      marginBottom: '30px'
    },
    logoImage: {
      width: '60px',
      height: '60px',
      borderRadius: '12px',
      marginBottom: '15px',
      objectFit: 'contain'
    },
    title: {
      color: '#111827', // Dark Black
      fontSize: '1.8rem',
      fontWeight: '800',
      marginBottom: '5px',
      letterSpacing: '-0.5px'
    },
    subtitle: {
      color: '#6B7280',
      fontSize: '0.95rem',
      marginTop: '0'
    },
    
    // Form Elements
    inputGroup: {
      marginBottom: '20px',
      textAlign: 'left',
      width: '100%' // Ensure group takes full width
    },
    label: {
      display: 'block',
      marginBottom: '8px',
      color: '#374151', // Dark Grey
      fontSize: '0.9rem',
      fontWeight: '600'
    },
    input: {
      width: '100%',
      padding: '14px 16px',
      fontSize: '1rem',
      border: '1px solid #D1D5DB', // Light Grey Border
      borderRadius: '10px',
      outline: 'none',
      transition: 'all 0.3s ease',
      background: '#F9FAFB',
      color: '#111827',
      boxSizing: 'border-box' // KEY FIX: Keeps padding inside the width
    },
    button: {
      width: '100%',
      padding: '16px',
      marginTop: '10px',
      background: '#00D09C', // Brand Green
      color: '#064E3B', // Deep Green Text for Contrast
      border: 'none',
      borderRadius: '12px',
      fontSize: '1.05rem',
      fontWeight: '700',
      cursor: 'pointer',
      boxShadow: '0 4px 6px -1px rgba(0, 208, 156, 0.2)',
      transition: 'transform 0.2s, background 0.2s',
      boxSizing: 'border-box' // KEY FIX
    }
  };

  return (
    <div style={styles.container}>
      <div style={styles.card}>
        
        {/* Logo & Title */}
        <div style={styles.logoContainer}>
          <img src="/growwpark_logo.jpg" alt="Logo" style={styles.logoImage} />
          <h2 style={styles.title}>Admin Portal</h2>
          <p style={styles.subtitle}>Secure Access Only</p>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div style={styles.inputGroup}>
            <label style={styles.label}>Admin ID</label>
            <input 
              type="text" 
              name="username" 
              onChange={e => setFormData({...formData, username: e.target.value})} 
              style={styles.input}
              placeholder="Enter username"
              required
              onFocus={(e) => {
                e.target.style.borderColor = '#00D09C';
                e.target.style.background = '#FFFFFF';
                e.target.style.boxShadow = '0 0 0 3px rgba(0, 208, 156, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#D1D5DB';
                e.target.style.background = '#F9FAFB';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          
          <div style={styles.inputGroup}>
            <label style={styles.label}>Password</label>
            <input 
              type="password" 
              name="password" 
              onChange={e => setFormData({...formData, password: e.target.value})} 
              style={styles.input}
              placeholder="••••••••"
              required
              onFocus={(e) => {
                e.target.style.borderColor = '#00D09C';
                e.target.style.background = '#FFFFFF';
                e.target.style.boxShadow = '0 0 0 3px rgba(0, 208, 156, 0.1)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#D1D5DB';
                e.target.style.background = '#F9FAFB';
                e.target.style.boxShadow = 'none';
              }}
            />
          </div>
          
          <button 
            type="submit" 
            style={styles.button}
            onMouseOver={(e) => {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.background = '#00c493'; // Slightly darker green
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.transform = 'translateY(0)';
              e.currentTarget.style.background = '#00D09C';
            }}
          >
            Access Dashboard
          </button>
        </form>
      </div>
    </div>
  );
}

export default AdminLogin;