import { useState, useEffect } from 'react';
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
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"></polygon>
  </svg>
);

const FileTextIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
    <path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"></path>
    <polyline points="14 2 14 8 20 8"></polyline>
    <line x1="16" y1="13" x2="8" y2="13"></line>
    <line x1="16" y1="17" x2="8" y2="17"></line>
    <polyline points="10 9 9 9 8 9"></polyline>
  </svg>
);

const DollarIcon = () => (
  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
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

function StakingDashboard() {
  const navigate = useNavigate();

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
      transition: '0.2s'
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
      top: '10px', // ✅ FIXED: Pushed up slightly
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

    // DASHBOARD CARD
    card: {
      width: '100%',
      maxWidth: '600px',
      background: '#FFFFFF',
      padding: '40px',
      borderRadius: '20px',
      boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1)',
      border: '1px solid #E5E7EB',
      marginTop: isMobile ? '60px' : '20px',
      textAlign: 'center'
    },
    icon: {
      marginBottom: '15px',
      width: '80px',
      height: '80px',
      borderRadius: '50%',
      margin: '0 auto',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      overflow: 'hidden' // Ensures image stays circular
    },
    // ✅ NEW: Image Style for the center icon
    centerImage: {
      width: '100%',
      height: '100%',
      objectFit: 'contain'
    },
    title: {
      color: '#111827',
      fontSize: '2rem',
      fontWeight: '800',
      marginBottom: '10px',
      marginTop: 0,
      letterSpacing: '-0.5px'
    },
    subtitle: {
      color: '#6B7280',
      marginBottom: '40px',
      fontSize: '1rem'
    },
    
    // MENU BUTTONS GRID
    buttonGrid: {
      display: 'grid',
      gridTemplateColumns: isMobile ? '1fr' : '1fr', // Stack on mobile
      gap: '20px'
    },
    menuBtnCard: {
      padding: '20px',
      fontSize: '1.1rem',
      fontWeight: '600',
      border: 'none',
      borderRadius: '12px',
      cursor: 'pointer',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '15px',
      transition: 'all 0.2s',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      width: '100%'
    },
    
    // Button Variants
    btnPrimary: {
      background: '#00D09C', // Brand Green
      color: '#064E3B', // Deep Green Text
      border: '1px solid #00D09C'
    },
    btnSecondary: {
      background: '#FFFFFF',
      color: '#111827',
      border: '1px solid #E5E7EB'
    },
    
    backBtn: {
      marginTop: '30px',
      background: 'transparent',
      border: 'none',
      color: '#6B7280',
      cursor: 'pointer',
      textDecoration: 'none',
      fontWeight: '600',
      fontSize: '0.9rem',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: '6px',
      width: '100%'
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
          <div style={styles.icon}>
            {/* ✅ FIXED: Using Logo Image instead of Icon */}
            <img src="/growwpark_logo.jpg" alt="Staking" style={styles.centerImage} />
          </div>
          <h2 style={styles.title}>Staking Hub</h2>
          <p style={styles.subtitle}>Manage your investments and track income.</p>

          <div style={styles.buttonGrid}>
            
            {/* 1. New Stake */}
            <button 
              style={{ ...styles.menuBtnCard, ...styles.btnPrimary }}
              onClick={() => navigate('/staking/create')}
              onMouseOver={(e) => { e.currentTarget.style.transform = 'translateY(-2px)'; e.currentTarget.style.background = '#00c493'; }}
              onMouseOut={(e) => { e.currentTarget.style.transform = 'translateY(0)'; e.currentTarget.style.background = '#00D09C'; }}
            >
              <BoltIcon /> Start New Investment
            </button>

            {/* 2. Stake History */}
            <button 
              style={{ ...styles.menuBtnCard, ...styles.btnSecondary }}
              onClick={() => navigate('/staking/history')} 
              onMouseOver={(e) => { e.currentTarget.style.borderColor = '#00D09C'; e.currentTarget.style.background = '#F9FAFB'; }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.background = '#FFFFFF'; }}
            >
              <FileTextIcon /> Investment History
            </button>

            {/* 3. Monthly Income History */}
            <button 
              style={{ ...styles.menuBtnCard, ...styles.btnSecondary }}
              onClick={() => navigate('/staking/income')}
              onMouseOver={(e) => { e.currentTarget.style.borderColor = '#00D09C'; e.currentTarget.style.background = '#F9FAFB'; }}
              onMouseOut={(e) => { e.currentTarget.style.borderColor = '#E5E7EB'; e.currentTarget.style.background = '#FFFFFF'; }}
            >
              <DollarIcon /> Income History
            </button>

          </div>

          <button onClick={() => navigate('/dashboard')} style={styles.backBtn}>
            <BackIcon /> Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
}

export default StakingDashboard;