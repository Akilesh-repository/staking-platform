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

const DepositIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <polyline points="19 12 12 19 5 12"></polyline>
  </svg>
);

const WithdrawIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="19" x2="12" y2="5"></line>
    <polyline points="5 12 12 5 19 12"></polyline>
  </svg>
);

const BankIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="3" y1="21" x2="21" y2="21"></line>
    <line x1="5" y1="21" x2="5" y2="10"></line>
    <line x1="19" y1="21" x2="19" y2="10"></line>
    <line x1="9" y1="21" x2="9" y2="10"></line>
    <line x1="15" y1="21" x2="15" y2="10"></line>
    <polygon points="2 10 12 3 22 10 2 10"></polygon>
  </svg>
);

const ArrowDownSmall = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <polyline points="19 12 12 19 5 12"></polyline>
  </svg>
);

const ArrowUpSmall = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="19" x2="12" y2="5"></line>
    <polyline points="5 12 12 5 19 12"></polyline>
  </svg>
);

function Wallet() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  const [balance, setBalance] = useState(0);
  const [history, setHistory] = useState([]);
  
  // Deposit Form State
  const [amount, setAmount] = useState('');
  const [transactionId, setTransactionId] = useState('');
  const [showDepositForm, setShowDepositForm] = useState(false);

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
      fetchWalletData(userData._id);
    }
  }, []);

  const fetchWalletData = async (userId) => {
    try {
      // ✅ CHANGED: Removed localhost
      const res = await axios.get(`/api/wallet/${userId}`);
      setBalance(res.data.balance);
      setHistory(res.data.history);
    } catch (err) {
      console.error("Error fetching wallet:", err);
    }
  };

  const handleDeposit = async (e) => {
    e.preventDefault();
    if (!amount || !transactionId) return alert("Please fill all details");

    try {
      // ✅ CHANGED: Removed localhost
      await axios.post('/api/wallet/deposit', {
        userId: user._id,
        amount: Number(amount),
        transactionId
      });
      alert("Deposit Request Submitted! Admin will verify shortly.");
      setAmount('');
      setTransactionId('');
      setShowDepositForm(false); 
      fetchWalletData(user._id); 
    } catch (err) {
      alert("Deposit Failed");
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
      gap: '10px'
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

    // --- ATM CARD STYLE ---
    atmCard: {
      background: 'linear-gradient(135deg, #111827 0%, #1F2937 100%)', // Matte Black Gradient
      borderRadius: '20px',
      padding: '30px',
      color: 'white',
      boxShadow: '0 20px 25px -5px rgba(0, 0, 0, 0.2), 0 10px 10px -5px rgba(0, 0, 0, 0.1)',
      marginBottom: '30px',
      position: 'relative',
      overflow: 'hidden',
      maxWidth: '500px',
      margin: '0 auto 30px auto'
    },
    cardChip: {
      width: '50px',
      height: '35px',
      background: 'linear-gradient(135deg, #fbbf24 0%, #d97706 100%)',
      borderRadius: '6px',
      marginBottom: '20px'
    },
    cardLabel: {
      fontSize: '0.9rem',
      color: '#9CA3AF',
      letterSpacing: '2px',
      textTransform: 'uppercase',
      marginBottom: '5px'
    },
    cardBalance: {
      fontSize: '2.5rem',
      fontWeight: '700',
      color: '#FFFFFF',
      marginBottom: '25px',
      fontFamily: "'Courier New', monospace",
      letterSpacing: '1px'
    },
    cardFooter: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center'
    },
    cardName: {
      fontSize: '1rem',
      fontWeight: '600',
      textTransform: 'uppercase',
      letterSpacing: '1px'
    },
    cardLogo: {
      fontWeight: '800',
      fontSize: '1.2rem',
      fontStyle: 'italic',
      opacity: 0.8
    },

    // ACTION GRID
    actionGrid: {
      display: 'flex',
      gap: '20px',
      marginBottom: '30px',
      maxWidth: '600px',
      margin: '0 auto 30px auto'
    },
    actionBtn: (type) => ({
      flex: 1,
      padding: '16px',
      borderRadius: '12px',
      fontSize: '1rem',
      fontWeight: '600',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '10px',
      transition: 'transform 0.2s, box-shadow 0.2s',
      background: 'white',
      color: type === 'deposit' ? '#065F46' : '#991B1B', 
      border: `2px solid ${type === 'deposit' ? '#D1FAE5' : '#FEE2E2'}`,
      boxShadow: '0 4px 6px rgba(0,0,0,0.02)'
    }),

    // FORM CARD
    formCard: {
      background: '#FFFFFF',
      padding: '30px',
      borderRadius: '16px',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
      marginBottom: '30px',
      border: '1px solid #E5E7EB',
      maxWidth: '600px',
      margin: '0 auto 30px auto'
    },
    
    // --- BANK DETAILS BOX ---
    bankDetailsBox: {
      background: '#F0FDFA', // Light teal/green background
      border: '1px dashed #00D09C',
      borderRadius: '12px',
      padding: '20px',
      marginBottom: '25px',
      fontSize: '0.95rem',
      color: '#334155'
    },
    bankDetailRow: {
      display: 'flex',
      justifyContent: 'space-between',
      marginBottom: '8px',
      flexWrap: 'wrap', 
      gap: '10px'
    },
    detailLabel: {
      fontWeight: '600',
      color: '#475569',
      minWidth: '100px'
    },
    detailValue: {
      fontWeight: '700',
      color: '#111827',
      textAlign: 'right',
      flex: 1
    },

    input: {
      width: '100%',
      padding: '12px 15px',
      borderRadius: '10px',
      border: '1px solid #D1D5DB',
      fontSize: '1rem',
      marginBottom: '15px',
      outline: 'none',
      boxSizing: 'border-box'
    },
    submitBtn: {
      width: '100%',
      padding: '14px',
      background: '#00D09C',
      color: '#064E3B',
      border: 'none',
      borderRadius: '10px',
      fontWeight: '700',
      cursor: 'pointer',
      transition: '0.2s'
    },

    // HISTORY TABLE
    historyTitle: {
      color: '#111827',
      fontSize: '1.4rem',
      fontWeight: '700',
      marginBottom: '20px'
    },
    historyCard: {
      background: '#FFFFFF',
      borderRadius: '16px',
      overflow: 'hidden',
      boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)',
      border: '1px solid #E5E7EB'
    },
    tableContainer: {
      overflowX: 'auto',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      minWidth: '600px'
    },
    th: {
      background: '#F9FAFB',
      padding: '15px',
      textAlign: 'left',
      color: '#6B7280',
      fontWeight: '600',
      borderBottom: '1px solid #E5E7EB',
      fontSize: '0.85rem',
      textTransform: 'uppercase'
    },
    td: {
      padding: '15px',
      borderBottom: '1px solid #F3F4F6',
      color: '#111827',
      verticalAlign: 'middle'
    },
    badge: (status) => ({
      display: 'inline-block',
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '0.75rem',
      fontWeight: '700',
      textTransform: 'uppercase',
      background: (status === 'approved' || status === 'paid') ? '#D1FAE5' : status === 'rejected' ? '#FEE2E2' : '#FFEDD5',
      color: (status === 'approved' || status === 'paid') ? '#065F46' : status === 'rejected' ? '#991B1B' : '#9A3412'
    })
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
            <h2 style={styles.title}>My Wallet</h2>
          </div>
          <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>
            <BackIcon /> Back
          </button>
        </div>

        {/* ATM CARD UI */}
        <div style={styles.atmCard}>
          <div style={styles.cardChip}></div>
          <div style={styles.cardLabel}>Available Balance</div>
          <div style={styles.cardBalance}>₹ {balance.toLocaleString()}</div>
          <div style={styles.cardFooter}>
            <div style={styles.cardName}>{user?.username || 'USER NAME'}</div>
            <div style={styles.cardLogo}>GrowwPark</div>
          </div>
        </div>

        {/* Actions */}
        <div style={styles.actionGrid}>
          <button 
            style={styles.actionBtn('deposit')}
            onClick={() => setShowDepositForm(!showDepositForm)}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <DepositIcon /> Deposit
          </button>

          <button 
            style={styles.actionBtn('withdraw')}
            onClick={() => navigate('/withdraw')}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <WithdrawIcon /> Withdraw
          </button>
        </div>

        {/* Deposit Form (Toggle) */}
        {showDepositForm && (
          <div style={styles.formCard}>
            <h3 style={{margin: '0 0 20px 0', color: '#111827'}}>Deposit Funds</h3>
            
            {/* BANK DETAILS SECTION */}
            <div style={styles.bankDetailsBox}>
              <h4 style={{marginTop: 0, marginBottom: '15px', color: '#065F46', fontSize: '1rem', borderBottom: '1px solid #00D09C', paddingBottom: '8px', display: 'flex', alignItems: 'center', gap: '8px'}}>
                <BankIcon /> Company Bank Details
              </h4>
              <div style={styles.bankDetailRow}>
                <span style={styles.detailLabel}>Account Name:</span>
                <span style={styles.detailValue}>GROWWPARK TECHNOLOGIES PRIVATE LIMITED</span>
              </div>
              <div style={styles.bankDetailRow}>
                <span style={styles.detailLabel}>Account No:</span>
                <span style={styles.detailValue}>44040230542</span>
              </div>
              <div style={styles.bankDetailRow}>
                <span style={styles.detailLabel}>IFSC Code:</span>
                <span style={styles.detailValue}>SBIN0041181</span>
              </div>
              <div style={styles.bankDetailRow}>
                <span style={styles.detailLabel}>Branch:</span>
                <span style={styles.detailValue}>AGRI COMM BRANCH AVALAPALLY</span>
              </div>
              <p style={{fontSize: '0.85rem', color: '#64748b', marginTop: '15px', fontStyle: 'italic', textAlign: 'center'}}>
                * Please transfer funds to the account above, then fill out the form below.
              </p>
            </div>

            <form onSubmit={handleDeposit}>
              <input 
                type="number" 
                placeholder="Enter Amount (₹)" 
                value={amount} 
                onChange={e => setAmount(e.target.value)}
                style={styles.input}
              />
              <input 
                type="text" 
                placeholder="Transaction ID (UTR)" 
                value={transactionId} 
                onChange={e => setTransactionId(e.target.value)}
                style={styles.input}
              />
              <button 
                type="submit" 
                style={styles.submitBtn}
                onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.background = '#00c493'; }}
                onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = '#00D09C'; }}
              >
                Submit Request
              </button>
            </form>
          </div>
        )}

        {/* Transaction History */}
        <div>
          <h3 style={styles.historyTitle}>Recent Activity</h3>
          
          <div style={styles.historyCard}>
            <div style={styles.tableContainer}>
              {history.length === 0 ? (
                <div style={{padding: '30px', textAlign: 'center', color: '#9CA3AF', fontStyle: 'italic'}}>
                  No transactions yet.
                </div>
              ) : (
                <table style={styles.table}>
                  <thead>
                    <tr>
                      <th style={styles.th}>Type</th>
                      <th style={styles.th}>Amount</th>
                      <th style={styles.th}>Status</th>
                      <th style={styles.th}>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {history.map((tx) => (
                      <tr key={tx._id}>
                        <td style={styles.td}>
                          <span style={{ fontWeight: '600', color: tx.type === 'deposit' ? '#065F46' : '#991B1B', display: 'flex', alignItems: 'center', gap: '6px' }}>
                            {tx.type === 'deposit' ? <ArrowDownSmall /> : <ArrowUpSmall />}
                            {tx.type === 'deposit' ? 'Deposit' : 'Withdraw'}
                          </span>
                        </td>
                        <td style={{ ...styles.td, fontWeight: '700' }}>
                          ₹{tx.amount.toLocaleString()}
                        </td>
                        <td style={styles.td}>
                          <span style={styles.badge(tx.status)}>
                            {tx.status}
                          </span>
                        </td>
                        <td style={{ ...styles.td, color: '#6B7280', fontSize: '0.85rem' }}>
                          {new Date(tx.date).toLocaleDateString()}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Wallet;