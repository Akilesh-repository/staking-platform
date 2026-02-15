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

const EmptyBoxIcon = () => (
  <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#9CA3AF" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round">
    <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"></path>
    <polyline points="3.27 6.96 12 12.01 20.73 6.96"></polyline>
    <line x1="12" y1="22.08" x2="12" y2="12"></line>
  </svg>
);

const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"></polyline>
  </svg>
);

const CrossIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round">
    <line x1="18" y1="6" x2="6" y2="18"></line>
    <line x1="6" y1="6" x2="18" y2="18"></line>
  </svg>
);

function AdminDepositRequest() {
  const navigate = useNavigate();
  const [requests, setRequests] = useState([]);
  const [activeTab, setActiveTab] = useState('deposit'); // 'deposit' or 'withdraw'
  
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
    fetchRequests();
  }, []);

  const fetchRequests = async () => {
    try {
      const res = await axios.get('http://localhost:5000/api/wallet/admin/pending');
      setRequests(res.data);
    } catch (err) {
      console.error("Error fetching requests:", err);
    }
  };

  const handleAction = async (transactionId, type, action) => {
    const finalAction = (type === 'withdraw' && action === 'approve') ? 'paid' : action;
    try {
      const res = await axios.post('http://localhost:5000/api/wallet/admin/handle', {
        transactionId,
        action: finalAction 
      });
      alert(res.data.message);
      fetchRequests();
    } catch (err) {
      alert("Action Failed");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('admin');
    navigate('/admin-login');
  };

  // --- FILTER LOGIC ---
  const filteredRequests = requests.filter(req => req.type === activeTab);
  
  // Counts for tabs
  const depositCount = requests.filter(r => r.type === 'deposit').length;
  const withdrawCount = requests.filter(r => r.type === 'withdraw').length;

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

    // --- NEW: TAB SWITCHER STYLES ---
    tabContainer: {
      display: 'flex',
      gap: '15px',
      marginBottom: '25px',
      background: '#E5E7EB',
      padding: '5px',
      borderRadius: '12px',
      width: 'fit-content'
    },
    tabBtn: (isActive) => ({
      padding: '10px 25px',
      borderRadius: '8px',
      border: 'none',
      cursor: 'pointer',
      fontWeight: '600',
      fontSize: '0.95rem',
      display: 'flex',
      alignItems: 'center',
      gap: '8px',
      transition: 'all 0.3s ease',
      background: isActive ? '#FFFFFF' : 'transparent',
      color: isActive ? '#111827' : '#6B7280',
      boxShadow: isActive ? '0 2px 4px rgba(0,0,0,0.1)' : 'none'
    }),
    badge: (count, isActive) => ({
      background: isActive ? '#00D09C' : '#D1D5DB',
      color: isActive ? '#064E3B' : '#4B5563',
      fontSize: '0.75rem',
      padding: '2px 8px',
      borderRadius: '10px',
      fontWeight: '700'
    }),

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
      minWidth: '800px'
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
      verticalAlign: 'top', 
      color: '#111827'
    },
    
    // UI ELEMENTS
    typeBadge: (type) => ({
      display: 'inline-block',
      padding: '4px 10px',
      borderRadius: '20px',
      fontSize: '0.75rem',
      fontWeight: '700',
      textTransform: 'uppercase',
      background: type === 'deposit' ? '#D1FAE5' : '#FEE2E2',
      color: type === 'deposit' ? '#065F46' : '#991B1B'
    }),
    amount: {
      fontWeight: '700',
      fontSize: '1.1rem',
      color: '#111827'
    },
    actionBtn: (color) => ({
      padding: '8px 14px',
      border: 'none',
      borderRadius: '8px',
      color: 'white',
      fontWeight: '600',
      cursor: 'pointer',
      fontSize: '0.85rem',
      background: color === 'green' ? '#00D09C' : color === 'blue' ? '#3B82F6' : '#EF4444',
      marginRight: '8px',
      transition: '0.2s',
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

        <div style={{ ...styles.navItem, ...styles.navItemActive }} onClick={() => isMobile && setSidebarOpen(false)}>
          <FinanceIcon /> <span>Manage Finances</span>
        </div>

        <div style={styles.navItem} onClick={() => navigate('/admin-staking')}>
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
            <h2 style={styles.title}>Manage Requests</h2>
          </div>
          <button style={styles.backBtn} onClick={() => navigate('/admin-dashboard')}>
            ← Back
          </button>
        </div>

        {/* --- TAB SWITCHER --- */}
        <div style={styles.tabContainer}>
          <button 
            style={styles.tabBtn(activeTab === 'deposit')}
            onClick={() => setActiveTab('deposit')}
          >
            <DepositIcon /> Deposits
            <span style={styles.badge(depositCount, activeTab === 'deposit')}>{depositCount}</span>
          </button>
          
          <button 
            style={styles.tabBtn(activeTab === 'withdraw')}
            onClick={() => setActiveTab('withdraw')}
          >
            <WithdrawIcon /> Withdrawals
            <span style={styles.badge(withdrawCount, activeTab === 'withdraw')}>{withdrawCount}</span>
          </button>
        </div>

        {/* Content Card */}
        <div style={styles.card}>
          <div style={styles.tableContainer}>
            {filteredRequests.length === 0 ? (
              <div style={styles.emptyState}>
                <EmptyBoxIcon />
                <div style={{marginTop: '15px'}}>No pending {activeTab} requests.</div>
              </div>
            ) : (
              <table style={styles.table}>
                <thead>
                  <tr>
                    <th style={styles.th}>Type</th>
                    <th style={styles.th}>User Details</th>
                    <th style={styles.th}>Amount Breakdown</th>
                    <th style={styles.th}>Payment Info</th>
                    <th style={styles.th}>Date</th>
                    <th style={styles.th}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredRequests.map((req) => (
                    <tr key={req._id}>
                      
                      <td style={styles.td}>
                        <span style={styles.typeBadge(req.type)}>
                          {req.type}
                        </span>
                      </td>

                      <td style={styles.td}>
                        <div style={{fontWeight: '700', color: '#111827'}}>{req.userId?.username || 'Unknown'}</div>
                        <div style={{fontSize: '0.85rem', color: '#6B7280'}}>{req.userId?.email}</div>
                      </td>

                      <td style={styles.td}>
                        <div style={styles.amount}>₹ {req.amount.toLocaleString()}</div>
                        
                        {req.type === 'withdraw' && (
                          <div style={{marginTop: '6px', fontSize: '0.85rem'}}>
                            <div style={{color: '#EF4444', marginBottom:'2px'}}>
                              - ₹ {(req.amount * 0.01).toLocaleString()} <span style={{fontSize:'0.75rem'}}>(1% TDS)</span>
                            </div>
                            <div style={{
                              color: '#059669', 
                              fontWeight: '700', 
                              borderTop: '1px dashed #D1D5DB', 
                              paddingTop: '4px'
                            }}>
                              = ₹ {(req.amount * 0.99).toLocaleString()}
                            </div>
                          </div>
                        )}
                      </td>

                      <td style={styles.td}>
                        {req.type === 'deposit' ? (
                          <div style={{ background: '#F9FAFB', padding: '8px', borderRadius: '6px', fontSize: '0.85rem', border: '1px solid #F3F4F6' }}>
                            <span style={{color: '#6B7280'}}>TxID:</span> <strong style={{color:'#374151'}}>{req.paymentDetails?.transactionId}</strong>
                          </div>
                        ) : (
                          <div style={{ fontSize: '0.85rem', lineHeight: '1.5', color: '#4B5563' }}>
                            <div style={{fontWeight: '700', color: '#111827'}}>{req.paymentDetails?.bankName}</div>
                            <div>{req.paymentDetails?.accountNumber}</div>
                            <div>{req.paymentDetails?.ifsc}</div>
                            <div style={{fontStyle: 'italic', color: '#9CA3AF'}}>{req.paymentDetails?.accountHolder}</div>
                          </div>
                        )}
                      </td>

                      <td style={styles.td}>
                        <div style={{fontWeight:'500'}}>{new Date(req.date).toLocaleDateString()}</div>
                        <div style={{fontSize: '0.8rem', color: '#9CA3AF'}}>
                          {new Date(req.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                        </div>
                      </td>

                      <td style={styles.td}>
                        <div style={{display:'flex'}}>
                          <button 
                            onClick={() => handleAction(req._id, req.type, 'approve')}
                            style={styles.actionBtn(req.type === 'deposit' ? 'green' : 'blue')}
                            onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                          >
                            <CheckIcon /> {req.type === 'deposit' ? 'Approve' : 'Paid'}
                          </button>

                          <button 
                            onClick={() => handleAction(req._id, req.type, 'reject')}
                            style={styles.actionBtn('red')}
                            onMouseOver={(e) => e.currentTarget.style.opacity = '0.9'}
                            onMouseOut={(e) => e.currentTarget.style.opacity = '1'}
                          >
                            <CrossIcon /> Reject
                          </button>
                        </div>
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

export default AdminDepositRequest;