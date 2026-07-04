import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { leaveAPI } from '../services/api';

export default function HrLeaves() {
  const { token, logout } = useAuth();
  const navigate = useNavigate();

  // State Management
  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoadingId, setActionLoadingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Filter States
  const [filterStatus, setFilterStatus] = useState('');
  const [filterType, setFilterType] = useState('');
  const [searchEmployeeId, setSearchEmployeeId] = useState('');

  // Review comment inputs indexed by request ID
  const [comments, setComments] = useState({});

  // Summary Metrics
  const [metrics, setMetrics] = useState({
    total: 0,
    pending: 0,
    approved: 0,
    rejected: 0
  });

  useEffect(() => {
    if (token) {
      loadRequests();
    }
  }, [token, filterStatus, filterType]);

  const loadRequests = async () => {
    setLoading(true);
    setError('');
    try {
      const response = await leaveAPI.getAllLeaves(token, {
        status: filterStatus || undefined,
        leaveType: filterType || undefined,
        employeeId: searchEmployeeId.trim() || undefined
      });
      setRequests(response.data);
      calculateMetrics(response.data);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to fetch leave requests.');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    loadRequests();
  };

  const calculateMetrics = (data) => {
    let p = 0;
    let a = 0;
    let r = 0;
    data.forEach(req => {
      if (req.status === 'pending') p++;
      if (req.status === 'approved') a++;
      if (req.status === 'rejected') r++;
    });

    setMetrics({
      total: data.length,
      pending: p,
      approved: a,
      rejected: r
    });
  };

  const handleApprove = async (id) => {
    const comment = comments[id] || '';
    setActionLoadingId(id);
    setError('');
    setSuccess('');
    try {
      await leaveAPI.approveLeave(id, comment, token);
      setSuccess('Leave request approved successfully.');
      
      // Reload logs
      const response = await leaveAPI.getAllLeaves(token, {
        status: filterStatus || undefined,
        leaveType: filterType || undefined,
        employeeId: searchEmployeeId.trim() || undefined
      });
      setRequests(response.data);
      calculateMetrics(response.data);
    } catch (err) {
      setError(err.message || 'Failed to approve leave request.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleReject = async (id) => {
    const comment = comments[id] || '';
    setActionLoadingId(id);
    setError('');
    setSuccess('');
    try {
      await leaveAPI.rejectLeave(id, comment, token);
      setSuccess('Leave request rejected successfully.');

      // Reload logs
      const response = await leaveAPI.getAllLeaves(token, {
        status: filterStatus || undefined,
        leaveType: filterType || undefined,
        employeeId: searchEmployeeId.trim() || undefined
      });
      setRequests(response.data);
      calculateMetrics(response.data);
    } catch (err) {
      setError(err.message || 'Failed to reject leave request.');
    } finally {
      setActionLoadingId(null);
    }
  };

  const handleCommentChange = (id, text) => {
    setComments({
      ...comments,
      [id]: text
    });
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
          <span className="badge hr">Admin</span>
        </div>

        <nav style={{ display: 'flex', gap: '8px' }}>
          <button className="subnav-tab" onClick={() => navigate('/hr')}>
            HR Home
          </button>
          <button className="subnav-tab active">
            Leave Approvals
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

      <main className="dashboard-main" style={{ display: 'block', padding: '24px 48px 60px' }}>
        
        {/* Metric Cards */}
        <div className="dashboard-grid" style={{ marginBottom: '32px' }}>
          <div className="stat-card">
            <div className="stat-icon blue">📁</div>
            <div className="stat-details">
              <span className="stat-label">Total Applications</span>
              <span className="stat-val">{metrics.total} Requests</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon orange">🕒</div>
            <div className="stat-details">
              <span className="stat-label">Pending Action</span>
              <span className="stat-val">{metrics.pending} Requests</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon green">✓</div>
            <div className="stat-details">
              <span className="stat-label">Approved</span>
              <span className="stat-val">{metrics.approved} Requests</span>
            </div>
          </div>
          <div className="stat-card">
            <div className="stat-icon red">✗</div>
            <div className="stat-details">
              <span className="stat-label">Rejected</span>
              <span className="stat-val">{metrics.rejected} Requests</span>
            </div>
          </div>
        </div>

        {/* Filter Toolbar Card */}
        <div className="glass-card" style={{ maxWidth: 'none', padding: '24px', marginBottom: '32px' }}>
          <form onSubmit={handleSearchSubmit} style={{ display: 'flex', flexWrap: 'wrap', gap: '16px', alignItems: 'flex-end' }}>
            
            {/* Search Input */}
            <div style={{ flex: '1 1 200px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8' }}>Search Employee ID</label>
              <input
                type="text"
                placeholder="e.g. EMP001"
                className="form-input-glow"
                style={{ padding: '10px 16px', background: 'rgba(0,0,0,0.1)' }}
                value={searchEmployeeId}
                onChange={(e) => setSearchEmployeeId(e.target.value)}
              />
            </div>

            {/* Type Filter */}
            <div style={{ flex: '1 1 180px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8' }}>Leave Type</label>
              <select
                className="form-input-glow"
                style={{ padding: '10px 16px', background: 'rgba(0,0,0,0.1)' }}
                value={filterType}
                onChange={(e) => setFilterType(e.target.value)}
              >
                <option value="">-- All Types --</option>
                <option value="sick">Sick Leave</option>
                <option value="casual">Casual Leave</option>
                <option value="earned">Earned Leave</option>
                <option value="unpaid">Unpaid Leave</option>
              </select>
            </div>

            {/* Status Filter */}
            <div style={{ flex: '1 1 180px', display: 'flex', flexDirection: 'column', gap: '6px' }}>
              <label style={{ fontSize: '12px', fontWeight: 'bold', color: '#94a3b8' }}>Review Status</label>
              <select
                className="form-input-glow"
                style={{ padding: '10px 16px', background: 'rgba(0,0,0,0.1)' }}
                value={filterStatus}
                onChange={(e) => setFilterStatus(e.target.value)}
              >
                <option value="">-- All Statuses --</option>
                <option value="pending">Pending</option>
                <option value="approved">Approved</option>
                <option value="rejected">Rejected</option>
              </select>
            </div>

            {/* Actions */}
            <div style={{ display: 'flex', gap: '12px' }}>
              <button type="submit" className="btn primary" style={{ padding: '12px 24px', fontSize: '14px' }}>
                🔍 Search
              </button>
              <button 
                type="button" 
                className="btn-sm cancel"
                style={{ padding: '12px 18px', border: '1px solid rgba(255,255,255,0.15)', borderRadius: '8px' }}
                onClick={() => {
                  setSearchEmployeeId('');
                  setFilterStatus('');
                  setFilterType('');
                }}
              >
                Reset
              </button>
            </div>
          </form>
        </div>

        {/* Data Card */}
        <div className="glass-card" style={{ maxWidth: 'none', padding: '32px' }}>
          <h3 style={{ marginTop: 0, marginBottom: '24px', fontSize: '20px' }}>Leave Audit Sheets</h3>

          {loading ? (
            <div style={{ textAlign: 'center', padding: '32px' }}>
              <div className="spinner" style={{ margin: '0 auto 16px' }}></div>
              <p style={{ color: '#64748b' }}>Refreshing records...</p>
            </div>
          ) : requests.length === 0 ? (
            <div style={{ textAlign: 'center', padding: '48px', color: '#64748b' }}>
              📁 No leave applications found matching search criteria.
            </div>
          ) : (
            <div className="table-responsive">
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '2px solid rgba(255,255,255,0.08)' }}>
                    <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '13px', textTransform: 'uppercase' }}>Employee ID</th>
                    <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '13px', textTransform: 'uppercase' }}>Type</th>
                    <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '13px', textTransform: 'uppercase' }}>Period</th>
                    <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '13px', textTransform: 'uppercase' }}>Reason</th>
                    <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '13px', textTransform: 'uppercase' }}>Review Comments & Actions</th>
                    <th style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '13px', textTransform: 'uppercase', textAlign: 'right' }}>Status</th>
                  </tr>
                </thead>
                <tbody>
                  {requests.map((record) => (
                    <tr key={record._id} style={{ borderBottom: '1px solid rgba(255,255,255,0.04)', transition: 'background 0.2s' }}>
                      <td style={{ padding: '16px 12px', fontWeight: 'bold', color: '#c084fc' }}>
                        {record.employee?.employeeId || 'N/A'}
                        <div style={{ fontSize: '11px', color: '#64748b', fontWeight: 'normal' }}>{record.employee?.email}</div>
                      </td>
                      <td style={{ padding: '16px 12px', color: '#fff', textTransform: 'capitalize', fontWeight: '500' }}>
                        {record.leaveType}
                      </td>
                      <td style={{ padding: '16px 12px', color: '#e2e8f0', fontSize: '13px' }}>
                        {formatDate(record.startDate)} - {formatDate(record.endDate)}
                      </td>
                      <td style={{ padding: '16px 12px', color: '#94a3b8', fontSize: '13px', maxWidth: '250px', whiteSpace: 'normal', wordBreak: 'break-word' }}>
                        {record.reason}
                      </td>
                      <td style={{ padding: '16px 12px', minWidth: '280px' }}>
                        {record.status === 'pending' ? (
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                            <input
                              type="text"
                              placeholder="Add optional review comment..."
                              className="form-input-glow"
                              style={{ padding: '6px 12px', fontSize: '12px', background: 'rgba(0,0,0,0.1)' }}
                              value={comments[record._id] || ''}
                              onChange={(e) => handleCommentChange(record._id, e.target.value)}
                              disabled={actionLoadingId === record._id}
                            />
                            <div style={{ display: 'flex', gap: '8px' }}>
                              <button
                                onClick={() => handleApprove(record._id)}
                                disabled={actionLoadingId !== null}
                                className="btn primary"
                                style={{ padding: '6px 12px', fontSize: '12px', flex: 1 }}
                              >
                                Approve ✓
                              </button>
                              <button
                                onClick={() => handleReject(record._id)}
                                disabled={actionLoadingId !== null}
                                className="btn logout-btn"
                                style={{ padding: '6px 12px', fontSize: '12px', flex: 1 }}
                              >
                                Reject ✗
                              </button>
                            </div>
                          </div>
                        ) : (
                          <div style={{ fontSize: '13px' }}>
                            <div style={{ fontWeight: '500', color: '#e2e8f0' }}>Review Comment:</div>
                            <div style={{ color: '#fb7185', fontStyle: 'italic' }}>
                              "{record.reviewComment || 'No comment provided'}"
                            </div>
                          </div>
                        )}
                      </td>
                      <td style={{ padding: '16px 12px', textAlign: 'right' }}>
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
