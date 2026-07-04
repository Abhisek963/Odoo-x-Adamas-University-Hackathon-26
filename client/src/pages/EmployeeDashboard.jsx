import { useState, useEffect } from 'react';
import { useAuth } from '../context/AuthContext';
import { employeeAPI, authAPI } from '../services/api';
import './EmployeeDashboard.css';

export default function EmployeeDashboard() {
  const { user, token, logout } = useAuth();
  
  // Navigation & Sub-navigation Tabs State
  const [activeTab, setActiveTab] = useState('dashboard'); // 'dashboard', 'profile', 'salary', 'documents'
  const [profileSubtab, setProfileSubtab] = useState('resume'); // 'resume', 'private', 'salaryInfo', 'security'

  // Application Data States
  const [profile, setProfile] = useState(null);
  const [salary, setSalary] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');

  // Edit Mode States (Resume Tab)
  const [editAbout, setEditAbout] = useState(false);
  const [aboutVal, setAboutVal] = useState('');
  const [editJobLove, setEditJobLove] = useState(false);
  const [jobLoveVal, setJobLoveVal] = useState('');
  const [editHobbies, setEditHobbies] = useState(false);
  const [hobbiesVal, setHobbiesVal] = useState('');

  // Skills & Certifications Tag Input States
  const [newSkill, setNewSkill] = useState('');
  const [showAddSkill, setShowAddSkill] = useState(false);
  const [newCert, setNewCert] = useState('');
  const [showAddCert, setShowAddCert] = useState(false);

  // Edit Mode States (Private Info Tab)
  const [editPrivate, setEditPrivate] = useState(false);
  const [privateFormData, setPrivateFormData] = useState({
    phone: '',
    personalEmail: '',
    residingAddress: '',
    nationality: '',
    gender: '',
    maritalStatus: '',
    bankDetails: {
      accountNumber: '',
      bankName: '',
      ifscCode: '',
      panNo: '',
      uanNo: ''
    }
  });

  // Change Password State (Security Tab)
  const [pwdForm, setPwdForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  const [pwdLoading, setPwdLoading] = useState(false);
  const [pwdError, setPwdError] = useState('');

  // Avatar Edit Modal State
  const [showAvatarModal, setShowAvatarModal] = useState(false);
  const avatarPresets = [
    { name: 'Sunset Glow', style: { background: 'linear-gradient(135deg, #f43f5e 0%, #fb923c 100%)', color: '#fff' }, emoji: '🌅' },
    { name: 'Indigo Deep', style: { background: 'linear-gradient(135deg, #4f46e5 0%, #06b6d4 100%)', color: '#fff' }, emoji: '🌌' },
    { name: 'Forest Mint', style: { background: 'linear-gradient(135deg, #10b981 0%, #6ee7b7 100%)', color: '#064e3b' }, emoji: '🍃' },
    { name: 'Royal Grape', style: { background: 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)', color: '#fff' }, emoji: '🔮' },
    { name: 'Amber Gold', style: { background: 'linear-gradient(135deg, #d97706 0%, #fcd34d 100%)', color: '#78350f' }, emoji: '👑' },
    { name: 'Cosmic Steel', style: { background: 'linear-gradient(135deg, #1e293b 0%, #64748b 100%)', color: '#fff' }, emoji: '🛡️' }
  ];

  // Mock activity alerts feed
  const [alerts, setAlerts] = useState([
    { id: 1, date: 'Today', title: 'Welcome to Portal', desc: 'Verify your private info and bank details under "My Profile".', type: 'info' },
    { id: 2, date: 'Yesterday', title: 'Security Alert', desc: 'Password updated successfully.', type: 'security' },
    { id: 3, date: '3 days ago', title: 'June Pay Slip', desc: 'June salary slip has been generated and is now viewable.', type: 'salary' }
  ]);

  // Documents list
  const [documents, setDocuments] = useState([
    { id: 1, name: 'Resume_CV.pdf', type: 'pdf', size: '1.2 MB' },
    { id: 2, name: 'Employment_Offer_Letter.pdf', type: 'pdf', size: '3.4 MB' },
    { id: 3, name: 'PAN_Card_Copy.jpg', type: 'image', size: '840 KB' }
  ]);

  // Load profile and salary on mount
  useEffect(() => {
    if (token) {
      fetchData();
    }
  }, [token]);

  const fetchData = async () => {
    setLoading(true);
    setError('');
    try {
      const profData = await employeeAPI.getProfile(token);
      setProfile(profData.data);
      
      // Seed editable form states
      setAboutVal(profData.data.about || '');
      setJobLoveVal(profData.data.whatILoveAboutMyJob || '');
      setHobbiesVal(profData.data.interestsHobbies || '');
      setPrivateFormData({
        phone: profData.data.phone || '',
        personalEmail: profData.data.personalEmail || '',
        residingAddress: profData.data.residingAddress || '',
        nationality: profData.data.nationality || '',
        gender: profData.data.gender || '',
        maritalStatus: profData.data.maritalStatus || '',
        bankDetails: {
          accountNumber: profData.data.bankDetails?.accountNumber || '',
          bankName: profData.data.bankDetails?.bankName || '',
          ifscCode: profData.data.bankDetails?.ifscCode || '',
          panNo: profData.data.bankDetails?.panNo || '',
          uanNo: profData.data.bankDetails?.uanNo || ''
        }
      });

      const salData = await employeeAPI.getSalary(token);
      setSalary(salData.data);
    } catch (err) {
      console.error('Error loading employee dashboard data:', err);
      setError(err.message || 'Failed to fetch employee details. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateProfile = async (updatedFields) => {
    setError('');
    setSuccessMsg('');
    try {
      const response = await employeeAPI.updateProfile(updatedFields, token);
      setProfile(response.data);
      triggerSuccess('Profile details updated successfully');
      return response.data;
    } catch (err) {
      setError(err.message || 'Failed to save changes.');
    }
  };

  const triggerSuccess = (msg) => {
    setSuccessMsg(msg);
    setTimeout(() => setSuccessMsg(''), 4000);
  };

  // Resume section saves
  const saveAboutSection = async () => {
    const updated = await handleUpdateProfile({ about: aboutVal });
    if (updated) setEditAbout(false);
  };

  const saveJobLoveSection = async () => {
    const updated = await handleUpdateProfile({ whatILoveAboutMyJob: jobLoveVal });
    if (updated) setEditJobLove(false);
  };

  const saveHobbiesSection = async () => {
    const updated = await handleUpdateProfile({ interestsHobbies: hobbiesVal });
    if (updated) setEditHobbies(false);
  };

  // Tag list modifications (Skills & Certifications)
  const addSkillTag = async () => {
    if (!newSkill.trim()) return;
    const updatedSkills = [...(profile?.skills || []), newSkill.trim()];
    const updated = await handleUpdateProfile({ skills: updatedSkills });
    if (updated) {
      setNewSkill('');
      setShowAddSkill(false);
    }
  };

  const removeSkillTag = async (skillToRemove) => {
    const updatedSkills = (profile?.skills || []).filter(s => s !== skillToRemove);
    await handleUpdateProfile({ skills: updatedSkills });
  };

  const addCertTag = async () => {
    if (!newCert.trim()) return;
    const updatedCerts = [...(profile?.certifications || []), newCert.trim()];
    const updated = await handleUpdateProfile({ certifications: updatedCerts });
    if (updated) {
      setNewCert('');
      setShowAddCert(false);
    }
  };

  const removeCertTag = async (certToRemove) => {
    const updatedCerts = (profile?.certifications || []).filter(c => c !== certToRemove);
    await handleUpdateProfile({ certifications: updatedCerts });
  };

  // Private Info saves
  const handlePrivateFormSubmit = async (e) => {
    e.preventDefault();
    const updated = await handleUpdateProfile(privateFormData);
    if (updated) setEditPrivate(false);
  };

  // Change Password API save
  const handlePasswordChangeSubmit = async (e) => {
    e.preventDefault();
    pwdError && setPwdError('');
    
    if (pwdForm.newPassword !== pwdForm.confirmPassword) {
      setPwdError('Confirm password does not match new password.');
      return;
    }

    setPwdLoading(true);
    try {
      await authAPI.changePassword(pwdForm.currentPassword, pwdForm.newPassword, token);
      triggerSuccess('Your security password has been changed successfully.');
      setPwdForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
      // Log alert
      setAlerts([
        { id: Date.now(), date: 'Just now', title: 'Security Alert', desc: 'Your account password was updated from the dashboard.', type: 'security' },
        ...alerts
      ]);
    } catch (err) {
      setPwdError(err.message || 'Failed to update password.');
    } finally {
      setPwdLoading(false);
    }
  };

  // Profile Picture Upload Handler
  const handleAvatarChange = async (avatarSource, type = 'preset') => {
    let picVal = avatarSource;
    if (type === 'file') {
      const file = avatarSource.target.files[0];
      if (!file) return;
      if (file.size > 2 * 1024 * 1024) {
        setError('Profile picture file must be smaller than 2MB.');
        return;
      }
      
      // Convert to Base64 String
      const reader = new FileReader();
      reader.onloadend = async () => {
        await handleUpdateProfile({ profilePicture: reader.result });
        setShowAvatarModal(false);
        setAlerts([
          { id: Date.now(), date: 'Just now', title: 'Profile Updated', desc: 'You updated your profile picture.', type: 'info' },
          ...alerts
        ]);
      };
      reader.readAsDataURL(file);
      return;
    }

    // Preset selection
    await handleUpdateProfile({ profilePicture: picVal });
    setShowAvatarModal(false);
    setAlerts([
      { id: Date.now(), date: 'Just now', title: 'Profile Updated', desc: 'You updated your profile picture avatar.', type: 'info' },
      ...alerts
    ]);
  };

  // Helper to extract user name initials
  const getInitials = () => {
    if (profile?.firstName && profile?.lastName) {
      return `${profile.firstName[0]}${profile.lastName[0]}`.toUpperCase();
    }
    return user?.email ? user.email.slice(0, 2).toUpperCase() : 'EE';
  };

  // Mock document upload
  const handleDocUpload = (e) => {
    const file = e.target.files[0];
    if (!file) return;
    const newDoc = {
      id: Date.now(),
      name: file.name,
      type: file.type.includes('pdf') ? 'pdf' : 'image',
      size: `${(file.size / (1024 * 1024)).toFixed(2)} MB`
    };
    setDocuments([...documents, newDoc]);
    triggerSuccess('Document uploaded successfully.');
  };

  if (loading) {
    return (
      <div className="auth-loading-container">
        <div className="spinner"></div>
        <p>Loading Employee Workspace...</p>
      </div>
    );
  }

  return (
    <div className="dashboard-wrapper">
      {/* 1. Header Navigation Bar */}
      <header className="dashboard-header glass">
        <div className="header-brand">
          <svg viewBox="0 0 100 100" className="logo-svg" style={{ width: '40px', height: '40px', margin: 0 }}>
            <defs>
              <linearGradient id="nav-logo-grad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#c084fc" />
                <stop offset="100%" stopColor="#818cf8" />
              </linearGradient>
            </defs>
            <circle cx="50" cy="50" r="45" fill="none" stroke="url(#nav-logo-grad)" strokeWidth="6" />
            <path d="M30 65 L50 35 L70 65 Z" fill="none" stroke="url(#nav-logo-grad)" strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" />
          </svg>
          <h3>Odoo HRMS</h3>
          <span className="badge employee">Portal</span>
        </div>
        
        {/* Navigation Tabs */}
        <nav style={{ display: 'flex', gap: '8px' }}>
          <button className={`subnav-tab ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            Dashboard
          </button>
          <button className={`subnav-tab ${activeTab === 'profile' ? 'active' : ''}`} onClick={() => setActiveTab('profile')}>
            My Profile
          </button>
          <button className={`subnav-tab ${activeTab === 'salary' ? 'active' : ''}`} onClick={() => setActiveTab('salary')}>
            Salary Info
          </button>
          <button className={`subnav-tab ${activeTab === 'documents' ? 'active' : ''}`} onClick={() => setActiveTab('documents')}>
            Documents
          </button>
        </nav>

        <div className="header-user">
          {/* Avatar overlaps list indicator matching top right in images */}
          <div className="header-users-circles">
            <div className="avatar-circle" style={{ background: '#ef4444' }}>H</div>
            <div className="avatar-circle" style={{ background: '#8b5cf6' }}>A</div>
            <div className="avatar-circle" style={{ background: '#3b82f6' }}>L</div>
            <div className="avatar-circle" style={{ background: '#10b981' }}>H</div>
            <div className="avatar-circle more">+112</div>
          </div>
          
          <div className="join-wrapper">
            <button className="join-btn">Join</button>
            <span className="join-btn-badge">3</span>
          </div>

          <span className="user-email" style={{ borderLeft: '1px solid rgba(255,255,255,0.1)', paddingLeft: '16px' }}>
            {profile?.fullName || user?.email}
          </span>
          <button className="btn logout-btn" onClick={logout}>Logout</button>
        </div>
      </header>

      {/* Main Alert Banners */}
      <div style={{ padding: '0 48px', marginTop: '24px' }}>
        {error && (
          <div className="alert error">
            <span className="alert-icon">⚠️</span>
            <span className="alert-msg">{error}</span>
          </div>
        )}
        {successMsg && (
          <div className="alert success">
            <span className="alert-icon">✅</span>
            <span className="alert-msg">{successMsg}</span>
          </div>
        )}
      </div>

      <main className="dashboard-main" style={{ display: 'block', padding: '24px 48px 60px' }}>
        
        {/* ==================== TAB: DASHBOARD ==================== */}
        {activeTab === 'dashboard' && (
          <div>
            <div className="glass-card welcome-card" style={{ maxWidth: 'none', marginBottom: '32px', padding: '36px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '24px' }}>
                <div 
                  className="profile-avatar"
                  style={
                    profile?.profilePicture && !profile.profilePicture.startsWith('linear')
                      ? { backgroundImage: `url(${profile.profilePicture})`, backgroundSize: 'cover', width: '90px', height: '90px' }
                      : { 
                          background: profile?.profilePicture || 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)', 
                          color: '#fff', 
                          width: '90px', 
                          height: '90px',
                          fontSize: '36px'
                        }
                  }
                >
                  {(!profile?.profilePicture || profile.profilePicture.startsWith('linear')) && getInitials()}
                </div>
                <div>
                  <h1 style={{ fontSize: '32px', margin: '0 0 8px 0' }}>Welcome Back, {profile?.firstName || 'Employee'}!</h1>
                  <p style={{ margin: 0, fontSize: '15px' }}>
                    Workspace environment is fully sync’d. You have access to profile parameters and read-only salary details.
                  </p>
                </div>
              </div>
            </div>

            {/* Stat Cards */}
            <div className="dashboard-grid">
              <div className="stat-card">
                <div className="stat-icon blue">📅</div>
                <div className="stat-details">
                  <span className="stat-label">Month Attendance</span>
                  <span className="stat-val">20 / 22 Days</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon purple">📨</div>
                <div className="stat-details">
                  <span className="stat-label">Pending Leaves</span>
                  <span className="stat-val">1 Request</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon green">💰</div>
                <div className="stat-details">
                  <span className="stat-label">Calculated Net Wage</span>
                  <span className="stat-val">₹{salary?.salaryStructure?.takeHomePay?.toLocaleString() || '46,800'}</span>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon orange">🎯</div>
                <div className="stat-details">
                  <span className="stat-label">Active Skills</span>
                  <span className="stat-val">{profile?.skills?.length || 0} Listed</span>
                </div>
              </div>
            </div>

            {/* Dashboard Columns (Quick Profile & Alerts Feed) */}
            <div className="dashboard-columns">
              {/* Profile Overview Card */}
              <div className="glass-card" style={{ maxWidth: 'none', padding: '32px' }}>
                <h3 className="card-title">Job & Location Details</h3>
                <div className="profile-meta-grid" style={{ gridTemplateColumns: 'repeat(3, 1fr)', background: 'transparent', padding: 0 }}>
                  <div className="meta-item">
                    <span className="meta-label">Job Title</span>
                    <span className="meta-value">{profile?.jobTitle}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Department</span>
                    <span className="meta-value">{profile?.department}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Company</span>
                    <span className="meta-value">{profile?.company}</span>
                  </div>
                  <div className="meta-item" style={{ marginTop: '16px' }}>
                    <span className="meta-label">Manager</span>
                    <span className="meta-value">{profile?.manager}</span>
                  </div>
                  <div className="meta-item" style={{ marginTop: '16px' }}>
                    <span className="meta-label">Office Location</span>
                    <span className="meta-value">{profile?.location}</span>
                  </div>
                  <div className="meta-item" style={{ marginTop: '16px' }}>
                    <span className="meta-label">Employee ID</span>
                    <span className="meta-value">{profile?.employeeId}</span>
                  </div>
                </div>
              </div>

              {/* Activity Timeline Card */}
              <div className="glass-card" style={{ maxWidth: 'none', padding: '32px' }}>
                <h3 className="card-title">Recent Activity</h3>
                <div className="timeline">
                  {alerts.map((item) => (
                    <div className="timeline-item" key={item.id}>
                      <span className="timeline-date">{item.date}</span>
                      <div className="timeline-content">
                        <span className="timeline-title">{item.title}</span>
                        <span className="timeline-desc">{item.desc}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ==================== TAB: MY PROFILE ==================== */}
        {activeTab === 'profile' && (
          <div className="profile-card-container">
            {/* Profile Picture & General Details Banner */}
            <div className="profile-main-header">
              <div className="profile-avatar-container">
                <div 
                  className="profile-avatar"
                  style={
                    profile?.profilePicture && !profile.profilePicture.startsWith('linear')
                      ? { backgroundImage: `url(${profile.profilePicture})`, backgroundSize: 'cover' }
                      : { background: profile?.profilePicture || 'linear-gradient(135deg, #7c3aed 0%, #db2777 100%)', color: '#fff' }
                  }
                >
                  {(!profile?.profilePicture || profile.profilePicture.startsWith('linear')) && getInitials()}
                </div>
                <div className="avatar-edit-overlay" onClick={() => setShowAvatarModal(true)}>
                  ✏️
                </div>
              </div>

              <div className="profile-header-meta">
                <div className="meta-group-primary">
                  <h2>{profile?.firstName} {profile?.lastName}</h2>
                  <span className="badge hr" style={{ display: 'inline-block', margin: '4px 0 10px 0' }}>
                    {profile?.jobTitle}
                  </span>
                  <div className="meta-text-muted">ID: {profile?.employeeId}</div>
                  <div className="meta-text-muted">Email: {profile?.personalEmail || user?.email}</div>
                </div>

                <div className="profile-meta-grid">
                  <div className="meta-item">
                    <span className="meta-label">Department</span>
                    <span className="meta-value">{profile?.department}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Location</span>
                    <span className="meta-value">{profile?.location}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Manager</span>
                    <span className="meta-value">{profile?.manager}</span>
                  </div>
                  <div className="meta-item">
                    <span className="meta-label">Company</span>
                    <span className="meta-value">{profile?.company}</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Profile sub-tab buttons */}
            <div className="profile-subtabs">
              <button className={`profile-subtab-btn ${profileSubtab === 'resume' ? 'active' : ''}`} onClick={() => setProfileSubtab('resume')}>
                Resume
              </button>
              <button className={`profile-subtab-btn ${profileSubtab === 'private' ? 'active' : ''}`} onClick={() => setProfileSubtab('private')}>
                Private Info
              </button>
              <button className={`profile-subtab-btn ${profileSubtab === 'salaryInfo' ? 'active' : ''}`} onClick={() => setProfileSubtab('salaryInfo')}>
                Salary Info
              </button>
              <button className={`profile-subtab-btn ${profileSubtab === 'security' ? 'active' : ''}`} onClick={() => setProfileSubtab('security')}>
                Security Settings
              </button>
            </div>

            {/* ================= SUB-TAB: RESUME ================= */}
            {profileSubtab === 'resume' && (
              <div className="resume-grid">
                {/* Left side text blocks */}
                <div>
                  {/* About Block */}
                  <div className="resume-section-box">
                    <div className="box-header">
                      <h4>About</h4>
                      <button className="box-edit-btn" onClick={() => setEditAbout(!editAbout)}>
                        {editAbout ? 'Cancel' : '✏️ Edit'}
                      </button>
                    </div>
                    {editAbout ? (
                      <div>
                        <textarea className="edit-textarea" value={aboutVal} onChange={(e) => setAboutVal(e.target.value)} />
                        <div className="edit-actions">
                          <button className="btn-sm save" onClick={saveAboutSection}>Save</button>
                        </div>
                      </div>
                    ) : (
                      <p className="box-text-content">{profile?.about || 'No summary details provided.'}</p>
                    )}
                  </div>

                  {/* What I Love Block */}
                  <div className="resume-section-box">
                    <div className="box-header">
                      <h4>What I love about my job</h4>
                      <button className="box-edit-btn" onClick={() => setEditJobLove(!editJobLove)}>
                        {editJobLove ? 'Cancel' : '✏️ Edit'}
                      </button>
                    </div>
                    {editJobLove ? (
                      <div>
                        <textarea className="edit-textarea" value={jobLoveVal} onChange={(e) => setJobLoveVal(e.target.value)} />
                        <div className="edit-actions">
                          <button className="btn-sm save" onClick={saveJobLoveSection}>Save</button>
                        </div>
                      </div>
                    ) : (
                      <p className="box-text-content">{profile?.whatILoveAboutMyJob || 'No details provided.'}</p>
                    )}
                  </div>

                  {/* Interests Block */}
                  <div className="resume-section-box">
                    <div className="box-header">
                      <h4>My interests and hobbies</h4>
                      <button className="box-edit-btn" onClick={() => setEditHobbies(!editHobbies)}>
                        {editHobbies ? 'Cancel' : '✏️ Edit'}
                      </button>
                    </div>
                    {editHobbies ? (
                      <div>
                        <textarea className="edit-textarea" value={hobbiesVal} onChange={(e) => setHobbiesVal(e.target.value)} />
                        <div className="edit-actions">
                          <button className="btn-sm save" onClick={saveHobbiesSection}>Save</button>
                        </div>
                      </div>
                    ) : (
                      <p className="box-text-content">{profile?.interestsHobbies || 'No hobby details provided.'}</p>
                    )}
                  </div>
                </div>

                {/* Right side Tag Lists (Skills & Certifications) */}
                <div>
                  <div className="resume-section-box">
                    <div className="box-header">
                      <h4>Skills</h4>
                    </div>
                    <div className="tag-list">
                      {profile?.skills?.map((skill) => (
                        <span className="tag" key={skill}>
                          {skill}
                          <button className="tag-remove-btn" onClick={() => removeSkillTag(skill)}>×</button>
                        </span>
                      ))}
                    </div>

                    {!showAddSkill ? (
                      <button className="add-tag-trigger-btn" style={{ marginTop: '16px' }} onClick={() => setShowAddSkill(true)}>
                        + Add Skills
                      </button>
                    ) : (
                      <div className="add-tag-wrapper">
                        <input 
                          type="text" 
                          placeholder="e.g. AWS" 
                          className="add-tag-input"
                          value={newSkill} 
                          onChange={(e) => setNewSkill(e.target.value)}
                        />
                        <button className="add-tag-btn" onClick={addSkillTag}>Add</button>
                        <button className="btn-sm cancel" onClick={() => { setShowAddSkill(false); setNewSkill(''); }}>Cancel</button>
                      </div>
                    )}
                  </div>

                  <div className="resume-section-box">
                    <div className="box-header">
                      <h4>Certifications</h4>
                    </div>
                    <div className="tag-list">
                      {profile?.certifications?.map((cert) => (
                        <span className="tag" key={cert}>
                          {cert}
                          <button className="tag-remove-btn" onClick={() => removeCertTag(cert)}>×</button>
                        </span>
                      ))}
                    </div>

                    {!showAddCert ? (
                      <button className="add-tag-trigger-btn" style={{ marginTop: '16px' }} onClick={() => setShowAddCert(true)}>
                        + Add Certification
                      </button>
                    ) : (
                      <div className="add-tag-wrapper">
                        <input 
                          type="text" 
                          placeholder="e.g. Certified Scrum Master" 
                          className="add-tag-input"
                          value={newCert} 
                          onChange={(e) => setNewCert(e.target.value)}
                        />
                        <button className="add-tag-btn" onClick={addCertTag}>Add</button>
                        <button className="btn-sm cancel" onClick={() => { setShowAddCert(false); setNewCert(''); }}>Cancel</button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}

            {/* ================= SUB-TAB: PRIVATE INFO ================= */}
            {profileSubtab === 'private' && (
              <div>
                {!editPrivate ? (
                  <div style={{ position: 'relative' }}>
                    <button 
                      className="btn primary" 
                      style={{ position: 'absolute', top: '-10px', right: 0, padding: '8px 20px', fontSize: '13px' }}
                      onClick={() => setEditPrivate(true)}
                    >
                      ✏️ Edit Information
                    </button>
                    
                    <div className="private-info-grid">
                      {/* Personal Column */}
                      <div className="private-column">
                        <h4>Private Profile details</h4>
                        <div className="field-details-list">
                          <div className="field-row">
                            <span className="field-label">Date of Birth</span>
                            <span className="field-value">
                              {profile?.dateOfBirth ? new Date(profile.dateOfBirth).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                            </span>
                          </div>
                          <div className="field-row">
                            <span className="field-label">Mobile Phone</span>
                            <span className="field-value">{profile?.phone || 'Not set'}</span>
                          </div>
                          <div className="field-row">
                            <span className="field-label">Nationality</span>
                            <span className="field-value">{profile?.nationality || 'Indian'}</span>
                          </div>
                          <div className="field-row">
                            <span className="field-label">Personal Email</span>
                            <span className="field-value">{profile?.personalEmail || 'Not set'}</span>
                          </div>
                          <div className="field-row">
                            <span className="field-label">Gender</span>
                            <span className="field-value">{profile?.gender || 'Male'}</span>
                          </div>
                          <div className="field-row">
                            <span className="field-label">Marital Status</span>
                            <span className="field-value">{profile?.maritalStatus || 'Single'}</span>
                          </div>
                          <div className="field-row read-only">
                            <span className="field-label">Date of Joining (Read-only)</span>
                            <span className="field-value">
                              {profile?.dateOfJoining ? new Date(profile.dateOfJoining).toLocaleDateString(undefined, { year: 'numeric', month: 'long', day: 'numeric' }) : 'N/A'}
                            </span>
                          </div>
                          <div className="field-row">
                            <span className="field-label">Residing Address</span>
                            <span className="field-value" style={{ maxWidth: '60%', textAlign: 'right' }}>
                              {profile?.residingAddress || 'Not set'}
                            </span>
                          </div>
                        </div>
                      </div>

                      {/* Bank Details Column */}
                      <div className="private-column">
                        <h4>Bank Accounts & Credentials</h4>
                        <div className="field-details-list">
                          <div className="field-row">
                            <span className="field-label">Bank Name</span>
                            <span className="field-value">{profile?.bankDetails?.bankName || 'N/A'}</span>
                          </div>
                          <div className="field-row">
                            <span className="field-label">Account Number</span>
                            <span className="field-value">{profile?.bankDetails?.accountNumber || 'N/A'}</span>
                          </div>
                          <div className="field-row">
                            <span className="field-label">IFSC Code</span>
                            <span className="field-value">{profile?.bankDetails?.ifscCode || 'N/A'}</span>
                          </div>
                          <div className="field-row">
                            <span className="field-label">PAN Number</span>
                            <span className="field-value">{profile?.bankDetails?.panNo || 'N/A'}</span>
                          </div>
                          <div className="field-row">
                            <span className="field-label">UAN Number</span>
                            <span className="field-value">{profile?.bankDetails?.uanNo || 'N/A'}</span>
                          </div>
                          <div className="field-row read-only">
                            <span className="field-label">Employee Code (Read-only)</span>
                            <span className="field-value highlight">{profile?.employeeId}</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <form onSubmit={handlePrivateFormSubmit} className="private-edit-form">
                    <div className="form-grid">
                      {/* Personal details fields */}
                      <div className="form-field-group">
                        <label>Mobile Number</label>
                        <input 
                          type="text" 
                          className="form-input-glow" 
                          value={privateFormData.phone}
                          onChange={(e) => setPrivateFormData({ ...privateFormData, phone: e.target.value })}
                        />
                      </div>
                      <div className="form-field-group">
                        <label>Personal Email</label>
                        <input 
                          type="email" 
                          className="form-input-glow" 
                          value={privateFormData.personalEmail}
                          onChange={(e) => setPrivateFormData({ ...privateFormData, personalEmail: e.target.value })}
                        />
                      </div>
                      <div className="form-field-group">
                        <label>Date of Birth</label>
                        <input 
                          type="date" 
                          className="form-input-glow" 
                          value={privateFormData.dateOfBirth ? privateFormData.dateOfBirth.slice(0, 10) : ''}
                          onChange={(e) => setPrivateFormData({ ...privateFormData, dateOfBirth: e.target.value })}
                        />
                      </div>
                      <div className="form-field-group">
                        <label>Nationality</label>
                        <input 
                          type="text" 
                          className="form-input-glow" 
                          value={privateFormData.nationality}
                          onChange={(e) => setPrivateFormData({ ...privateFormData, nationality: e.target.value })}
                        />
                      </div>
                      <div className="form-field-group">
                        <label>Gender</label>
                        <select 
                          className="form-input-glow"
                          value={privateFormData.gender}
                          onChange={(e) => setPrivateFormData({ ...privateFormData, gender: e.target.value })}
                        >
                          <option value="Male">Male</option>
                          <option value="Female">Female</option>
                          <option value="Other">Other</option>
                        </select>
                      </div>
                      <div className="form-field-group">
                        <label>Marital Status</label>
                        <select 
                          className="form-input-glow"
                          value={privateFormData.maritalStatus}
                          onChange={(e) => setPrivateFormData({ ...privateFormData, maritalStatus: e.target.value })}
                        >
                          <option value="Single">Single</option>
                          <option value="Married">Married</option>
                          <option value="Divorced">Divorced</option>
                        </select>
                      </div>
                      <div className="form-row-full form-field-group">
                        <label>Residing Address</label>
                        <input 
                          type="text" 
                          className="form-input-glow" 
                          value={privateFormData.residingAddress}
                          onChange={(e) => setPrivateFormData({ ...privateFormData, residingAddress: e.target.value })}
                        />
                      </div>

                      {/* Banking fields */}
                      <div className="form-row-full">
                        <h4 style={{ color: '#a855f7', marginTop: '20px', marginBottom: '10px' }}>Bank Credentials</h4>
                      </div>
                      <div className="form-field-group">
                        <label>Bank Name</label>
                        <input 
                          type="text" 
                          className="form-input-glow" 
                          value={privateFormData.bankDetails.bankName}
                          onChange={(e) => setPrivateFormData({ 
                            ...privateFormData, 
                            bankDetails: { ...privateFormData.bankDetails, bankName: e.target.value } 
                          })}
                        />
                      </div>
                      <div className="form-field-group">
                        <label>Account Number</label>
                        <input 
                          type="text" 
                          className="form-input-glow" 
                          value={privateFormData.bankDetails.accountNumber}
                          onChange={(e) => setPrivateFormData({ 
                            ...privateFormData, 
                            bankDetails: { ...privateFormData.bankDetails, accountNumber: e.target.value } 
                          })}
                        />
                      </div>
                      <div className="form-field-group">
                        <label>IFSC Code</label>
                        <input 
                          type="text" 
                          className="form-input-glow" 
                          value={privateFormData.bankDetails.ifscCode}
                          onChange={(e) => setPrivateFormData({ 
                            ...privateFormData, 
                            bankDetails: { ...privateFormData.bankDetails, ifscCode: e.target.value } 
                          })}
                        />
                      </div>
                      <div className="form-field-group">
                        <label>PAN Number</label>
                        <input 
                          type="text" 
                          className="form-input-glow" 
                          value={privateFormData.bankDetails.panNo}
                          onChange={(e) => setPrivateFormData({ 
                            ...privateFormData, 
                            bankDetails: { ...privateFormData.bankDetails, panNo: e.target.value } 
                          })}
                        />
                      </div>
                      <div className="form-field-group">
                        <label>UAN Number</label>
                        <input 
                          type="text" 
                          className="form-input-glow" 
                          value={privateFormData.bankDetails.uanNo}
                          onChange={(e) => setPrivateFormData({ 
                            ...privateFormData, 
                            bankDetails: { ...privateFormData.bankDetails, uanNo: e.target.value } 
                          })}
                        />
                      </div>
                    </div>

                    <div className="edit-actions" style={{ marginTop: '28px' }}>
                      <button type="submit" className="btn primary">Save Changes</button>
                      <button type="button" className="btn logout-btn" style={{ background: 'transparent' }} onClick={() => setEditPrivate(false)}>Cancel</button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* ================= SUB-TAB: SALARY INFO (READ-ONLY) ================= */}
            {profileSubtab === 'salaryInfo' && salary && (
              <div>
                <div className="salary-info-header">
                  <div>
                    <span className="meta-label">Calculated Month Wage</span>
                    <div className="salary-hero-amount">
                      ₹{salary.salaryStructure.monthWage.toLocaleString()}
                      <span>/ Month</span>
                    </div>
                  </div>
                  <div className="salary-hero-amount" style={{ fontSize: '28px', color: '#94a3b8' }}>
                    ₹{salary.salaryStructure.yearlyWage.toLocaleString()}
                    <span style={{ fontSize: '13px' }}>/ Year</span>
                  </div>
                </div>

                <div className="salary-meta-row">
                  <div className="salary-meta-item">
                    <span className="meta-label">Working Schedule</span>
                    <span className="meta-value">{salary.workingDaysPerWeek} Days / Week</span>
                  </div>
                  <div className="salary-meta-item">
                    <span className="meta-label">Break Time Duration</span>
                    <span className="meta-value">{salary.breakTimeHours} hr / Day</span>
                  </div>
                  <div className="salary-meta-item">
                    <span className="meta-label">Wage Type</span>
                    <span className="meta-value" style={{ color: '#10b981' }}>Fixed Wage</span>
                  </div>
                </div>

                {/* Salary breakdown table columns */}
                <div className="salary-table-grid">
                  {/* Earnings Components */}
                  <div className="salary-block">
                    <h4>Salary Components (Earnings)</h4>
                    
                    <div className="salary-component-row">
                      <div className="salary-component-meta">
                        <span className="component-title">Basic Salary</span>
                        <span className="component-val">₹{salary.salaryStructure.basic.toLocaleString()}</span>
                      </div>
                      <span className="component-desc">Defined 50% of Month Wage.</span>
                    </div>

                    <div className="salary-component-row">
                      <div className="salary-component-meta">
                        <span className="component-title">House Rent Allowance (HRA)</span>
                        <span className="component-val">₹{salary.salaryStructure.hra.toLocaleString()}</span>
                      </div>
                      <span className="component-desc">Provided 50% of the Basic Salary.</span>
                    </div>

                    <div className="salary-component-row">
                      <div className="salary-component-meta">
                        <span className="component-title">Standard Allowance</span>
                        <span className="component-val">₹{salary.salaryStructure.standardAllowance.toLocaleString()}</span>
                      </div>
                      <span className="component-desc">Calculated at 16.67% of Basic Salary.</span>
                    </div>

                    <div className="salary-component-row">
                      <div className="salary-component-meta">
                        <span className="component-title">Performance Bonus</span>
                        <span className="component-val">₹{salary.salaryStructure.performanceBonus.toLocaleString()}</span>
                      </div>
                      <span className="component-desc">Variable component calculated at 8.33% of Basic.</span>
                    </div>

                    <div className="salary-component-row">
                      <div className="salary-component-meta">
                        <span className="component-title">Leave Travel Allowance</span>
                        <span className="component-val">₹{salary.salaryStructure.leaveTravelAllowance.toLocaleString()}</span>
                      </div>
                      <span className="component-desc">LTA allowance configured at 8.33% of Basic.</span>
                    </div>

                    <div className="salary-component-row">
                      <div className="salary-component-meta">
                        <span className="component-title">Fixed Allowance</span>
                        <span className="component-val">₹{salary.salaryStructure.fixedAllowance.toLocaleString()}</span>
                      </div>
                      <span className="component-desc">Portion of wages remaining after accounting for all components.</span>
                    </div>
                  </div>

                  {/* Deductions & Contributions */}
                  <div className="salary-block">
                    <h4>Contributions & Deductions</h4>
                    
                    <div className="salary-component-row">
                      <div className="salary-component-meta">
                        <span className="component-title">PF Contribution (Employee)</span>
                        <span className="component-val" style={{ color: '#fca5a5' }}>- ₹{salary.salaryStructure.employeePF.toLocaleString()}</span>
                      </div>
                      <span className="component-desc">Employee contribution calculated at 12% of Basic.</span>
                    </div>

                    <div className="salary-component-row">
                      <div className="salary-component-meta">
                        <span className="component-title">PF Contribution (Employer)</span>
                        <span className="component-val">₹{salary.salaryStructure.employerPF.toLocaleString()}</span>
                      </div>
                      <span className="component-desc">Matching contribution paid by the employer (12% of Basic).</span>
                    </div>

                    <div className="salary-component-row">
                      <div className="salary-component-meta">
                        <span className="component-title">Professional Tax</span>
                        <span className="component-val" style={{ color: '#fca5a5' }}>- ₹{salary.salaryStructure.professionalTax.toLocaleString()}</span>
                      </div>
                      <span className="component-desc">Professional Tax deducted from Gross Salary.</span>
                    </div>

                    <div style={{ marginTop: '28px', borderTop: '2px dashed rgba(255,255,255,0.08)', paddingTop: '16px' }}>
                      <div className="salary-component-meta">
                        <span className="component-title" style={{ fontSize: '16px', color: '#10b981' }}>Take Home Pay Estimate</span>
                        <span className="component-val" style={{ fontSize: '18px', color: '#10b981' }}>
                          ₹{salary.salaryStructure.takeHomePay.toLocaleString()}
                        </span>
                      </div>
                      <span className="component-desc">Estimated net take-home salary after PF and tax deductions.</span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* ================= SUB-TAB: SECURITY ================= */}
            {profileSubtab === 'security' && (
              <div style={{ maxWidth: '500px' }}>
                <div className="security-warning-box">
                  <div className="security-warning-title">🛡️ Security Protocol</div>
                  You can change your portal workspace password here. Make sure your password has at least 6 characters and is different from the current one.
                </div>

                {pwdError && (
                  <div className="alert error">
                    <span className="alert-icon">⚠️</span>
                    <span className="alert-msg">{pwdError}</span>
                  </div>
                )}

                <form onSubmit={handlePasswordChangeSubmit} className="auth-form" style={{ gap: '16px' }}>
                  <div className="form-field-group">
                    <label>Current Password</label>
                    <input 
                      type="password" 
                      className="form-input-glow" 
                      value={pwdForm.currentPassword}
                      onChange={(e) => setPwdForm({ ...pwdForm, currentPassword: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-field-group">
                    <label>New Password</label>
                    <input 
                      type="password" 
                      className="form-input-glow" 
                      value={pwdForm.newPassword}
                      onChange={(e) => setPwdForm({ ...pwdForm, newPassword: e.target.value })}
                      required
                    />
                  </div>
                  <div className="form-field-group">
                    <label>Confirm New Password</label>
                    <input 
                      type="password" 
                      className="form-input-glow" 
                      value={pwdForm.confirmPassword}
                      onChange={(e) => setPwdForm({ ...pwdForm, confirmPassword: e.target.value })}
                      required
                    />
                  </div>

                  <button type="submit" className="btn primary" style={{ marginTop: '12px' }} disabled={pwdLoading}>
                    {pwdLoading ? <span className="spinner-inline"></span> : 'Change Password'}
                  </button>
                </form>
              </div>
            )}
          </div>
        )}

        {/* ==================== TAB: SALARY DETAILS (STAND-ALONE PAYSHEET) ==================== */}
        {activeTab === 'salary' && salary && (
          <div className="payslip-container glass">
            <div className="payslip-title">Official Salary Payslip Worksheet</div>
            
            <div style={{ borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '16px', marginBottom: '24px' }}>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
                <div>
                  <div style={{ color: '#64748b', fontSize: '12px', fontWeight: 'bold' }}>EMPLOYEE NAME</div>
                  <div style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>{salary.fullName}</div>
                  <div style={{ color: '#cbd5e1', fontSize: '14px', marginTop: '4px' }}>ID: {salary.employeeId}</div>
                </div>
                <div style={{ textAlign: 'right' }}>
                  <div style={{ color: '#64748b', fontSize: '12px', fontWeight: 'bold' }}>FINANCIAL SUMMARY</div>
                  <div style={{ fontSize: '24px', fontWeight: '800', color: '#a855f7' }}>₹{salary.salaryStructure.monthWage.toLocaleString()} / Month</div>
                  <div style={{ color: '#34d399', fontSize: '14px', marginTop: '4px' }}>₹{salary.salaryStructure.yearlyWage.toLocaleString()} / Year</div>
                </div>
              </div>
            </div>

            {/* Structured Table */}
            <div style={{ background: 'rgba(7, 8, 18, 0.4)', borderRadius: '12px', padding: '24px', border: '1px solid rgba(255,255,255,0.04)' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                <thead>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: '8px' }}>
                    <th style={{ padding: '12px 6px', color: '#a855f7', textTransform: 'uppercase', fontSize: '12px' }}>Salary Component</th>
                    <th style={{ padding: '12px 6px', color: '#a855f7', textTransform: 'uppercase', fontSize: '12px' }}>Formula & Description</th>
                    <th style={{ padding: '12px 6px', color: '#a855f7', textTransform: 'uppercase', fontSize: '12px', textAlign: 'right' }}>Monthly Amount</th>
                  </tr>
                </thead>
                <tbody>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '14px 6px', fontWeight: 'bold', color: 'white' }}>Basic Salary</td>
                    <td style={{ padding: '14px 6px', color: '#94a3b8', fontSize: '13px' }}>50% of the Monthly Gross Wage</td>
                    <td style={{ padding: '14px 6px', textAlign: 'right', fontWeight: 'bold', color: '#34d399' }}>₹{salary.salaryStructure.basic.toLocaleString()}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '14px 6px', fontWeight: 'bold', color: 'white' }}>House Rent Allowance (HRA)</td>
                    <td style={{ padding: '14px 6px', color: '#94a3b8', fontSize: '13px' }}>50% of the Basic Salary</td>
                    <td style={{ padding: '14px 6px', textAlign: 'right', fontWeight: 'bold', color: '#34d399' }}>₹{salary.salaryStructure.hra.toLocaleString()}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '14px 6px', fontWeight: 'bold', color: 'white' }}>Standard Allowance</td>
                    <td style={{ padding: '14px 6px', color: '#94a3b8', fontSize: '13px' }}>16.67% of the Basic Salary</td>
                    <td style={{ padding: '14px 6px', textAlign: 'right', fontWeight: 'bold', color: '#34d399' }}>₹{salary.salaryStructure.standardAllowance.toLocaleString()}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '14px 6px', fontWeight: 'bold', color: 'white' }}>Performance Bonus</td>
                    <td style={{ padding: '14px 6px', color: '#94a3b8', fontSize: '13px' }}>8.33% of the Basic Salary</td>
                    <td style={{ padding: '14px 6px', textAlign: 'right', fontWeight: 'bold', color: '#34d399' }}>₹{salary.salaryStructure.performanceBonus.toLocaleString()}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '14px 6px', fontWeight: 'bold', color: 'white' }}>Leave Travel Allowance (LTA)</td>
                    <td style={{ padding: '14px 6px', color: '#94a3b8', fontSize: '13px' }}>8.33% of the Basic Salary</td>
                    <td style={{ padding: '14px 6px', textAlign: 'right', fontWeight: 'bold', color: '#34d399' }}>₹{salary.salaryStructure.leaveTravelAllowance.toLocaleString()}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <td style={{ padding: '14px 6px', fontWeight: 'bold', color: 'white' }}>Fixed Allowance</td>
                    <td style={{ padding: '14px 6px', color: '#94a3b8', fontSize: '13px' }}>Remainder after accounting for all defined components</td>
                    <td style={{ padding: '14px 6px', textAlign: 'right', fontWeight: 'bold', color: '#34d399' }}>₹{salary.salaryStructure.fixedAllowance.toLocaleString()}</td>
                  </tr>
                  
                  {/* Deductions Header Row */}
                  <tr>
                    <td colSpan="3" style={{ padding: '16px 6px 8px 6px', fontWeight: 'bold', color: '#f43f5e', fontSize: '13px', letterSpacing: '0.5px' }}>DEDUCTIONS & TAXATION</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.03)' }}>
                    <td style={{ padding: '14px 6px', fontWeight: 'bold', color: 'white' }}>Provident Fund (Employee)</td>
                    <td style={{ padding: '14px 6px', color: '#94a3b8', fontSize: '13px' }}>12% of the Basic Salary</td>
                    <td style={{ padding: '14px 6px', textAlign: 'right', fontWeight: 'bold', color: '#fb7185' }}>- ₹{salary.salaryStructure.employeePF.toLocaleString()}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
                    <td style={{ padding: '14px 6px', fontWeight: 'bold', color: 'white' }}>Professional Tax</td>
                    <td style={{ padding: '14px 6px', color: '#94a3b8', fontSize: '13px' }}>Fixed municipal employment deduction</td>
                    <td style={{ padding: '14px 6px', textAlign: 'right', fontWeight: 'bold', color: '#fb7185' }}>- ₹{salary.salaryStructure.professionalTax.toLocaleString()}</td>
                  </tr>

                  {/* Summary Net Row */}
                  <tr>
                    <td style={{ padding: '20px 6px', fontSize: '16px', fontWeight: 'bold', color: 'white' }}>Estimated Net Take Home</td>
                    <td style={{ padding: '20px 6px', color: '#94a3b8', fontSize: '13px' }}>Gross Monthly wage minus mandatory deductions</td>
                    <td style={{ padding: '20px 6px', textAlign: 'right', fontSize: '20px', fontWeight: '800', color: '#10b981' }}>₹{salary.salaryStructure.takeHomePay.toLocaleString()}</td>
                  </tr>
                </tbody>
              </table>
            </div>
            
            <div style={{ marginTop: '24px', display: 'flex', justifyContent: 'flex-end' }}>
              <button className="btn primary" onClick={() => window.print()} style={{ fontSize: '13px', padding: '10px 24px' }}>
                🖨️ Print Slip Worksheet
              </button>
            </div>
          </div>
        )}

        {/* ==================== TAB: DOCUMENTS ==================== */}
        {activeTab === 'documents' && (
          <div>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
              <div>
                <h2 style={{ margin: 0 }}>My Documents</h2>
                <p className="meta-text-muted" style={{ margin: 0 }}>View, download or upload documents required for onboarding and verification.</p>
              </div>
              
              <label className="btn primary" style={{ cursor: 'pointer', padding: '10px 20px', fontSize: '13px' }}>
                📁 Upload Document
                <input type="file" onChange={handleDocUpload} style={{ display: 'none' }} />
              </label>
            </div>

            <div className="docs-grid">
              {documents.map((doc) => (
                <div className="doc-card" key={doc.id}>
                  <div className="doc-header">
                    <span className="doc-icon">{doc.type === 'pdf' ? '📄' : '🖼️'}</span>
                    <div className="doc-meta">
                      <span className="doc-name">{doc.name}</span>
                      <span className="doc-type">{doc.type} • {doc.size}</span>
                    </div>
                  </div>
                  <div className="doc-actions">
                    <button className="doc-action-btn" onClick={() => alert(`Opening viewer for ${doc.name}`)}>
                      👁️ View
                    </button>
                    <button className="doc-action-btn download" onClick={() => alert(`Downloading ${doc.name}...`)}>
                      📥 Download
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </main>

      {/* ================= MODAL: AVATAR SELECTION ================= */}
      {showAvatarModal && (
        <div className="avatar-presets-modal">
          <div className="avatar-modal-card">
            <div className="avatar-modal-title">Customize Profile Picture</div>
            
            {/* Upload form */}
            <label className="avatar-upload-label">
              📤 Upload Custom Image
              <input type="file" accept="image/*" onChange={(e) => handleAvatarChange(e, 'file')} />
            </label>

            <div style={{ textAlign: 'center', color: '#64748b', fontSize: '12px', fontWeight: 'bold', marginBottom: '16px' }}>
              OR SELECT A COLORFUL PRESET
            </div>

            <div className="avatar-grid">
              {avatarPresets.map((preset) => (
                <div 
                  key={preset.name}
                  className={`avatar-preset-option ${profile?.profilePicture === preset.style.background ? 'selected' : ''}`}
                  style={preset.style}
                  onClick={() => handleAvatarChange(preset.style.background, 'preset')}
                >
                  {preset.emoji}
                </div>
              ))}
            </div>

            <div className="edit-actions">
              <button className="btn logout-btn" style={{ padding: '8px 16px', fontSize: '12.5px' }} onClick={() => setShowAvatarModal(false)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
