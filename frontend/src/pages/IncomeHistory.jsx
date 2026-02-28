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

const EmptyBoxIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="7" width="20" height="14" rx="2" ry="2"></rect>
    <path d="M16 21V5a2 2 0 0 0-2-2h-4a2 2 0 0 0-2 2v16"></path>
  </svg>
);

function IncomeHistory() {
  const navigate = useNavigate();
  const [incomes, setIncomes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [totalEarned, setTotalEarned] = useState(0);

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
      fetchIncome(userData._id);
    }
  }, []);

  const fetchIncome = async (userId) => {
    try {
      // ✅ CHANGED: Removed localhost
      const res = await axios.get(`/api/stake/income/${userId}`);
      setIncomes(res.data);
      
      // Calculate total
      const total = res.data.reduce((acc, curr) => acc + curr.amount, 0);
      setTotalEarned(total);
      
      setLoading(false);
    } catch (err) {
      console.error("Error fetching income");
      setLoading(false);
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

    // TOTAL CARD
    totalCard: {
      background: 'linear-gradient(135deg, #00D09C 0%, #059669 100%)', // Brand Green Gradient
      color: 'white',
      padding: '30px',
      borderRadius: '16px',
      textAlign: 'center',
      marginBottom: '30px',
      boxShadow: '0 10px 25px rgba(0, 208, 156, 0.25)',
      border: '1px solid #059669'
    },
    totalLabel: {
      fontSize: '0.95rem',
      opacity: 0.9,
      marginBottom: '5px',
      textTransform: 'uppercase',
      letterSpacing: '1px',
      fontWeight: '600'
    },
    totalAmount: {
      fontSize: '2.5rem',
      fontWeight: '800'
    },

    // TABLE CARD
    card: {
      background: '#FFFFFF',
      borderRadius: '16px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      border: '1px solid #E5E7EB',
      overflow: 'hidden'
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
      textAlign: 'left',
      padding: '18px',
      background: '#F9FAFB',
      color: '#6B7280',
      fontWeight: '600',
      borderBottom: '1px solid #E5E7EB',
      textTransform: 'uppercase',
      fontSize: '0.8rem',
      letterSpacing: '0.5px'
    },
    td: {
      padding: '18px',
      borderBottom: '1px solid #F3F4F6',
      verticalAlign: 'middle', 
      color: '#111827',
      fontSize: '0.95rem'
    },
    
    // BADGES & TEXT
    badge: {
      background: '#D1FAE5',
      color: '#065F46',
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '0.75rem',
      fontWeight: '700',
      textTransform: 'uppercase',
      letterSpacing: '0.5px'
    },
    sourceText: (type) => ({
      color: type === 'referral' ? '#7C3AED' : '#64748B', // Purple for referral, Gray for Interest
      fontWeight: '600',
      fontSize: '0.9rem'
    }),
    emptyState: {
      padding: '60px',
      textAlign: 'center',
      color: '#9CA3AF',
      fontSize: '1.1rem',
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center'
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
        
        {/* Header */}
        <div style={styles.header}>
          <div style={styles.headerLeft}>
            <button style={styles.menuBtn} onClick={() => setSidebarOpen(true)}>
              <MenuIcon />
            </button>
            <h2 style={styles.title}>Income History</h2>
          </div>
          <button style={styles.backBtn} onClick={() => navigate('/staking')}>
            <BackIcon /> Back
          </button>
        </div>

        {/* Total Earned Summary */}
        <div style={styles.totalCard}>
          <div style={styles.totalLabel}>Total Interest & Rewards</div>
          <div style={styles.totalAmount}>₹ {totalEarned.toLocaleString()}</div>
        </div>

        {/* Table Card */}
        <div style={styles.card}>
          <div style={styles.tableContainer}>
            {loading ? (
              <div style={{padding: '40px', textAlign: 'center', color: '#6B7280'}}>Loading income data...</div>
            ) : incomes.length === 0 ? (
              <div style={styles.emptyState}>
                <EmptyBoxIcon />
                <h3 style={{margin: '15px 0 5px 0'}}>No income received yet.</h3>
                <p style={{fontSize: '0.9rem'}}>Income is credited automatically every month.</p>
              </div>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Amount</th>
                    <th style={styles.th}>Source</th>
                    <th style={styles.th}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {incomes.map((inc) => (
                    <tr key={inc._id}>
                      <td style={styles.td}>
                        <div style={{fontWeight: '500'}}>{new Date(inc.date).toLocaleDateString()}</div>
                        <div style={{fontSize: '0.8rem', color: '#9CA3AF'}}>
                          {new Date(inc.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </td>
                      
                      <td style={{...styles.td, fontWeight: '700', color: '#059669', fontSize: '1.1rem'}}>
                        + ₹ {inc.amount.toLocaleString()}
                      </td>
                      
                      <td style={styles.td}>
                        <span style={styles.sourceText(inc.type)}>
                          {inc.type === 'referral' ? 'Referral Bonus' : 'Monthly ROI'}
                        </span>
                      </td>
                      
                      <td style={styles.td}>
                        <span style={styles.badge}>Received</span>
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
  );
}

export default IncomeHistory;