import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// --- ICONS (SVGs) ---

// 1. Sidebar & Nav Icons
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

// 2. Dashboard Specific Icons
const VerifiedIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#059669" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const HistoryIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#00D09C" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const DepositIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="5" x2="12" y2="19"></line>
    <polyline points="19 12 12 19 5 12"></polyline>
  </svg>
);

const WithdrawIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="19" x2="12" y2="5"></line>
    <polyline points="5 12 12 5 19 12"></polyline>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#D1D5DB" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);


function UserDashboard() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);
  
  const [dashboardData, setDashboardData] = useState({
    balance: 0,
    activeStaked: 0,
    referralEarnings: 0
  });
  const [loading, setLoading] = useState(true);

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

  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (!storedUser) {
      navigate('/login');
    } else {
      const userData = JSON.parse(storedUser);
      setUser(userData);
      fetchAllData(userData._id);
    }
  }, []);

  const fetchAllData = async (userId) => {
    try {
      const walletRes = await axios.get(`/api/wallet/${userId}`);
      const stakeRes = await axios.get(`/api/stake/history/${userId}`);
      const totalActive = stakeRes.data
        .filter(plan => plan.status === 'active')
        .reduce((sum, plan) => sum + plan.planAmount, 0);
      const referralRes = await axios.get(`/api/auth/referrals/${userId}`);

      setDashboardData({
        balance: walletRes.data.balance,
        activeStaked: totalActive,
        referralEarnings: referralRes.data.referralEarnings
      });
      setLoading(false);
    } catch (err) {
      console.error("Error fetching dashboard data", err);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/login');
  };

  // --- STYLES (Responsive GrowwPark Theme) ---
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
    navItemActive: {
      background: 'rgba(0, 208, 156, 0.15)', 
      color: '#00D09C', 
      fontWeight: '600'
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
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: '30px',
    },
    menuBtn: {
      display: isMobile ? 'block' : 'none',
      background: 'none',
      border: 'none',
      fontSize: '1.8rem',
      cursor: 'pointer',
      color: '#111827',
      padding: '0',
      marginRight: '15px'
    },
    welcomeSection: { display: 'flex', alignItems: 'center' },
    welcomeText: { fontSize: isMobile ? '1.5rem' : '2rem', fontWeight: '800', color: '#111827', margin: 0, letterSpacing: '-1px' },
    subText: { color: '#6B7280', fontSize: isMobile ? '0.9rem' : '1rem', marginTop: '5px' },
    statusBadge: {
      display: isMobile ? 'none' : 'flex', 
      alignItems: 'center',
      gap: '5px',
      background: '#D1FAE5',
      padding: '6px 16px',
      borderRadius: '20px',
      color: '#059669',
      fontWeight: '700',
      fontSize: '0.9rem'
    },

    // STATS
    statsRow: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '20px',
      marginBottom: '40px'
    },
    statCard: {
      background: 'white',
      padding: '25px',
      borderRadius: '16px',
      border: '1px solid #E5E7EB',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      display: 'flex',
      flexDirection: 'column',
      position: 'relative',
      overflow: 'hidden'
    },
    statLabel: { color: '#6B7280', fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase', letterSpacing: '0.5px' },
    statValue: { fontSize: '2.2rem', fontWeight: '800', color: '#111827', margin: '10px 0 5px 0' },
    statSub: { fontSize: '0.85rem', color: '#059669', fontWeight: '600' },
    
    // Balance Card
    balanceCard: { background: '#111827', color: 'white' },
    balanceLabel: { color: '#9CA3AF', fontSize: '0.9rem', fontWeight: '600', textTransform: 'uppercase' },
    balanceValue: { fontSize: '2.5rem', fontWeight: '800', color: '#00D09C', margin: '10px 0' },
    actionRow: { display: 'flex', gap: '10px', marginTop: '15px' },
    miniBtn: {
      padding: '10px 16px',
      borderRadius: '8px',
      fontSize: '0.9rem',
      fontWeight: '600',
      cursor: 'pointer',
      border: 'none',
      background: '#374151',
      color: 'white',
      transition: '0.2s',
      flex: 1,
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '8px'
    },
    depositBtn: { background: '#00D09C', color: '#064e3b' },

    sectionTitle: { fontSize: '1.25rem', fontWeight: '700', color: '#111827', marginBottom: '20px' },

    // NAVIGATION GRID
    grid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))',
      gap: '20px',
    },
    navCard: {
      background: 'white',
      padding: '25px',
      borderRadius: '16px',
      border: '1px solid #E5E7EB',
      boxShadow: '0 2px 4px rgba(0,0,0,0.02)',
      cursor: 'pointer',
      transition: 'all 0.3s ease',
      display: 'flex',
      alignItems: 'center',
      gap: '20px'
    },
    navIconBox: {
      width: '50px',
      height: '50px',
      borderRadius: '12px',
      background: '#ECFDF5',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
      color: '#00D09C' // Explicit color for icon
    },
    navText: { display: 'flex', flexDirection: 'column' },
    navTitle: { fontSize: '1.1rem', fontWeight: '700', color: '#111827', margin: 0 },
    navDesc: { fontSize: '0.9rem', color: '#6B7280', margin: '5px 0 0 0' },
    arrow: { marginLeft: 'auto' }
  };

  if (loading || !user) return <div style={{textAlign: 'center', padding: '50px', color: '#6B7280'}}>Loading...</div>;

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
          <div style={styles.welcomeSection}>
            <button style={styles.menuBtn} onClick={() => setSidebarOpen(true)}>☰</button>
            <div>
              <h2 style={styles.welcomeText}>Hello, {user.username}</h2>
              <p style={styles.subText}>Your financial command center.</p>
            </div>
          </div>
          <div style={styles.statusBadge}>
            <VerifiedIcon /> Verified
          </div>
        </div>

        {/* --- STATS OVERVIEW --- */}
        <div style={styles.statsRow}>
          
          {/* 1. MAIN BALANCE CARD */}
          <div style={{...styles.statCard, ...styles.balanceCard}}>
            <div style={styles.balanceLabel}>Total Wallet Balance</div>
            <div style={styles.balanceValue}>₹ {dashboardData.balance.toLocaleString()}</div>
            <div style={styles.actionRow}>
              <button 
                style={{...styles.miniBtn, ...styles.depositBtn}} 
                onClick={() => navigate('/wallet')}
              >
                <DepositIcon /> Deposit
              </button>
              <button 
                style={styles.miniBtn} 
                onClick={() => navigate('/withdraw')}
              >
                <WithdrawIcon /> Withdraw
              </button>
            </div>
          </div>

          {/* 2. ACTIVE STAKES */}
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Active Investments</div>
            <div style={styles.statValue}>₹ {dashboardData.activeStaked.toLocaleString()}</div>
            <div style={styles.statSub}>Grow your wealth ↗</div>
          </div>

          {/* 3. REFERRAL EARNINGS */}
          <div style={styles.statCard}>
            <div style={styles.statLabel}>Referral Earnings</div>
            <div style={styles.statValue}>₹ {dashboardData.referralEarnings.toLocaleString()}</div>
            <div style={styles.statSub}>10% Reward Bonus</div>
          </div>

        </div>

        {/* --- QUICK NAVIGATION --- */}
        <h3 style={styles.sectionTitle}>Quick Access</h3>
        <div style={styles.grid}>
          
          <div 
            style={styles.navCard}
            onClick={() => navigate('/staking')}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={styles.navIconBox}>
              <TrendUpIcon />
            </div>
            <div style={styles.navText}>
              <div style={styles.navTitle}>New Investment</div>
              <div style={styles.navDesc}>Explore high-yield plans</div>
            </div>
            <div style={styles.arrow}><ArrowRightIcon /></div>
          </div>

          <div 
            style={styles.navCard}
            onClick={() => navigate('/referrals')}
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={styles.navIconBox}>
              <UsersIcon />
            </div>
            <div style={styles.navText}>
              <div style={styles.navTitle}>Invite Friends</div>
              <div style={styles.navDesc}>Share code & earn rewards</div>
            </div>
            <div style={styles.arrow}><ArrowRightIcon /></div>
          </div>

          <div 
            style={styles.navCard}
            onClick={() => navigate('/wallet')} 
            onMouseOver={(e) => e.currentTarget.style.transform = 'translateY(-2px)'}
            onMouseOut={(e) => e.currentTarget.style.transform = 'translateY(0)'}
          >
            <div style={styles.navIconBox}>
              <HistoryIcon />
            </div>
            <div style={styles.navText}>
              <div style={styles.navTitle}>History</div>
              <div style={styles.navDesc}>View deposits & payouts</div>
            </div>
            <div style={styles.arrow}><ArrowRightIcon /></div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default UserDashboard;