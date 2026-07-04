import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { leaveAPI } from '../services/api';

export default function EmployeeLeaves() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  // State Management
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [formLoading, setFormLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Form State
  const [leaveType, setLeaveType] = useState('sick');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Load history on mount and status filter change
  useEffect(() => {
    if (token) {
      loadHistory();
    }
  }, [token, filterStatus]);

  const loadHistory = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await leaveAPI.getMyLeaves(token, filterStatus);
      setHistory(response.data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to load leave history.');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // 1. Validation
    if (!leaveType || !startDate || !endDate || !reason.trim()) {
      setError('All fields are required.');
      return;
    }

    if (new Date(endDate) < new Date(startDate)) {
      setError('End date cannot be before start date.');
      return;
    }

    setFormLoading(true);
    try {
      await leaveAPI.applyLeave({
        leaveType,
        startDate,
        endDate,
        reason: reason.trim()
      }, token);

      setSuccess('Leave request submitted successfully!');
      
      // Clear form
      setStartDate('');
      setEndDate('');
      setReason('');
      
      // Reload history
      const response = await leaveAPI.getMyLeaves(token, filterStatus);
      setHistory(response.data);
    } catch (err) {
      setError(err.message || 'Failed to submit leave request.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleCancel = async (id) => {
    if (!window.confirm('Are you sure you want to cancel this leave request?')) return;
    
    setActionLoadingId(id);
    setError('');
    setSuccess('');
    try {
      await leaveAPI.cancelLeave(id, token);
      setSuccess('Leave request cancelled successfully.');

      // Reload history
      const response = await leaveAPI.getMyLeaves(token, filterStatus);
      setHistory(response.data);
    } catch (err) {
      setError(err.message || 'Failed to cancel request.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const formatDate = (dateStr) => {
    return new Date(dateStr).toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    });
  };

  return (
    <div className="dashboard-wrapper">
      {/* Navigation Header */}
      <header className="dashboard-header glass">
        <div className="header-brand">
          <svg viewBox="0 0 100 100" className="logo-svg" style={{ width: '40px', height: '40px', margin: 0 }}>
            <circle cx="50" cy="50" r="45" fill="none" stroke="url(#nav-logo-grad)" strokeWidth="6" />
            <path d="M30 65 L50 35 L70 65 Z" fill="none" stroke="url(#nav-logo-grad)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h3>Odoo HRMS</h3>
          <span className="badge employee">Leaves</span>
        </div>

        <nav style={{ display: 'flex', gap: '8px' }}>
          <button className="subnav-tab" onClick={() => navigate('/employee')}>
            Dashboard
          </button>
          <button className="subnav-tab active">
            Leave Requests
          </button>
        </nav>

        <div className="header-user">
          <button className="btn logout-btn" onClick={logout}>Logout</button>
        </div>
      </header>

      {/* Main Alerts */}
      <div style={{ padding: '0 48px', marginTop: '24px' }}>
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
      </div>

      <main className="dashboard-main" style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '32px', padding: '24px 48px 60px' }}>
        
        {/* Left Column: Apply Form */}
        <div className="glass-card" style={{ maxWidth: 'none', height: 'fit-content', padding: '32px' }}>
          <h2 style={{ marginTop: 0, marginBottom: '8px', fontSize: '24px' }}>Apply for Leave</h2>
          <p className="meta-text-muted" style={{ marginBottom: '24px' }}>Submit a new leave application for approval.</p>

          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
            
            {/* Leave Type */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#94a3b8' }}>Leave Type</label>
              <select
                className="form-input-glow"
                value={leaveType}
                onChange={(e) => setLeaveType(e.target.value)}
              >
                <option value="sick">Sick Leave</option>
                <option value="casual">Casual Leave</option>
                <option value="earned">Earned Leave</option>
                <option value="unpaid">Unpaid Leave</option>
              </select>
            </div>

            {/* Start Date */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#94a3b8' }}>Start Date</label>
              <input
                type="date"
                className="form-input-glow"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
              />
            </div>

            {/* End Date */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#94a3b8' }}>End Date</label>
              <input
                type="date"
                className="form-input-glow"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
              />
            </div>

            {/* Reason */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '13px', fontWeight: 'bold', color: '#94a3b8' }}>Reason details</label>
              <textarea
                rows="4"
                placeholder="Brief description of the reason for your leave request..."
                className="form-input-glow"
                style={{ resize: 'none', padding: '12px' }}
                value={reason}
                onChange={(e) => setReason(e.target.value)}
              />
            </div>

            <button
              type="submit"
              disabled={formLoading}
              className="btn primary"
              style={{ padding: '14px', fontSize: '15px', fontWeight: 'bold' }}
            >
              {formLoading ? 'Submitting...' : '🚀 Submit Leave Application'}
            </button>
          </form>
        </div>

        {/* Right Column: Leaves History Log */}
        <div className="glass-card" style={{ maxWidth: 'none', padding: '32px' }}>
          
          {/* Header & Filter Controls */}
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
            <div>
              <h2 style={{ margin: 0, fontSize: '24px' }}>My Leave Records</h2>
              <p className="meta-text-muted" style={{ margin: 0 }}>Review, audit, or cancel your submitted requests.</p>
            </div>

            {/* Filter Dropdown */}
            <select
              className="form-input-glow"
              style={{ padding: '8px 16px', background: 'rgba(0,0,0,0.2)', width: 'auto' }}
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
            >
              <option value="">-- All Statuses --</option>
              <option value="pending">Pending</option>
              <option value="approved">Approved</option>
              <option value="rejected">Rejected</option>
            </select>
          </div>

          {loading && history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px' }}>
              <div className="spinner" style={{ margin: '0 auto 16px' }}></div>
              <p style={{ color: '#64748b' }}>Refreshing history...</p>
            </div>
          ) : history.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
              📁 No leave records found.
            </div>
          ) : (
            <div className="table-responsive" style={{ overflowX: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.08)' }}>
                    <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '13px', textTransform: 'uppercase' }}>Type</th>
                    <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '13px', textTransform: 'uppercase' }}>Period</th>
                    <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '13px', textTransform: 'uppercase' }}>Reason</th>
                    <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '13px', textTransform: 'uppercase' }}>Review Comment</th>
                    <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '13px', textTransform: 'uppercase' }}>Status</th>
                    <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '13px', textTransform: 'uppercase', textAlign: 'right' }}>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {history.map((record) => (
                    <tr key={record._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)' }}>
                      <td style={{ padding: '16px 12px', fontWeight: 'bold', color: '#fff', textTransform: 'capitalize' }}>
                        {record.leaveType}
                      </td>
                      <td style={{ padding: '16px 12px', color: '#e2e8f0', fontSize: '13px' }}>
                        {formatDate(record.startDate)} - {formatDate(record.endDate)}
                      </td>
                      <td style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '13px', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={record.reason}>
                        {record.reason}
                      </td>
                      <td style={{ padding: '16px 12px', color: '#fb7185', fontSize: '13px', maxWidth: '200px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }} title={record.reviewComment}>
                        {record.reviewComment || <span style={{ color: '#475569' }}>--</span>}
                      </td>
                      <td style={{ padding: '16px 12px' }}>
                        <span style={{
                          padding: '4px 10px',
                          borderRadius: '12px',
                          fontSize: '11px',
                          fontWeight: 'bold',
                          textTransform: 'uppercase',
                          background: record.status === 'approved' ? 'rgba(52, 211, 153, 0.1)' : record.status === 'rejected' ? 'rgba(244, 63, 94, 0.1)' : 'rgba(251, 191, 36, 0.1)',
                          color: record.status === 'approved' ? '#34d399' : record.status === 'rejected' ? '#f43f5e' : '#fbbf24',
                          border: record.status === 'approved' ? '1px solid rgba(52, 211, 153, 0.2)' : record.status === 'rejected' ? '1px solid rgba(244, 63, 94, 0.2)' : '1px solid rgba(251, 191, 36, 0.2)'
                        }}>
                          {record.status}
                        </span>
                      </td>
                      <td style={{ padding: '16px 12px', textAlign: 'right' }}>
                        {record.status === 'pending' ? (
                          <button
                            onClick={() => handleCancel(record._id)}
                            disabled={actionLoadingId === record._id}
                            className="btn logout-btn"
                            style={{ padding: '6px 12px', fontSize: '12px' }}
                          >
                            {actionLoadingId === record._id ? 'Cancelling...' : 'Cancel ❌'}
                          </button>
                        ) : (
                          <span style={{ color: '#475569', fontSize: '12px' }}>Locked</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
