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
const MoneyIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <line x1="12" y1="1" x2="12" y2="23"></line>
    <path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
  </svg>
);

const LockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"></path>
  </svg>
);

const UnlockIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"></rect>
    <path d="M7 11V7a5 5 0 0 1 9.9-1"></path>
  </svg>
);

function AdminUserManagement() {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  
  // State for "Adjust Balance" Modal
  const [showModal, setShowModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [adjustData, setAdjustData] = useState({ type: 'credit', amount: '', note: '' });

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
    // Check Admin Auth
    const adminData = localStorage.getItem('admin');
    if (!adminData) navigate('/admin-login');
    else fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      // ✅ CHANGED: Removed localhost
      const res = await axios.get('/api/admin/users/all');
      setUsers(res.data);
    } catch (err) {
      console.error("Error fetching users");
    }
  };

  // --- ACTIONS ---
  
  // 1. Block / Unblock User
  const toggleBlock = async (userId, currentStatus) => {
    if(!window.confirm(`Are you sure you want to ${currentStatus ? 'UNBLOCK' : 'BLOCK'} this user?`)) return;
    
    try {
      // ✅ CHANGED: Removed localhost
      await axios.put('/api/admin/users/status', {
        userId,
        isBlocked: !currentStatus
      });
      alert("Status Updated!");
      fetchUsers(); 
    } catch (err) {
      alert("Failed to update status");
    }
  };

  // 2. Open Adjustment Modal
  const openAdjustModal = (user) => {
    setSelectedUser(user);
    setAdjustData({ type: 'credit', amount: '', note: '' });
    setShowModal(true);
  };

  // 3. Submit Balance Adjustment
  const handleAdjustSubmit = async (e) => {
    e.preventDefault();
    try {
      // ✅ CHANGED: Removed localhost
      await axios.post('/api/admin/users/adjust-balance', {
        userId: selectedUser._id,
        ...adjustData
      });
      alert("Balance Updated Successfully!");
      setShowModal(false);
      fetchUsers(); 
    } catch (err) {
      alert("Adjustment Failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin');
    navigate('/admin-login');
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
      display: isMobile ? 'none' : 'block' 
    },

    // CONTENT CARD
    card: {
      background: '#FFFFFF',
      borderRadius: '16px',
      boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)',
      border: '1px solid #E5E7EB',
      overflow: 'hidden',
      padding: '0'
    },
    tableContainer: {
      overflowX: 'auto',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      minWidth: '900px'
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
    
    // BADGES & BUTTONS
    badge: (isBlocked) => ({
      display: 'inline-block',
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '0.75rem',
      fontWeight: '700',
      textTransform: 'uppercase',
      background: isBlocked ? '#FEE2E2' : '#D1FAE5',
      color: isBlocked ? '#991B1B' : '#065F46'
    }),
    moneyBtn: { 
      padding: '6px 12px', marginRight: '8px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem',
      background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #DBEAFE', transition: '0.2s', display: 'flex', alignItems: 'center', gap: '6px'
    },
    blockBtn: { 
      padding: '6px 12px', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600', fontSize: '0.85rem',
      background: '#FFF1F2', color: '#BE123C', border: '1px solid #FFE4E6', transition: '0.2s', display: 'flex', alignItems: 'center', gap: '6px'
    },

    // MODAL
    modalOverlay: {
      position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', 
      background: 'rgba(0,0,0,0.6)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000
    },
    modal: {
      background: 'white', padding: '30px', borderRadius: '16px', width: '90%', maxWidth: '400px', 
      boxShadow: '0 20px 50px rgba(0,0,0,0.2)'
    },
    modalTitle: { margin: '0 0 10px 0', fontSize: '1.4rem', fontWeight: '700', color: '#111827' },
    input: { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #D1D5DB', boxSizing: 'border-box' },
    select: { width: '100%', padding: '12px', marginBottom: '15px', borderRadius: '8px', border: '1px solid #D1D5DB', background: 'white', boxSizing: 'border-box' },
    submitBtn: { 
      width: '100%', padding: '14px', background: '#00D09C', color: '#064E3B', border: 'none', 
      borderRadius: '8px', fontWeight: '700', cursor: 'pointer', transition: '0.2s'
    },
    cancelBtn: {
      width: '100%', padding: '14px', background: '#F3F4F6', color: '#4B5563', border: 'none', 
      borderRadius: '8px', fontWeight: '600', cursor: 'pointer', marginTop: '10px'
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
          <span style={styles.logoText}>GrowwPark Admin</span>
        </div>
        
        <div style={styles.navItem} onClick={() => navigate('/admin-dashboard')}>
          <DashboardIcon /> <span>Dashboard</span>
        </div>
        <div style={styles.navItem} onClick={() => navigate('/admin-deposits')}>
          <FinanceIcon /> <span>Manage Finances</span>
        </div>
        <div style={styles.navItem} onClick={() => navigate('/admin-staking')}>
          <ChartIcon /> <span>Staking Control</span>
        </div>
        <div style={{ ...styles.navItem, ...styles.navItemActive }} onClick={() => isMobile && setSidebarOpen(false)}>
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
            <h2 style={styles.title}>User Management</h2>
          </div>
          <button style={styles.backBtn} onClick={() => navigate('/admin-dashboard')}>
            ← Back
          </button>
        </div>

        {/* Content Card */}
        <div style={styles.card}>
          <div style={styles.tableContainer}>
            <table style={styles.table}>
              <thead>
                <tr>
                  <th style={styles.th}>User Details</th>
                  <th style={styles.th}>Wallet Balance</th>
                  <th style={styles.th}>Status</th>
                  <th style={styles.th}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map(u => (
                  <tr key={u._id}>
                    <td style={styles.td}>
                      <div style={{fontWeight: '700', color: '#111827'}}>{u.username}</div>
                      <div style={{fontSize: '0.85rem', color: '#6B7280'}}>{u.email}</div>
                    </td>
                    <td style={{...styles.td, fontWeight: '700', color: '#00D09C'}}>
                      ₹ {u.walletBalance.toLocaleString()}
                    </td>
                    <td style={styles.td}>
                      <span style={styles.badge(u.isBlocked)}>
                        {u.isBlocked ? 'BLOCKED' : 'ACTIVE'}
                      </span>
                    </td>
                    <td style={styles.td}>
                      <div style={{display:'flex'}}>
                        <button 
                          style={styles.moneyBtn}
                          onClick={() => openAdjustModal(u)}
                          onMouseOver={(e) => e.currentTarget.style.background = '#DBEAFE'}
                          onMouseOut={(e) => e.currentTarget.style.background = '#EFF6FF'}
                        >
                          <MoneyIcon /> Funds
                        </button>
                        <button 
                          style={styles.blockBtn}
                          onClick={() => toggleBlock(u._id, u.isBlocked)}
                          onMouseOver={(e) => e.currentTarget.style.background = '#FFE4E6'}
                          onMouseOut={(e) => e.currentTarget.style.background = '#FFF1F2'}
                        >
                          {u.isBlocked ? <><UnlockIcon /> Unblock</> : <><LockIcon /> Block</>}
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* --- ADJUST BALANCE MODAL --- */}
      {showModal && selectedUser && (
        <div style={styles.modalOverlay}>
          <div style={styles.modal}>
            <h3 style={styles.modalTitle}>Adjust Balance</h3>
            <p style={{color: '#6B7280', fontSize: '0.9rem', marginBottom: '20px'}}>
              User: <strong>{selectedUser.username}</strong> <br/>
              Current: ₹ {selectedUser.walletBalance.toLocaleString()}
            </p>
            
            <form onSubmit={handleAdjustSubmit}>
              <label style={{display:'block', marginBottom:'5px', fontWeight:'600', color:'#374151', fontSize:'0.9rem'}}>Action Type</label>
              <select 
                style={styles.select} 
                value={adjustData.type}
                onChange={e => setAdjustData({...adjustData, type: e.target.value})}
              >
                <option value="credit">➕ Add Money (Credit)</option>
                <option value="debit">➖ Remove Money (Debit)</option>
              </select>

              <label style={{display:'block', marginBottom:'5px', fontWeight:'600', color:'#374151', fontSize:'0.9rem'}}>Amount (₹)</label>
              <input 
                type="number" 
                style={styles.input} 
                required 
                value={adjustData.amount}
                onChange={e => setAdjustData({...adjustData, amount: e.target.value})}
                placeholder="0.00"
              />

              <label style={{display:'block', marginBottom:'5px', fontWeight:'600', color:'#374151', fontSize:'0.9rem'}}>Note / Reason</label>
              <input 
                type="text" 
                placeholder="e.g., Bonus, Correction..." 
                style={styles.input} 
                required 
                value={adjustData.note}
                onChange={e => setAdjustData({...adjustData, note: e.target.value})}
              />

              <button type="submit" style={styles.submitBtn}>Confirm Adjustment</button>
              <button type="button" onClick={() => setShowModal(false)} style={styles.cancelBtn}>Cancel</button>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}

export default AdminUserManagement;