import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

// --- ICONS (SVGs) ---

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

const AlertIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#EF4444" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"></circle>
    <line x1="12" y1="8" x2="12" y2="12"></line>
    <line x1="12" y1="16" x2="12.01" y2="16"></line>
  </svg>
);

const CheckCircleIcon = () => (
  <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#10B981" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"></path>
    <polyline points="22 4 12 14.01 9 11.01"></polyline>
  </svg>
);

const ArrowRightIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="5" y1="12" x2="19" y2="12"></line>
    <polyline points="12 5 19 12 12 19"></polyline>
  </svg>
);

function AdminDashboard() {
  const navigate = useNavigate();
  const [admin, setAdmin] = useState(null);
  
  // --- DYNAMIC DASHBOARD STATE ---
  const [stats, setStats] = useState({
    totalUsers: 0,
    activePlans: 0,
    totalStaked: 0,
    pendingRequests: 0,
    newUsersThisWeek: 0
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

  // --- 1. FETCH ALL DATA ---
  useEffect(() => {
    const data = localStorage.getItem('admin');
    if (!data) {
      navigate('/admin-login'); 
    } else {
      setAdmin(JSON.parse(data));
      fetchDashboardData();
    }
  }, []);

  const fetchDashboardData = async () => {
    try {
      // ✅ CHANGED: Removed http://localhost:5000 to work on deployed site
      
      // A. Fetch Users
      const usersRes = await axios.get('/api/admin/users/all');
      const allUsers = usersRes.data;
      
      // Calculate new users this week
      const now = new Date();
      const oneWeekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
      const newUsers = allUsers.filter(u => new Date(u.createdAt) > oneWeekAgo).length;

      // B. Fetch Investments
      const stakesRes = await axios.get('/api/stake/admin/all');
      const activeInvestments = stakesRes.data.filter(inv => inv.status === 'active');
      const totalValue = activeInvestments.reduce((sum, inv) => sum + inv.planAmount, 0);

      // C. Fetch Pending Requests
      const walletRes = await axios.get('/api/wallet/admin/pending');

      setStats({
        totalUsers: allUsers.length,
        newUsersThisWeek: newUsers,
        activePlans: activeInvestments.length,
        totalStaked: totalValue,
        pendingRequests: walletRes.data.length
      });
      setLoading(false);

    } catch (err) {
      console.error("Error fetching dashboard stats", err);
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin');
    navigate('/admin-login');
  };

  // --- 2. STYLES (Responsive GrowwPark Premium Theme) ---
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
      marginBottom: '40px',
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
    welcomeText: { 
      fontSize: isMobile ? '1.8rem' : '2.2rem', 
      fontWeight: '800', 
      color: '#111827', 
      margin: '0 0 5px 0', 
      letterSpacing: '-1px' 
    },
    subText: { 
      color: '#6B7280', 
      fontSize: isMobile ? '0.9rem' : '1.1rem' 
    },
    
    // STATS GRID
    statsGrid: {
      display: 'grid',
      gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', 
      gap: '25px',
      marginBottom: '40px'
    },
    statCard: {
      background: '#FFFFFF',
      padding: '25px',
      borderRadius: '16px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      border: '1px solid #E5E7EB',
      borderLeft: '5px solid #00D09C', 
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-between',
      cursor: 'pointer', 
      transition: 'transform 0.2s'
    },
    statNumber: {
      fontSize: '2.5rem',
      fontWeight: 'bold',
      color: '#111827',
      margin: '10px 0'
    },
    statLabel: {
      color: '#6B7280',
      fontSize: '0.9rem',
      textTransform: 'uppercase',
      letterSpacing: '0.5px',
      fontWeight: '600'
    },
    linkText: {
      color: '#00D09C',
      fontSize: '0.9rem',
      fontWeight: '600',
      display: 'flex',
      alignItems: 'center',
      gap: '4px'
    }
  };

  if (loading) return <div style={{padding: '50px', textAlign: 'center'}}>Loading Admin Data...</div>;

  return (
    <div style={styles.wrapper}>
      
      {/* MOBILE OVERLAY */}
      <div style={styles.overlay} onClick={() => setSidebarOpen(false)}></div>

      {/* --- SIDEBAR --- */}
      <div style={styles.sidebar}>
        <div style={styles.logoContainer}>
          <img src="/growwpark_logo.jpg" alt="Logo" style={styles.logoImage} />
          <span style={styles.logoText}>GrowwPark Admin</span>
        </div>
        
        <div style={{ ...styles.navItem, ...styles.navItemActive }} onClick={() => isMobile && setSidebarOpen(false)}>
          <DashboardIcon /> <span>Dashboard</span>
        </div>

        <div 
          style={styles.navItem} 
          onClick={() => { navigate('/admin-deposits'); isMobile && setSidebarOpen(false); }}
          onMouseOver={(e) => { e.currentTarget.style.background = '#1F2937'; e.currentTarget.style.color = '#F3F4F6'; }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9CA3AF'; }}
        >
          <FinanceIcon /> <span>Manage Finances</span>
          {stats.pendingRequests > 0 && (
            <span style={{ marginLeft: 'auto', background: '#EF4444', fontSize: '0.7rem', padding: '2px 8px', borderRadius: '10px', color: 'white', fontWeight: 'bold' }}>
              {stats.pendingRequests}
            </span>
          )}
        </div>

        <div 
          style={styles.navItem} 
          onClick={() => { navigate('/admin-staking'); isMobile && setSidebarOpen(false); }}
          onMouseOver={(e) => { e.currentTarget.style.background = '#1F2937'; e.currentTarget.style.color = '#F3F4F6'; }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9CA3AF'; }}
        >
          <ChartIcon /> <span>Staking Control</span>
        </div>

        <div 
          style={styles.navItem} 
          onClick={() => { navigate('/admin-users'); isMobile && setSidebarOpen(false); }}
          onMouseOver={(e) => { e.currentTarget.style.background = '#1F2937'; e.currentTarget.style.color = '#F3F4F6'; }}
          onMouseOut={(e) => { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = '#9CA3AF'; }}
        >
          <UsersIcon /> <span>Users</span>
        </div>

        <div style={{ ...styles.navItem, opacity: 0.5, cursor: 'not-allowed' }}>
          <SettingsIcon /> <span>Settings</span>
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
        <div style={styles.header}>
          <button style={styles.menuBtn} onClick={() => setSidebarOpen(true)}>
            <MenuIcon />
          </button>
          
          <div>
            <h2 style={styles.welcomeText}>Overview</h2>
            <p style={styles.subText}>Welcome back, {admin?.username}</p>
          </div>
        </div>

        {/* Stats Cards */}
        <div style={styles.statsGrid}>
          
          {/* Card 1: Total Users */}
          <div style={{ ...styles.statCard, borderLeftColor: '#3B82F6' }}>
            <span style={styles.statLabel}>Total Users</span>
            <span style={styles.statNumber}>{stats.totalUsers}</span>
            <span style={{ color: '#10B981', fontSize: '0.9rem', fontWeight: '600' }}>
              +{stats.newUsersThisWeek} this week
            </span>
          </div>

          {/* Card 2: Active Plans */}
          <div style={{ ...styles.statCard, borderLeftColor: '#10B981' }}>
            <span style={styles.statLabel}>Active Investments</span>
            <span style={styles.statNumber}>₹ {stats.totalStaked.toLocaleString()}</span>
            <span style={{ color: '#6B7280', fontSize: '0.9rem' }}>
              {stats.activePlans} Active Plans
            </span>
          </div>

          {/* Card 3: Pending Requests */}
          <div 
            style={{ ...styles.statCard, borderLeftColor: stats.pendingRequests > 0 ? '#EF4444' : '#E5E7EB' }}
            onClick={() => navigate('/admin-deposits')}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <span style={styles.statLabel}>Pending Requests</span>
            <span style={{ ...styles.statNumber, color: stats.pendingRequests > 0 ? '#EF4444' : '#111827' }}>
              {stats.pendingRequests}
            </span>
            <span style={styles.linkText}>
              Review Now <ArrowRightIcon />
            </span>
          </div>

          {/* Card 4: Staking Control */}
          <div 
            style={{ ...styles.statCard, borderLeftColor: '#8B5CF6' }}
            onClick={() => navigate('/admin-staking')}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <span style={styles.statLabel}>Staking Control</span>
            <span style={{ ...styles.statNumber, color: '#111827' }}><SettingsIcon /></span>
            <span style={{ color: '#6B7280', fontSize: '0.9rem' }}>Disable/Enable Plans</span>
          </div>

          {/* Card 5: User Management */}
          <div 
            style={{ ...styles.statCard, borderLeftColor: '#F59E0B' }}
            onClick={() => navigate('/admin-users')}
            onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-3px)'; }}
            onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; }}
          >
            <span style={styles.statLabel}>User Management</span>
            <span style={{ ...styles.statNumber, color: '#111827' }}><UsersIcon /></span>
            <span style={{ color: '#6B7280', fontSize: '0.9rem' }}>Block / Adjust Funds</span>
          </div>

        </div>

        {/* Recent Activity Placeholder */}
        <div style={{ background: '#FFFFFF', padding: '30px', borderRadius: '16px', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)', border: '1px solid #E5E7EB' }}>
          <h3 style={{ marginBottom: '20px', color: '#111827', fontWeight: '700' }}>System Notifications</h3>
          
          {stats.pendingRequests > 0 ? (
            <div style={{display:'flex', alignItems:'center', gap:'10px', color: '#B91C1C'}}>
              <AlertIcon />
              <span>You have {stats.pendingRequests} pending requests to review.</span>
            </div>
          ) : (
            <div style={{display:'flex', alignItems:'center', gap:'10px', color: '#059669'}}>
              <CheckCircleIcon />
              <span>All systems operational. No new alerts.</span>
            </div>
          )}
          
        </div>

      </div>
    </div>
  );
}

export default AdminDashboard;