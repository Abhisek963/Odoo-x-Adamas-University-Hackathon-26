import React from 'react';

export default function ProfileHeader({ activeTab, setActiveTab }) {
  // Simple fallback for profile picture editing
  const handlePictureChange = (e) => {
    alert("Profile picture upload triggered! (Allowed field)");
  };

  return (
    <div style={{ backgroundColor: '#1e1e1e', color: '#fff', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
      {/* Navigation Header */}
      <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid #333', paddingBottom: '10px', marginBottom: '20px' }}>
        <div style={{ display: 'flex', gap: '20px', fontWeight: 'bold' }}>
          <span>Company Logo</span>
          <span style={{ cursor: 'pointer' }}>Employees</span>
          <span style={{ cursor: 'pointer' }}>Attendance</span>
          <span style={{ cursor: 'pointer' }}>Time Off</span>
        </div>
        <div style={{ display: 'flex', gap: '15px' }}>
          <div style={{ width: '20px', height: '20px', borderRadius: '50%', backgroundColor: '#ff8a80' }}></div>
          <div style={{ width: '20px', height: '20px', backgroundColor: '#2b5c8f' }}></div>
        </div>
      </div>

      <h2>My Profile</h2>
      <hr style={{ borderColor: '#333' }} />

      {/* Main Profile Header Info */}
      <div style={{ display: 'flex', gap: '40px', marginTop: '20px', alignItems: 'center' }}>
        <div style={{ position: 'relative', width: '120px', height: '120px' }}>
          <div style={{ width: '100%', height: '100%', borderRadius: '50%', backgroundColor: '#423232', display: 'flex', alignItems: 'center', justifyContent: 'center', border: '2px solid #555' }}>
            <span style={{ fontSize: '30px' }}>👤</span>
          </div>
          <label style={{ position: 'absolute', bottom: '0', right: '0', backgroundColor: '#333', padding: '5px', borderRadius: '50%', cursor: 'pointer', border: '1px solid #555' }}>
            ✏️
            <input type="file" onChange={handlePictureChange} style={{ display: 'none' }} accept="image/*" />
          </label>
        </div>

        <div style={{ flex: 1, display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <h1 style={{ margin: '0 0 10px 0', borderBottom: '2px solid #fff', display: 'inline-block' }}>My Name</h1>
            <p style={{ margin: '5px 0' }}><strong>Login ID:</strong> emp_001</p>
            <p style={{ margin: '5px 0' }}><strong>Email:</strong> employee@company.com</p>
            <p style={{ margin: '5px 0' }}><strong>Mobile:</strong> +1234567890</p>
          </div>
          <div>
            <p style={{ margin: '5px 0', borderBottom: '1px dashed #555' }}><strong>Company:</strong> Adamas University</p>
            <p style={{ margin: '5px 0', borderBottom: '1px dashed #555' }}><strong>Department:</strong> Engineering</p>
            <p style={{ margin: '5px 0', borderBottom: '1px dashed #555' }}><strong>Manager:</strong> John Doe</p>
            <p style={{ margin: '5px 0', borderBottom: '1px dashed #555' }}><strong>Location:</strong> Campus Main</p>
          </div>
        </div>
      </div>

      {/* Tab Selectors */}
      <div style={{ display: 'flex', gap: '5px', marginTop: '30px' }}>
        {['Resume', 'Private Info', 'Salary Info'].map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            style={{
              padding: '10px 20px',
              backgroundColor: activeTab === tab ? '#333' : '#1e1e1e',
              color: '#fff',
              border: '1px solid #555',
              borderBottom: activeTab === tab ? 'none' : '1px solid #555',
              cursor: 'pointer',
              fontWeight: activeTab === tab ? 'bold' : 'normal',
              borderRadius: '4px 4px 0 0'
            }}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  );
}