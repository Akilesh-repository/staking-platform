import { useEffect, useState } from 'react';
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
const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

function Withdraw() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  
  // New State for Multi-Bank Support
  const [savedBanks, setSavedBanks] = useState([]); 
  const [selectedBankId, setSelectedBankId] = useState('');

  // Form State
  const [amount, setAmount] = useState('');
  const [bankDetails, setBankDetails] = useState({
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
      fetchBalance(userData._id);
      fetchSavedBanks(userData._id); 
    }
  }, []);

  const fetchBalance = async (userId) => {
    try {
      const res = await axios.get(`/api/wallet/${userId}`);
      setBalance(res.data.balance);
    } catch (err) {
      console.error("Error fetching balance");
    }
  };

  const fetchSavedBanks = async (userId) => {
    try {
      const res = await axios.get(`/api/bank/${userId}`);
      setSavedBanks(res.data); 
    } catch (err) {
      console.log("No saved banks found.");
    }
  };

  const handleBankSelect = (e) => {
    const bankId = e.target.value;
    setSelectedBankId(bankId);

    if (bankId === "") {
      setBankDetails({
        accountHolder: '', accountNumber: '', ifsc: '', bankName: '', branch: ''
      });
    } else {
      const selectedBank = savedBanks.find(b => b._id === bankId);
      if (selectedBank) {
        setBankDetails({
          accountHolder: selectedBank.accountHolder,
          accountNumber: selectedBank.accountNumber,
          ifsc: selectedBank.ifsc,
          bankName: selectedBank.bankName,
          branch: selectedBank.branch
        });
      }
    }
  };

  const handleChange = (e) => {
    setBankDetails({ ...bankDetails, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (Number(amount) > balance) return alert("Insufficient Balance!");
    if (Number(amount) <= 0) return alert("Enter a valid amount");

    try {
      await axios.post('/api/wallet/withdraw', {
        userId: user._id,
        amount: Number(amount), 
        bankDetails
      });

      alert("Withdrawal Request Submitted! Funds Locked.");
      navigate('/wallet'); 

    } catch (err) {
      alert(err.response?.data?.message || "Withdrawal Failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  // --- CALCULATE TDS ---
  const tdsAmount = amount ? Number(amount) * 0.01 : 0;
  const netPayable = amount ? Number(amount) - tdsAmount : 0;

  // --- HELPER TO TRUNCATE TEXT ---
  const truncateText = (str, length = 20) => {
    if (!str) return '';
    return str.length > length ? str.substring(0, length) + '...' : str;
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
      padding: isMobile ? '20px 15px' : '40px 60px', 
      width: '100%',
      transition: 'margin-left 0.3s ease-in-out',
      boxSizing: 'border-box'
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

    // FORM CARD
    card: {
      width: '100%',
      maxWidth: '600px',
      background: '#FFFFFF',
      padding: isMobile ? '25px' : '40px', 
      borderRadius: '20px',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      border: '1px solid #E5E7EB',
      marginTop: isMobile ? '20px' : '20px',
      margin: '0 auto',
      boxSizing: 'border-box'
    },
    
    // BALANCE DISPLAY
    balanceBox: {
      background: '#F0FDF4', // Light green
      color: '#059669', // Darker green
      padding: '16px',
      borderRadius: '12px',
      textAlign: 'center',
      fontWeight: '700',
      marginBottom: '25px',
      border: '1px dashed #BBF7D0',
      fontSize: '1.1rem'
    },

    // FORM ELEMENTS
    inputGroup: { 
      marginBottom: '20px',
      width: '100%' 
    },
    label: { display: 'block', marginBottom: '8px', color: '#374151', fontWeight: '600', fontSize: '0.9rem' },
    input: {
      width: '100%',
      padding: '12px 15px',
      fontSize: '1rem',
      borderRadius: '10px',
      border: '1px solid #D1D5DB',
      outline: 'none',
      background: '#FFFFFF',
      boxSizing: 'border-box'
    },
    
    // --- UPDATED SELECT STYLE ---
    select: {
      width: '100%',
      maxWidth: '100%', 
      display: 'block',
      padding: '12px',
      border: '2px solid #00D09C',
      borderRadius: '10px',
      background: '#F0FDFA',
      color: '#064E3B',
      fontWeight: '600',
      outline: 'none',
      cursor: 'pointer',
      marginBottom: '10px',
      boxSizing: 'border-box', // Crucial for mobile sizing
      fontSize: isMobile ? '0.85rem' : '1rem', 
      whiteSpace: 'nowrap',
      overflow: 'hidden',
      textOverflow: 'ellipsis'
    },

    manageLink: {
      display: 'block',
      textAlign: 'right',
      color: '#00D09C',
      fontSize: '0.9rem',
      textDecoration: 'none',
      cursor: 'pointer',
      fontWeight: '600',
      marginTop: '5px'
    },
    sectionTitle: {
      fontSize: '1.1rem',
      color: '#111827',
      marginBottom: '15px',
      borderBottom: '1px solid #F3F4F6',
      paddingBottom: '8px',
      fontWeight: '700',
      marginTop: '25px'
    },

    // SUMMARY BOX
    summaryBox: {
      background: '#FFFBEB',
      border: '1px solid #FEF3C7',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '25px'
    },
    summaryRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '10px',
      fontSize: '0.95rem',
      color: '#4B5563'
    },
    totalRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginTop: '15px',
      paddingTop: '15px',
      borderTop: '1px dashed #D1D5DB',
      fontWeight: '800',
      fontSize: '1.1rem',
      color: '#111827'
    },

    // SUBMIT BUTTON
    submitBtn: {
      width: '100%',
      padding: '16px',
      marginTop: '20px',
      background: '#EF4444', // Red for Withdraw
      color: 'white',
      border: 'none',
      borderRadius: '12px',
      fontSize: '1.1rem',
      fontWeight: '700',
      cursor: 'pointer',
      boxShadow: '0 4px 6px -1px rgba(239, 68, 68, 0.2)',
      transition: 'transform 0.2s',
      boxSizing: 'border-box'
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
        
        <div style={{ ...styles.navItem, ...styles.navItemActive }} onClick={() => isMobile && setSidebarOpen(false)}>
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
            <h2 style={styles.title}>Withdraw Funds</h2>
          </div>
          <button style={styles.backBtn} onClick={() => navigate('/wallet')}>
            <BackIcon /> Back
          </button>
        </div>

        <div style={styles.card}>
          <div style={styles.balanceBox}>
            Available Balance: ₹ {balance.toLocaleString()}
          </div>

          {/* Bank Selection */}
          <div style={styles.inputGroup}>
            <label style={styles.label}>Select Bank Account:</label>
            <select style={styles.select} value={selectedBankId} onChange={handleBankSelect}>
              <option value="">-- Select a Bank --</option>
              {savedBanks.map((bank) => (
                <option key={bank._id} value={bank._id}>
                  {/* Truncate text to prevent mobile overflow */}
                  {truncateText(`${bank.bankName} - ${bank.accountNumber}`, 30)}
                </option>
              ))}
            </select>
            <div style={styles.manageLink} onClick={() => navigate('/bank-details')}>
              + Add / Manage Accounts
            </div>
          </div>

          <form onSubmit={handleSubmit}>
            
            <div style={styles.inputGroup}>
              <label style={styles.label}>Amount to Withdraw (₹)</label>
              <input 
                type="number" 
                value={amount} 
                onChange={(e) => setAmount(e.target.value)} 
                required 
                style={styles.input}
                placeholder="e.g. 5000"
              />
            </div>

            {/* TDS Summary */}
            {amount > 0 && (
              <div style={styles.summaryBox}>
                <div style={styles.summaryRow}>
                  <span>Requested Amount:</span>
                  <span style={{fontWeight:'600'}}>₹ {Number(amount).toLocaleString()}</span>
                </div>
                <div style={{...styles.summaryRow, color: '#EF4444'}}>
                  <span>Less TDS (1%):</span>
                  <span>- ₹ {tdsAmount.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div style={styles.totalRow}>
                  <span>Net Receivable:</span>
                  <span style={{color: '#059669'}}>₹ {netPayable.toLocaleString(undefined, { minimumFractionDigits: 2 })}</span>
                </div>
                <div style={{fontSize: '0.8rem', color: '#9CA3AF', marginTop: '10px', textAlign: 'right', fontStyle: 'italic'}}>
                  *Credit timeline: 24-48 hours after approval
                </div>
              </div>
            )}

            {/* Manual Bank Details */}
            <h3 style={styles.sectionTitle}>Confirm Account Details</h3>
            
            <div style={{ display: 'grid', gap: '15px' }}>
              <input type="text" name="accountHolder" placeholder="Account Holder Name" value={bankDetails.accountHolder} onChange={handleChange} required style={styles.input} />
              <input type="text" name="accountNumber" placeholder="Account Number" value={bankDetails.accountNumber} onChange={handleChange} required style={styles.input} />
              {/* Stacked Layout on Mobile */}
              <div style={{ display: 'grid', gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', gap: '15px' }}>
                <input type="text" name="ifsc" placeholder="IFSC Code" value={bankDetails.ifsc} onChange={handleChange} required style={styles.input} />
                <input type="text" name="bankName" placeholder="Bank Name" value={bankDetails.bankName} onChange={handleChange} required style={styles.input} />
              </div>
              <input type="text" name="branch" placeholder="Branch Name" value={bankDetails.branch} onChange={handleChange} required style={styles.input} />
            </div>

            <button 
              type="submit" 
              style={styles.submitBtn}
              onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
              onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
            >
              Confirm Withdrawal
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}

export default Withdraw;