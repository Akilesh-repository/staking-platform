import { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// --- ICONS (SVGs) ---

// Sidebar Icons
const DashboardIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="3" width="7" height="7"></rect>
    <rect x="14" y="3" width="7" height="7"></rect>
    <rect x="14" y="14" width="7" height="7"></rect>
    <rect x="3" y="14" width="7" height="7"></rect>
  </svg>
);

const WalletIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M20 12V8H6a2 2 0 0 1-2-2c0-1.1.9-2 2-2h12v4"></path>
    <path d="M4 6v12a2 2 0 0 0 2 2h14v-4"></path>
    <path d="M18 12a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v-8h-4z"></path>
  </svg>
);

const TrendUpIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="23 6 13.5 15.5 8.5 10.5 1 18"></polyline>
    <polyline points="17 6 23 6 23 12"></polyline>
  </svg>
);

const UsersIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path>
    <circle cx="9" cy="7" r="4"></circle>
    <path d="M23 21v-2a4 4 0 0 0-3-3.87"></path>
    <path d="M16 3.13a4 4 0 0 1 0 7.75"></path>
  </svg>
);

const LogoutIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"></path>
    <polyline points="16 17 21 12 16 7"></polyline>
    <line x1="21" y1="12" x2="9" y2="12"></line>
  </svg>
);

const MenuIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="12" x2="21" y2="12"></line>
    <line x1="3" y1="6" x2="21" y2="6"></line>
    <line x1="3" y1="18" x2="21" y2="18"></line>
  </svg>
);

// Page Specific Icons
const BoltIcon = () => (
  <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#064E3B" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>
);

function CreateStake() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [walletBalance, setWalletBalance] = useState(0);
  
  // State for Form
  const [selectedAmount, setSelectedAmount] = useState('');
  
  // CONSTANTS
  const INTEREST_RATE = 6; // 6% Monthly
  const DURATION = 60;     // 60 Months

  // Dropdown Options
  const planOptions = [
    { label: '₹ 50,000', value: 50000 },
    { label: '₹ 1,00,000', value: 100000 },
    
    { label: '₹ 2,00,000', value: 200000 },
    
    { label: '₹ 3,00,000', value: 300000 },
    { label: '₹ 5,00,000', value: 500000 },
    { label: '₹ 10,00,000', value: 1000000 },
  ];

  // --- MOBILE RESPONSIVENESS STATE ---
  const [isMobile, setIsMobile] = useState(window.innerWidth < 768);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      const mobile = window.innerWidth < 768;
      setIsMobile(mobile);
      if (!mobile) setSidebarOpen(true); 
      else setSidebarOpen(false);
    };

    window.addEventListener('resize', handleResize);
    handleResize(); 

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // --- DATA FETCHING ---
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    } else {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      fetchWallet(userData._id);
    }
  }, []);

  const fetchWallet = async (userId) => {
    try {
      // ✅ CHANGED: Removed localhost
      const res = await axios.get(`/api/wallet/${userId}`);
      setWalletBalance(res.data.balance);
    } catch (err) {
      console.error("Error fetching wallet");
    }
  };

  const handleInvest = async (e) => {
    e.preventDefault();
    if (!selectedAmount) return alert("Please select a plan amount");
    
    if (Number(selectedAmount) > walletBalance) {
      return alert("Insufficient Wallet Balance! Please Deposit funds first.");
    }

    const confirm = window.confirm(`Are you sure you want to invest ₹${Number(selectedAmount).toLocaleString()}?`);
    if (!confirm) return;

    try {
      // ✅ CHANGED: Removed localhost
      const res = await axios.post('/api/stake/invest', {
        userId: user._id,
        amount: Number(selectedAmount),
        mode: 'standard' 
      });

      alert(res.data.message); 
      navigate('/staking'); 

    } catch (err) {
      alert(err.response?.data?.message || "Investment Failed");
    }
  };

  const calculateReturn = (amount) => {
    if (!amount) return 0;
    return (amount * INTEREST_RATE) / 100;
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  // --- STYLES (GrowwPark Premium Theme) ---
  const styles = {
    wrapper: {
      display: 'flex',
      minHeight: '100vh',
      fontFamily: "'Inter', 'Segoe UI', sans-serif",
      background: '#F3F4F6',
      position: 'relative',
      overflowX: 'hidden'
    },
    // SIDEBAR
    sidebar: {
      boxSizing: 'border-box',
      width: '260px',
      background: '#111827', 
      color: 'white',
      display: 'flex',
      flexDirection: 'column',
      padding: '30px 20px',
      position: 'fixed',
      height: '100vh',
      left: 0,
      top: 0,
      borderRight: '1px solid #374151',
      zIndex: 100, 
      transition: 'transform 0.3s ease-in-out',
      transform: isMobile && !sidebarOpen ? 'translateX(-100%)' : 'translateX(0)',
      boxShadow: isMobile && sidebarOpen ? '5px 0 15px rgba(0,0,0,0.5)' : 'none'
    },
    overlay: {
      position: 'fixed',
      top: 0,
      left: 0,
      width: '100%',
      height: '100%',
      background: 'rgba(0,0,0,0.5)',
      zIndex: 90,
      display: isMobile && sidebarOpen ? 'block' : 'none'
    },
    logoContainer: {
      marginBottom: '50px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '12px'
    },
    logoImage: { width: '40px', height: '40px', borderRadius: '8px', objectFit: 'contain' },
    logoText: { fontSize: '1.5rem', fontWeight: '800', color: 'white', letterSpacing: '-0.5px' },
    
    navItem: {
      padding: '14px 20px',
      marginBottom: '8px',
      borderRadius: '12px',
      cursor: 'pointer',
      fontSize: '1rem',
      transition: 'all 0.2s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '12px',
      color: '#9CA3AF',
      textDecoration: 'none',
      fontWeight: '500'
    },
    logoutBtn: {
       
      background: '#1F2937',
      border: '1px solid #374151',
      color: '#F87171', 
      padding: '12px',
      borderRadius: '12px',
      cursor: 'pointer',
      textAlign: 'center',
      fontWeight: '600',
      transition: '0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    },

    // MAIN CONTENT
    main: {
      marginLeft: isMobile ? 0 : '260px', 
      flex: 1,
      padding: isMobile ? '20px' : '40px 60px', 
      width: '100%',
      transition: 'margin-left 0.3s ease-in-out',
      display: 'flex',
      justifyContent: 'center', 
      alignItems: 'flex-start' 
    },
    
    // Header (Mobile Menu)
    headerBar: {
      position: 'absolute',
      top: '20px',
      left: '20px',
      display: isMobile ? 'block' : 'none',
      zIndex: 50
    },
    menuBtn: {
      background: 'none',
      border: 'none',
      fontSize: '1.8rem',
      cursor: 'pointer',
      color: '#111827',
      padding: '0'
    },

    // FORM CARD
    card: {
      width: '100%',
      maxWidth: '500px',
      background: '#FFFFFF',
      padding: '40px',
      borderRadius: '20px',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      border: '1px solid #E5E7EB',
      marginTop: isMobile ? '60px' : '20px' 
    },
    header: {
      textAlign: 'center',
      marginBottom: '30px'
    },
    icon: {
      fontSize: '2.5rem',
      marginBottom: '15px',
      background: '#ECFDF5',
      width: '70px',
      height: '70px',
      lineHeight: '70px',
      borderRadius: '50%',
      margin: '0 auto',
      color: '#064E3B',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center'
    },
    title: { 
      color: '#111827', 
      fontSize: '1.8rem', 
      fontWeight: '800', 
      margin: 0,
      letterSpacing: '-0.5px'
    },
    
    // WALLET BOX
    balanceBox: {
      background: '#F0FDFA', // Light teal
      color: '#0D9488', // Teal text
      padding: '16px',
      borderRadius: '12px',
      textAlign: 'center',
      fontWeight: '700',
      marginBottom: '25px',
      border: '1px dashed #CCFBF1',
      fontSize: '1.1rem'
    },
    
    // FORM ELEMENTS
    label: {
      display: 'block', 
      marginBottom: '10px', 
      color: '#374151', 
      fontWeight: '600',
      fontSize: '0.95rem'
    },
    select: {
      width: '100%',
      padding: '14px',
      fontSize: '1rem',
      borderRadius: '10px',
      border: '1px solid #D1D5DB',
      marginBottom: '25px',
      outline: 'none',
      cursor: 'pointer',
      background: '#F9FAFB',
      color: '#111827'
    },
    
    // SUMMARY BOX
    summaryBox: {
      background: '#FFFBEB', // Light yellow/amber
      border: '1px solid #FEF3C7',
      padding: '20px',
      borderRadius: '12px',
      marginBottom: '25px',
      color: '#92400E' // Amber text
    },
    summaryRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '10px',
      fontSize: '0.95rem'
    },
    
    // BUTTONS
    submitBtn: {
      width: '100%',
      padding: '16px',
      background: '#00D09C', // Brand Green
      color: '#064E3B', 
      border: 'none',
      borderRadius: '12px',
      fontSize: '1.1rem',
      fontWeight: '700',
      cursor: 'pointer',
      transition: '0.2s',
      boxShadow: '0 4px 6px -1px rgba(0, 208, 156, 0.2)'
    },
    backBtn: {
      background: 'transparent',
      border: 'none',
      color: '#6B7280',
      cursor: 'pointer',
      display: 'block',
      margin: '20px auto 0 auto',
      fontSize: '0.9rem',
      fontWeight: '600'
    }
  };

  return (
    <div style={styles.wrapper}>
      
      {/* MOBILE OVERLAY */}
      <div style={styles.overlay} onClick={() => setSidebarOpen(false)}></div>

      {/* --- SIDEBAR --- */}
      <div style={styles.sidebar}>
        <div style={styles.logoContainer}>
          <img src="/growwpark_logo.jpg" alt="Logo" style={styles.logoImage} />
          <span style={styles.logoText}>GrowwPark</span>
        </div>
        
        <div 
          style={styles.navItem} 
          onClick={() => { navigate('/dashboard'); isMobile && setSidebarOpen(false); }}
          onMouseOver={(e) => { e.currentTarget.style.background = '#1F2937'; e.currentTarget.style.color = '#F3F4F6'; }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9CA3AF'; }}
        >
          <DashboardIcon /> <span>Dashboard</span>
        </div>

        <div 
          style={styles.navItem} 
          onClick={() => { navigate('/wallet'); isMobile && setSidebarOpen(false); }}
          onMouseOver={(e) => { e.currentTarget.style.background = '#1F2937'; e.currentTarget.style.color = '#F3F4F6'; }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9CA3AF'; }}
        >
          <WalletIcon /> <span>My Wallet</span>
        </div>

        <div 
          style={{ ...styles.navItem, background: 'rgba(0, 208, 156, 0.15)', color: '#00D09C', fontWeight: '600' }} 
          onClick={() => { navigate('/staking'); isMobile && setSidebarOpen(false); }}
        >
          <TrendUpIcon /> <span>Staking Plans</span>
        </div>

        <div 
          style={styles.navItem}
          onClick={() => { navigate('/referrals'); isMobile && setSidebarOpen(false); }}
          onMouseOver={(e) => { e.currentTarget.style.background = '#1F2937'; e.currentTarget.style.color = '#F3F4F6'; }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9CA3AF'; }}
        >
          <UsersIcon /> <span>Referrals</span>
        </div>

        <button 
          onClick={handleLogout} 
          style={styles.logoutBtn}
          onMouseOver={(e) => e.currentTarget.style.background = '#374151'}
          onMouseOut={(e) => e.currentTarget.style.background = '#1F2937'}
        >
          <LogoutIcon /> Sign Out
        </button>
      </div>

      {/* --- MAIN CONTENT --- */}
      <div style={styles.main}>
        
        {/* Mobile Menu Button */}
        <div style={styles.headerBar}>
          <button style={styles.menuBtn} onClick={() => setSidebarOpen(true)}>
            <MenuIcon />
          </button>
        </div>

        <div style={styles.card}>
          
          <div style={styles.header}>
            <div style={styles.icon}>
              <BoltIcon />
            </div>
            <h2 style={styles.title}>New Investment</h2>
          </div>

          {/* Wallet Balance Display */}
          <div style={styles.balanceBox}>
            Available Balance: ₹ {walletBalance.toLocaleString()}
          </div>

          <form onSubmit={handleInvest}>
            <label style={styles.label}>
              Select Plan Amount:
            </label>
            
            <select 
              style={styles.select} 
              value={selectedAmount} 
              onChange={(e) => setSelectedAmount(e.target.value)}
              required
            >
              <option value="" disabled>-- Choose an Amount --</option>
              {planOptions.map((option) => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>

            {/* PLAN SUMMARY PREVIEW */}
            <div style={styles.summaryBox}>
              <div style={styles.summaryRow}>
                <span>Interest Rate:</span>
                <span style={{fontWeight: '700'}}>{INTEREST_RATE}% Monthly</span>
              </div>
              <div style={styles.summaryRow}>
                <span>Duration:</span>
                <span style={{fontWeight: '700'}}>{DURATION} Months</span>
              </div>
              <div style={{...styles.summaryRow, borderTop: '1px dashed #FCD34D', paddingTop: '10px', marginTop: '10px'}}>
                <span>Monthly Income:</span>
                <span style={{fontWeight: '800', fontSize: '1.1rem', color: '#B45309'}}>
                  ₹ {calculateReturn(selectedAmount).toLocaleString()}
                </span>
              </div>
            </div>

            <button 
              type="submit" 
              style={styles.submitBtn}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.background = '#00c493'; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = '#00D09C'; }}
            >
              Confirm Investment
            </button>
          </form>

          <button onClick={() => navigate('/staking')} style={styles.backBtn}>
            Cancel & Go Back
          </button>

        </div>
      </div>
    </div>
  );
}

export default CreateStake;