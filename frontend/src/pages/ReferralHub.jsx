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
const CopyIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="9" y="9" width="13" height="13" rx="2" ry="2"></rect>
    <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"></path>
  </svg>
);

const MoneyIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

const BackIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="19" y1="12" x2="5" y2="12"></line>
    <polyline points="12 19 5 12 12 5"></polyline>
  </svg>
);

function ReferralHub() {
  const navigate = useNavigate();
  const [data, setData] = useState({
    referralCode: 'Loading...',
    referralEarnings: 0,
    totalReferred: 0,
    referredUsers: [],
    earningsHistory: []
  });

  const [activeTab, setActiveTab] = useState('users'); // 'users' or 'earnings'

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
      fetchReferralStats(userData._id);
    }
  }, []);

  const fetchReferralStats = async (userId) => {
    try {
      // ✅ CHANGED: Removed localhost
      const res = await axios.get(`/api/auth/referrals/${userId}`);
      setData(res.data);
    } catch (err) {
      console.error("Error fetching stats");
    }
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(data.referralCode);
    alert("Referral Code Copied!");
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

    // CODE SECTION
    codeCard: { 
      background: '#FFFFFF', 
      padding: '30px', 
      borderRadius: '16px', 
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', 
      border: '1px solid #E5E7EB', 
      textAlign: 'center', 
      marginBottom: '30px' 
    },
    codeLabel: { color: '#6B7280', fontSize: '0.95rem', fontWeight: '500', marginBottom: '10px' },
    codeBox: { 
      fontSize: '2rem', 
      fontWeight: '800', 
      color: '#111827', 
      letterSpacing: '3px', 
      background: '#F9FAFB', 
      padding: '12px 20px', 
      borderRadius: '10px', 
      border: '2px dashed #D1D5DB', 
      display: 'inline-block', 
      minWidth: '200px',
      marginBottom: '15px'
    },
    copyBtn: { 
      padding: '8px 16px', 
      background: '#00D09C', 
      color: '#064E3B', 
      border: 'none', 
      borderRadius: '8px', 
      fontWeight: '700', 
      cursor: 'pointer', 
      marginLeft: '10px',
      fontSize: '0.9rem',
      transition: '0.2s',
      display: 'inline-flex',
      alignItems: 'center',
      gap: '6px'
    },

    // STATS GRID
    statsGrid: { 
      display: 'grid', 
      gridTemplateColumns: isMobile ? '1fr' : '1fr 1fr', 
      gap: '20px', 
      marginBottom: '30px' 
    },
    statCard: { 
      background: '#FFFFFF', 
      padding: '25px', 
      borderRadius: '16px', 
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', 
      border: '1px solid #E5E7EB', 
      textAlign: 'center' 
    },
    statLabel: { color: '#6B7280', fontSize: '0.85rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' },
    statNumber: { fontSize: '2rem', fontWeight: '800', color: '#111827', margin: '10px 0 0 0' },

    // TABS
    tabContainer: { 
      display: 'flex', 
      gap: '10px', 
      marginBottom: '20px',
      background: '#E5E7EB',
      padding: '5px',
      borderRadius: '12px',
      width: isMobile ? '100%' : 'fit-content'
    },
    tabBtn: (isActive) => ({
      flex: isMobile ? 1 : 'none', 
      padding: '10px 20px', 
      borderRadius: '8px', 
      border: 'none', 
      cursor: 'pointer', 
      fontWeight: '600', 
      fontSize: '0.95rem',
      background: isActive ? '#FFFFFF' : 'transparent',
      color: isActive ? '#111827' : '#6B7280',
      boxShadow: isActive ? '0 2px 4px rgba(0,0,0,0.1)' : 'none',
      transition: 'all 0.2s',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    }),

    // LIST
    listContainer: { 
      background: '#FFFFFF', 
      borderRadius: '16px', 
      padding: '20px', 
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', 
      border: '1px solid #E5E7EB' 
    },
    listHeader: { marginTop: 0, color: '#111827', fontSize: '1.2rem', fontWeight: '700', borderBottom: '1px solid #F3F4F6', paddingBottom: '15px', marginBottom: '15px' },
    listItem: { 
      display: 'flex', 
      justifyContent: 'space-between', 
      padding: '15px 0', 
      borderBottom: '1px solid #F3F4F6',
      alignItems: 'center'
    },
    noData: { 
      textAlign: 'center', 
      padding: '40px', 
      color: '#9CA3AF', 
      fontStyle: 'italic',
      background: '#F9FAFB', 
      borderRadius: '12px', 
      border: '1px dashed #D1D5DB' 
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
          style={styles.navItem} 
          onClick={() => { navigate('/staking'); isMobile && setSidebarOpen(false); }}
          onMouseOver={(e) => { e.currentTarget.style.background = '#1F2937'; e.currentTarget.style.color = '#F3F4F6'; }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9CA3AF'; }}
        >
          <TrendUpIcon /> <span>Staking Plans</span>
        </div>

        <div 
          style={{ ...styles.navItem, background: 'rgba(0, 208, 156, 0.15)', color: '#00D09C', fontWeight: '600' }} 
          onClick={() => { navigate('/referrals'); isMobile && setSidebarOpen(false); }}
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
            <h2 style={styles.title}>Referral Hub</h2>
          </div>
          <button style={styles.backBtn} onClick={() => navigate('/dashboard')}>
            <BackIcon /> Back
          </button>
        </div>

        {/* Code & Summary */}
        <div style={styles.codeCard}>
          <div style={styles.codeLabel}>Your Unique Referral Code</div>
          <div>
            <span style={styles.codeBox}>{data.referralCode}</span>
          </div>
          <button style={styles.copyBtn} onClick={copyToClipboard}>
            <CopyIcon /> Copy
          </button>
        </div>

        <div style={styles.statsGrid}>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Total Earnings</div>
            <div style={{...styles.statNumber, color: '#059669'}}>₹ {data.referralEarnings.toLocaleString()}</div>
          </div>
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Friends Invited</div>
            <div style={styles.statNumber}>{data.totalReferred}</div>
          </div>
        </div>

        {/* Detailed History Tabs */}
        <div style={styles.tabContainer}>
          <button style={styles.tabBtn(activeTab === 'users')} onClick={() => setActiveTab('users')}>
            <UsersIcon /> My Network
          </button>
          <button style={styles.tabBtn(activeTab === 'earnings')} onClick={() => setActiveTab('earnings')}>
            <MoneyIcon /> Earnings History
          </button>
        </div>

        {/* Content Area */}
        <div style={styles.listContainer}>
          
          {/* TAB 1: REFERRED USERS */}
          {activeTab === 'users' && (
            <div>
              <h3 style={styles.listHeader}>Referred Users</h3>
              {data.referredUsers.length === 0 ? (
                <div style={styles.noData}>No referrals yet. Share your code!</div>
              ) : (
                data.referredUsers.map((u, index) => (
                  <div key={index} style={styles.listItem}>
                    <div>
                      <div style={{fontWeight: '700', color: '#111827'}}>{u.username}</div>
                      <div style={{fontSize: '0.85rem', color: '#6B7280'}}>Joined: {new Date(u.createdAt).toLocaleDateString()}</div>
                    </div>
                    <div>
                      <span style={{
                        padding: '4px 10px', borderRadius: '15px', fontSize: '0.75rem', fontWeight: '700',
                        background: '#D1FAE5', color: '#065F46', textTransform: 'uppercase'
                      }}>
                        Verified
                      </span>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

          {/* TAB 2: EARNINGS HISTORY */}
          {activeTab === 'earnings' && (
            <div>
              <h3 style={styles.listHeader}>Bonus History</h3>
              {data.earningsHistory.length === 0 ? (
                <div style={styles.noData}>No earnings yet.</div>
              ) : (
                data.earningsHistory.map((tx, index) => (
                  <div key={index} style={styles.listItem}>
                    <div>
                      <div style={{fontWeight: '700', color: '#059669'}}>+ ₹ {tx.amount.toLocaleString()}</div>
                      <div style={{fontSize: '0.85rem', color: '#6B7280'}}>{tx.paymentDetails?.note || 'Referral Bonus'}</div>
                    </div>
                    <div style={{fontSize: '0.9rem', color: '#9CA3AF', fontWeight: '500'}}>
                      {new Date(tx.date).toLocaleDateString()}
                    </div>
                  </div>
                ))
              )}
            </div>
          )}

        </div>

      </div>
    </div>
  );
}

export default ReferralHub;