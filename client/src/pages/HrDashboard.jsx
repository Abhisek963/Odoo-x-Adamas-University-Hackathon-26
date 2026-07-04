import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Minimal HR dashboard page to verify route authentication
 */
export default function HrDashboard() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="dashboard-container">
      <header className="dashboard-header glass">
        <div className="header-brand">
          <h3>Odoo HRMS</h3>
          <span className="badge hr">HR Officer Portal</span>
        </div>

        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', gap: '8px' }}>
          <button className="subnav-tab active">
            HR Home
          </button>
          <button className="subnav-tab" onClick={() => navigate('/hr/leaves')}>
            Leave Approvals 🚀
          </button>
        </nav>

        <div className="header-user">
          <span className="user-email">{user?.email}</span>
          <button className="btn logout-btn" onClick={logout}>Logout</button>
        </div>
      </header>

      <main className="dashboard-main" style={{ padding: '24px 48px' }}>
        <div className="glass-card welcome-card" style={{ maxWidth: 'none' }}>
          <h1>Welcome, HR Manager</h1>
          <p>You have administrative access to provision employees and oversee personnel operations.</p>
          
          <div className="user-details-grid">
            <div className="detail-item">
              <span className="label">Employee ID</span>
              <span className="value">{user?.employeeId || 'N/A'}</span>
            </div>
            <div className="detail-item">
              <span className="label">Email Address</span>
              <span className="value">{user?.email}</span>
            </div>
            <div className="detail-item">
              <span className="label">Role Access</span>
              <span className="value capitalize">{user?.role}</span>
            </div>
          </div>
        </div>

        <div className="glass-card" style={{ maxWidth: 'none', marginTop: '32px', padding: '32px', textAlign: 'center' }}>
          <h2 style={{ marginTop: 0 }}>Personnel & Leave Approvals</h2>
          <p style={{ color: '#94a3b8', marginBottom: '24px', fontSize: '15px' }}>
            Review, comment, approve, or reject employee leave requests.
          </p>
          <button className="btn primary" onClick={() => navigate('/hr/leaves')} style={{ padding: '12px 32px', fontSize: '14px' }}>
            🚀 Open Leave Approvals Portal
          </button>
        </div>
      </main>
    </div>
  );
}
