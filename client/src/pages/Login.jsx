import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { authAPI } from '../services/api';
import { useNavigate } from 'react-router-dom';

export default function Login() {
  const [loginId, setLoginId] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [formLoading, setFormLoading] = useState(false);

  const { login: saveAuth } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!loginId || !password) {
      setError('Please enter both your login identifier and password');
      return;
    }

    setError('');
    setFormLoading(true);

    try {
      const response = await authAPI.login(loginId, password);
      
      // Save credentials in AuthContext
      saveAuth(response.user, response.token, response.mustChangePassword);

      // Redirect logic based on mustChangePassword and role
      if (response.mustChangePassword) {
        navigate('/change-password');
      } else if (response.user.role === 'hr') {
        navigate('/hr');
      } else {
        navigate('/employee');
      }
    } catch (err) {
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setFormLoading(false);
    }
  };

  return (
    <div className="auth-page-container">
      <div className="glass-card auth-card">
        <div className="brand-logo">
          <svg viewBox="0 0 100 100" className="logo-svg">
            <defs>
              <linearGradient id="logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#c084fc" />
                <stop offset="100%" stopColor="#818cf8" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="45" fill="none" stroke="url(#logo-grad)" strokeWidth="6" />
            <path d="M30 65 L50 35 L70 65 Z" fill="none" stroke="url(#logo-grad)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
            <circle cx="50" cy="48" r="4" fill="url(#logo-grad)" />
          </svg>
          <h2>Odoo HRMS</h2>
          <p className="subtitle">Secure Employee Authentication Portal</p>
        </div>

        {error && (
          <div className="alert error">
            <span className="alert-icon">⚠️</span>
            <span className="alert-msg">{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="auth-form">
          <div className="form-group">
            <label htmlFor="loginId">Employee ID or Email</label>
            <input
              id="loginId"
              type="text"
              className="glow-input"
              value={loginId}
              onChange={(e) => setLoginId(e.target.value)}
              placeholder="e.g. OIJODO20220001 or user@example.com"
              disabled={formLoading}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password</label>
            <div className="password-input-wrapper">
              <input
                id="password"
                type={showPassword ? 'text' : 'password'}
                className="glow-input"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••••••"
                disabled={formLoading}
                required
              />
              <button
                type="button"
                className="toggle-password-btn"
                onClick={() => setShowPassword(!showPassword)}
                tabIndex="-1"
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
          </div>

          <button
            type="submit"
            className="btn primary full-width"
            disabled={formLoading}
          >
            {formLoading ? (
              <span className="spinner-inline"></span>
            ) : 'Sign In'}
          </button>
        </form>
      </div>
    </div>
  );
}
