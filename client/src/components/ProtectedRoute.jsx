import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

/**
 * Route guard enforcing basic authentication and password-change state
 */
export function ProtectedRoute({ children }) {
  const { user, token, mustChangePassword, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return (
      <div className="auth-loading-container">
        <div className="spinner"></div>
        <p>Verifying authentication session...</p>
      </div>
    );
  }

  // 1. Unauthenticated -> Redirect to Login
  if (!token || !user) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // 2. Authenticated but must change password (first login)
  if (mustChangePassword) {
    // If not already on /change-password, force redirect to it
    if (location.pathname !== '/change-password') {
      return <Navigate to="/change-password" replace />;
    }
  } else {
    // If mustChangePassword is false, and trying to open /change-password,
    // redirect to their default home page
    if (location.pathname === '/change-password') {
      return <Navigate to={user.role === 'hr' ? '/hr' : '/employee'} replace />;
    }
  }

  return children;
}
