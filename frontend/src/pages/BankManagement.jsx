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
const BankIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="21" x2="21" y2="21"></line>
    <line x1="5" y1="21" x2="5" y2="10"></line>
    <line x1="19" y1="21" x2="19" y2="10"></line>
    <line x1="9" y1="21" x2="9" y2="10"></line>
    <line x1="15" y1="21" x2="15" y2="10"></line>
    <polygon points="2 10 12 3 22 10 2 10"></polygon>
  </svg>
);

const PlusCircleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#111827" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="16"></line>
    <line x1="8" y1="12" x2="16" y2="12"></line>
  </svg>
);

const TrashIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="3 6 5 6 21 6"></polyline>
    <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"></path>
  </svg>
);

const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

function BankManagement() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [banks, setBanks] = useState([]); 
  
  // Form State
  const [formData, setFormData] = useState({
    accountHolder: '',
    accountNumber: '',
    ifsc: '',
    bankName: '',
    branch: ''
  });

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
      fetchBanks(userData._id);
    }
  }, []);

  const fetchBanks = async (userId) => {
    try {
      const res = await axios.get(`http://localhost:5000/api/bank/${userId}`);
      setBanks(res.data);
    } catch (err) {
      console.error("Error fetching banks");
    }
  };

  const handleDelete = async (bankId) => {
    if (!window.confirm("Are you sure you want to delete this bank account?")) return;

    try {
      await axios.delete(`http://localhost:5000/api/bank/${bankId}`);
      fetchBanks(user._id);
    } catch (err) {
      alert("Failed to delete bank");
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('http://localhost:5000/api/bank/add', {
        userId: user._id,
        ...formData
      });
      alert("Bank Account Added Successfully!");
      
      setFormData({
        accountHolder: '', accountNumber: '', ifsc: '', bankName: '', branch: ''
      });
      fetchBanks(user._id);

    } catch (err) {
      alert("Failed to add bank account");
    }
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
      marginTop: 'auto', 
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
      transition: 'margin-left 0.3s ease-in-out'
    },
    
    // Header
    header: {
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: '30px',
    },
    headerLeft: {
      display: 'flex',
      alignItems: 'center',
      gap: '15px'
    },
    menuBtn: {
      display: isMobile ? 'block' : 'none',
      background: 'none',
      border: 'none',
      fontSize: '1.8rem',
      cursor: 'pointer',
      color: '#111827',
      padding: '0'
    },
    title: {
      fontSize: isMobile ? '1.5rem' : '1.8rem',
      fontWeight: '800',
      color: '#111827',
      margin: 0,
      letterSpacing: '-0.5px'
    },
    backBtn: {
      padding: '8px 16px',
      background: '#FFFFFF',
      border: '1px solid #E5E7EB',
      borderRadius: '8px',
      cursor: 'pointer',
      color: '#4B5563',
      fontWeight: '600',
      fontSize: '0.9rem',
      display: isMobile ? 'none' : 'block',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },

    // SECTIONS & CARDS
    card: {
      background: '#FFFFFF',
      padding: '30px',
      borderRadius: '16px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      border: '1px solid #E5E7EB',
      marginBottom: '30px'
    },
    sectionTitle: {
      marginTop: 0,
      marginBottom: '20px',
      color: '#111827',
      fontSize: '1.2rem',
      fontWeight: '700',
      borderBottom: '1px solid #F3F4F6',
      paddingBottom: '10px',
      display: 'flex',
      alignItems: 'center',
      gap: '10px'
    },

    // BANK ITEMS
    bankItem: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      padding: '16px',
      background: '#F9FAFB',
      border: '1px solid #E5E7EB',
      borderRadius: '12px',
      marginBottom: '12px',
      transition: '0.2s'
    },
    bankDetails: {
      fontSize: '1rem',
      color: '#111827',
      fontWeight: '600'
    },
    bankSub: {
      fontSize: '0.85rem',
      color: '#6B7280',
      marginTop: '4px'
    },
    deleteBtn: {
      background: '#FEE2E2',
      color: '#991B1B',
      border: 'none',
      padding: '8px 14px',
      borderRadius: '8px',
      cursor: 'pointer',
      fontSize: '0.85rem',
      fontWeight: '600',
      transition: '0.2s',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
    },
    noBanks: {
      textAlign: 'center',
      color: '#9CA3AF',
      padding: '30px',
      fontStyle: 'italic',
      background: '#F9FAFB',
      borderRadius: '12px',
      border: '1px dashed #D1D5DB'
    },

    // FORM
    inputGroup: { marginBottom: '20px' },
    input: {
      width: '100%',
      padding: '12px 15px',
      fontSize: '1rem',
      border: '1px solid #D1D5DB',
      borderRadius: '10px',
      outline: 'none',
      background: '#FFFFFF',
      boxSizing: 'border-box',
      transition: 'border 0.2s',
      color: '#111827'
    },
    submitBtn: {
      width: '100%',
      padding: '14px',
      marginTop: '10px',
      background: '#00D09C', // Brand Green
      color: '#064E3B', // Deep Green Text
      border: 'none',
      borderRadius: '12px',
      fontSize: '1.05rem',
      fontWeight: '700',
      cursor: 'pointer',
      transition: 'transform 0.2s, background 0.2s',
      boxShadow: '0 4px 6px -1px rgba(0, 208, 156, 0.2)'
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
          style={{ ...styles.navItem, background: 'rgba(0, 208, 156, 0.15)', color: '#00D09C', fontWeight: '600' }} 
          onClick={() => { navigate('/wallet'); isMobile && setSidebarOpen(false); }}
        >
          <WalletIcon /> <span>My Wallet</span>
        </div>

        <div 
          style={styles.navItem}
          onClick={() => { navigate('/staking'); isMobile && setSidebarOpen(false); }}
          onMouseOver={(e) => { e.currentTarget.style.background = '#1F2937'; e.currentTarget.style.color = '#F3F4F6'; }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9CA3AF'; }}
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
        
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <button style={styles.menuBtn} onClick={() => setSidebarOpen(true)}>
              <MenuIcon />
            </button>
            <h2 style={styles.title}>Manage Accounts</h2>
          </div>
          <button style={styles.backBtn} onClick={() => navigate('/withdraw')}>
            <BackIcon /> Back
          </button>
        </div>

        {/* 1. SAVED BANKS LIST */}
        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>
            <BankIcon /> Saved Bank Accounts
          </h3>
          
          {banks.length === 0 ? (
            <div style={styles.noBanks}>No saved accounts yet. Add one below!</div>
          ) : (
            banks.map((bank) => (
              <div key={bank._id} style={styles.bankItem}>
                <div>
                  <div style={styles.bankDetails}>
                    <strong>{bank.bankName}</strong> — {bank.accountNumber.slice(-4).padStart(bank.accountNumber.length, '•')}
                  </div>
                  <div style={styles.bankSub}>
                    {bank.accountHolder} | {bank.ifsc}
                  </div>
                </div>
                <button 
                  style={styles.deleteBtn} 
                  onClick={() => handleDelete(bank._id)}
                  onMouseOver={(e) => e.currentTarget.style.background = '#FECACA'}
                  onMouseOut={(e) => e.currentTarget.style.background = '#FEE2E2'}
                >
                  <TrashIcon /> Delete
                </button>
              </div>
            ))
          )}
        </div>

        {/* 2. ADD NEW BANK FORM */}
        <div style={styles.card}>
          <h3 style={styles.sectionTitle}>
            <PlusCircleIcon /> Add New Bank Account
          </h3>
          
          <form onSubmit={handleSubmit}>
            <div style={styles.inputGroup}>
              <input 
                type="text" 
                name="accountHolder" 
                placeholder="Account Holder Name" 
                value={formData.accountHolder} 
                onChange={handleChange} 
                required 
                style={styles.input} 
                onFocus={(e) => e.target.style.borderColor = '#00D09C'}
                onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
              />
            </div>

            <div style={styles.inputGroup}>
              <input 
                type="text" 
                name="accountNumber" 
                placeholder="Account Number" 
                value={formData.accountNumber} 
                onChange={handleChange} 
                required 
                style={styles.input} 
                onFocus={(e) => e.target.style.borderColor = '#00D09C'}
                onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px', marginBottom: '20px' }}>
              <input 
                type="text" 
                name="ifsc" 
                placeholder="IFSC Code" 
                value={formData.ifsc} 
                onChange={handleChange} 
                required 
                style={styles.input} 
                onFocus={(e) => e.target.style.borderColor = '#00D09C'}
                onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
              />
              <input 
                type="text" 
                name="bankName" 
                placeholder="Bank Name" 
                value={formData.bankName} 
                onChange={handleChange} 
                required 
                style={styles.input} 
                onFocus={(e) => e.target.style.borderColor = '#00D09C'}
                onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
              />
            </div>

            <div style={styles.inputGroup}>
              <input 
                type="text" 
                name="branch" 
                placeholder="Branch Name" 
                value={formData.branch} 
                onChange={handleChange} 
                required 
                style={styles.input} 
                onFocus={(e) => e.target.style.borderColor = '#00D09C'}
                onBlur={(e) => e.target.style.borderColor = '#D1D5DB'}
              />
            </div>

            <button 
              type="submit" 
              style={styles.submitBtn}
              onMouseOver={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.background = '#00c493';
              }}
              onMouseOut={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.background = '#00D09C';
              }}
            >
              Save Bank Account
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}

export default BankManagement;