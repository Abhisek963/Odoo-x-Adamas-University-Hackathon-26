import { useAuth } from '../context/AuthContext';

/**
 * Minimal HR dashboard page to verify route authentication
 */
export default function HrDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-container">
      <header className="dashboard-header glass">
        <div className="header-brand">
          <h3>Odoo HRMS</h3>
          <span className="badge hr">HR Officer Portal</span>
        </div>
        <div className="header-user">
          <span className="user-email">{user?.email}</span>
          <button className="btn logout-btn" onClick={logout}>Logout</button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="glass-card welcome-card">
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
      </main>
    </div>
  );
}
