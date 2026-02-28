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

const FinanceIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="16"></line>
    <line x1="8" y1="12" x2="16" y2="12"></line>
  </svg>
);

const ChartIcon = () => (
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

const SettingsIcon = () => (
  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="3"></circle>
    <path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>
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
const EmptyBoxIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
    <line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);

const StopIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="4.93" y1="4.93" x2="19.07" y2="19.07"></line>
  </svg>
);

const PlayIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="5 3 19 12 5 21 5 3"></polygon>
  </svg>
);

function AdminStaking() {
  const navigate = useNavigate();
  const [investments, setInvestments] = useState([]);
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

  // --- DATA FETCHING ---
  useEffect(() => {
    // 1. Check if Admin is logged in
    const adminData = localStorage.getItem('admin');
    if (!adminData) {
      navigate('/admin-login');
    } else {
      fetchAllInvestments();
    }
  }, []);

  const fetchAllInvestments = async () => {
    try {
      // ✅ CHANGED: Removed localhost
      const res = await axios.get('/api/stake/admin/all');
      setInvestments(res.data);
      setLoading(false);
    } catch (err) {
      console.error("Error fetching investments");
      setLoading(false);
    }
  };

  const toggleStatus = async (id, currentStatus) => {
    const newStatus = currentStatus === 'active' ? 'disabled' : 'active';
    
    const confirm = window.confirm(`Are you sure you want to set this plan to ${newStatus.toUpperCase()}?`);
    if (!confirm) return;

    try {
      // ✅ CHANGED: Removed localhost
      await axios.put('/api/stake/admin/status', {
        investmentId: id,
        status: newStatus
      });
      alert(`Plan updated to ${newStatus}`);
      fetchAllInvestments(); 
    } catch (err) {
      alert("Failed to update status");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin');
    navigate('/admin-login');
  };

  // --- HELPER: Smart Duration Calculator ---
  const calculateTimeLeft = (endDate) => {
    const now = new Date();
    const end = new Date(endDate);
    
    if (now > end) return "Expired";

    const diffTime = Math.abs(end - now);
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)); 

    if (diffDays > 30) {
      const months = Math.floor(diffDays / 30);
      const days = diffDays % 30;
      return `${months}M, ${days}D`;
    }
    return `${diffDays} Days`;
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
    navItemActive: {
      background: 'rgba(0, 208, 156, 0.15)', 
      color: '#00D09C', 
      fontWeight: '600'
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
      display: isMobile ? 'none' : 'block' 
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
      fontSize: '0.95rem',
      minWidth: '850px'
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
      color: '#111827'
    },
    
    // UI ELEMENTS
    badge: (status) => ({
      display: 'inline-block',
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '0.75rem',
      fontWeight: '700',
      textTransform: 'uppercase',
      background: status === 'active' ? '#D1FAE5' : status === 'disabled' ? '#FEE2E2' : '#E5E7EB',
      color: status === 'active' ? '#065F46' : status === 'disabled' ? '#991B1B' : '#374151'
    }),
    timeLeft: {
      color: '#2563EB', // Royal Blue
      fontWeight: '600',
      background: '#EFF6FF',
      padding: '4px 8px',
      borderRadius: '6px',
      fontSize: '0.85rem'
    },
    actionBtn: (status) => ({
      padding: '8px 14px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '0.85rem',
      background: status === 'active' ? '#EF4444' : '#10B981', // Red to Disable, Green to Activate
      color: 'white',
      transition: '0.2s',
      boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
      display: 'flex',
      alignItems: 'center',
      gap: '6px'
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
      
      <div style={styles.overlay} onClick={() => setSidebarOpen(false)}></div>

      {/* --- SIDEBAR --- */}
      <div style={styles.sidebar}>
        <div style={styles.logoContainer}>
          <img src="/growwpark_logo.jpg" alt="Logo" style={styles.logoImage} />
          <span style={styles.logoText}>GrowwPark Admin</span>
        </div>
        
        <div style={styles.navItem} onClick={() => navigate('/admin-dashboard')}>
          <DashboardIcon /> <span>Dashboard</span>
        </div>

        <div style={styles.navItem} onClick={() => navigate('/admin-deposits')}>
          <FinanceIcon /> <span>Manage Finances</span>
        </div>

        <div style={{ ...styles.navItem, ...styles.navItemActive }} onClick={() => isMobile && setSidebarOpen(false)}>
          <ChartIcon /> <span>Staking Control</span>
        </div>

        <div style={styles.navItem} onClick={() => navigate('/admin-users')}>
          <UsersIcon /> <span>Users</span>
        </div>

        <button 
          onClick={handleLogout} 
          style={styles.logoutBtn}
          onMouseOver={(e) => e.currentTarget.style.background = '#374151'}
          onMouseOut={(e) => e.currentTarget.style.background = '#1F2937'}
        >
          <LogoutIcon /> Logout
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
            <h2 style={styles.title}>Staking Control</h2>
          </div>
          <button style={styles.backBtn} onClick={() => navigate('/admin-dashboard')}>
            ← Back
          </button>
        </div>

        {/* Content Card */}
        <div style={styles.card}>
          <div style={styles.tableContainer}>
            {loading ? (
              <div style={{padding: '40px', textAlign: 'center'}}>Loading...</div>
            ) : investments.length === 0 ? (
              <div style={styles.emptyState}>
                <EmptyBoxIcon />
                <div style={{marginTop:'15px'}}>No active investment plans found.</div>
              </div>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>User Details</th>
                    <th style={styles.th}>Plan Amount</th>
                    <th style={styles.th}>Start Date</th>
                    <th style={styles.th}>Time Left</th>
                    <th style={styles.th}>Status</th>
                    <th style={styles.th}>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {investments.map((inv) => (
                    <tr key={inv._id}>
                      
                      <td style={styles.td}>
                        <div style={{fontWeight: '700', color: '#111827'}}>{inv.userId?.username || 'Unknown'}</div>
                        <div style={{fontSize: '0.85rem', color: '#6B7280'}}>{inv.userId?.email}</div>
                      </td>
                      
                      <td style={styles.td}>
                        <span style={{fontWeight: '700', color: '#111827'}}>₹ {inv.planAmount.toLocaleString()}</span>
                      </td>
                      
                      <td style={styles.td}>
                        <div style={{fontSize: '0.9rem', color: '#4B5563'}}>{new Date(inv.startDate).toLocaleDateString()}</div>
                      </td>
                      
                      <td style={styles.td}>
                        <span style={styles.timeLeft}>
                          {calculateTimeLeft(inv.endDate)}
                        </span>
                      </td>

                      <td style={styles.td}>
                        <span style={styles.badge(inv.status)}>{inv.status}</span>
                      </td>
                      
                      <td style={styles.td}>
                        {inv.status !== 'completed' && (
                          <button 
                            style={styles.actionBtn(inv.status)}
                            onClick={() => toggleStatus(inv._id, inv.status)}
                            onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                          >
                            {inv.status === 'active' ? (
                              <>
                                <StopIcon /> Disable
                              </>
                            ) : (
                              <>
                                <PlayIcon /> Activate
                              </>
                            )}
                          </button>
                        )}
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

export default AdminStaking;