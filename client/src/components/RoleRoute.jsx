import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Route guard enforcing role checks
 */
export function RoleRoute({ children, allowedRoles }) {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  // If role is not allowed, show a premium styled 403 Forbidden card
  if (!allowedRoles.includes(user.role)) {
    return (
      <div className="forbidden-page-container">
        <div className="glass-card forbidden-card">
          <div className="forbidden-badge">🔒</div>
          <h1>403 - Forbidden Access</h1>
          <p>Your current user role (<strong>{user.role}</strong>) is not authorized to access this resource.</p>
          <div className="actions">
            <a href={user.role === 'hr' ? '/hr' : '/employee'} className="btn primary">
              Back to Dashboard
            </a>
          </div>
        </div>
      </div>
    );
  }

  return children;
}
