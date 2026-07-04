import { useAuth } from '../context/AuthContext';

/**
 * Minimal employee dashboard page to verify route authentication
 */
export default function EmployeeDashboard() {
  const { user, logout } = useAuth();

  return (
    <div className="dashboard-container">
      <header className="dashboard-header glass">
        <div className="header-brand">
          <h3>Odoo HRMS</h3>
          <span className="badge employee">Employee Portal</span>
        </div>
        <div className="header-user">
          <span className="user-email">{user?.email}</span>
          <button className="btn logout-btn" onClick={logout}>Logout</button>
        </div>
      </header>

      <main className="dashboard-main">
        <div className="glass-card welcome-card">
          <h1>Welcome, Employee</h1>
          <p>You have successfully logged in and completed your password change setup.</p>
          
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
