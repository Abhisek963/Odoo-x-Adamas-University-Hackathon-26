import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function ChangePassword() {
  const { user, token, updatePasswordStatus } = useAuth();
  const navigate = useNavigate();

  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  
  const [showCurrent, setShowCurrent] = useState(false);
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // 1. Client-side validations
    if (!currentPassword || !newPassword || !confirmPassword) {
      setError('All fields are required');
      return;
    }

    if (newPassword.length < 6) {
      setError('New password must be at least 6 characters long');
      return;
    }

    if (newPassword !== confirmPassword) {
      setError('New password and confirmation do not match');
      return;
    }

    if (newPassword === currentPassword) {
      setError('New password cannot be the same as your current password');
      return;
    }

    setLoading(true);

    try {
      const response = await authAPI.changePassword(currentPassword, newPassword, token);
      
      setSuccess('Password updated successfully! Redirecting...');
      
      // Update local and context state
      updatePasswordStatus(false);

      // Delay redirect slightly so user sees success message
      setTimeout(() => {
        if (user.role === 'hr') {
          navigate('/hr');
        } else {
          navigate('/employee');
        }
      }, 1500);

    } catch (err) {
      setError(err.message || 'Failed to change password. Please check your inputs.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="glass-card auth-card">
        <div className="brand-logo">
          <h2>Change Password</h2>
          <p className="subtitle">First-login security update required</p>
        </div>

        {error && (
          <div className="alert error">
            <span className="alert-icon">⚠️</span>
            <span className="alert-msg">{error}</span>
          </div>
        )}

        {success && (
          <div className="alert success">
            <span className="alert-icon">✅</span>
            <span className="alert-msg">{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="currentPassword">Current Password</label>
            <div className="password-input-wrapper">
              <input
                id="currentPassword"
                type={showCurrent ? 'text' : 'password'}
                className="glow-input"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                disabled={loading}
                required
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowCurrent(!showCurrent)}
                tabIndex="-1"
              >
                {showCurrent ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="newPassword">New Password</label>
            <div className="password-input-wrapper">
              <input
                id="newPassword"
                type={showNew ? 'text' : 'password'}
                className="glow-input"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                disabled={loading}
                required
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowNew(!showNew)}
                tabIndex="-1"
              >
                {showNew ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirm New Password</label>
            <div className="password-input-wrapper">
              <input
                id="confirmPassword"
                type={showConfirm ? 'text' : 'password'}
                className="glow-input"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                disabled={loading}
                required
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowConfirm(!showConfirm)}
                tabIndex="-1"
              >
                {showConfirm ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn primary full-width"
            disabled={loading}
          >
            {loading ? (
              <span className="spinner-inline"></span>
            ) : 'Update Password'}
          </button>
        </form>
      </div>
    </div>
  );
}
