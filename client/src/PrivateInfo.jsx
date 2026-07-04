import React, { useState } from 'react';

export default function PrivateInfo() {
  // State for fields employees are allowed to edit
  const [editableInfo, setEditableInfo] = useState({
    residingAddress: '123 Innovation Way, Tech District',
    personalEmail: 'myprimaryemail@gmail.com',
    maritalStatus: 'Single'
  });

  const handleChange = (e) => {
    setEditableInfo({ ...editableInfo, [e.target.name]: e.target.value });
  };

  return (
    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '30px', backgroundColor: '#1e1e1e', color: '#fff', padding: '20px', borderRadius: '8px', border: '1px solid #333' }}>
      
      {/* Left Column: Personal Metadata */}
      <div>
        <h3>Personal Details</h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
          <label>Date of Birth: <span style={{ color: '#aaa', marginLeft: '10px' }}>January 15, 1995</span></label>
          
          <label style={{ display: 'flex', flexDirection: 'column' }}>
            Residing Address (Editable):
            <input 
              type="text" 
              name="residingAddress" 
              value={editableInfo.residingAddress} 
              onChange={handleChange} 
              style={{ backgroundColor: '#2a2a2a', color: '#fff', border: '1px solid #555', padding: '6px', borderRadius: '4px', marginTop: '4px' }} 
            />
          </label>

          <label>Nationality: <span style={{ color: '#aaa', marginLeft: '10px' }}>Global citizen</span></label>
          
          <label style={{ display: 'flex', flexDirection: 'column' }}>
            Personal Email (Editable):
            <input 
              type="email" 
              name="personalEmail" 
              value={editableInfo.personalEmail} 
              onChange={handleChange} 
              style={{ backgroundColor: '#2a2a2a', color: '#fff', border: '1px solid #555', padding: '6px', borderRadius: '4px', marginTop: '4px' }} 
            />
          </label>

          <label>Gender: <span style={{ color: '#aaa', marginLeft: '10px' }}>Male</span></label>
          
          <label style={{ display: 'flex', flexDirection: 'column' }}>
            Marital Status (Editable):
            <select 
              name="maritalStatus" 
              value={editableInfo.maritalStatus} 
              onChange={handleChange} 
              style={{ backgroundColor: '#2a2a2a', color: '#fff', border: '1px solid #555', padding: '6px', borderRadius: '4px', marginTop: '4px' }}
            >
              <option value="Single">Single</option>
              <option value="Married">Married</option>
              <option value="Other">Other</option>
            </select>
          </label>

          <label>Date of Joining: <span style={{ color: '#aaa', marginLeft: '10px' }}>August 1, 2022</span></label>
        </div>
      </div>

      {/* Right Column: Bank Details & Documents */}
      <div>
        <h3>Bank Details</h3>
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px', color: '#aaa', marginBottom: '25px' }}>
          <div><strong>Bank Name:</strong> State Financial</div>
          <div><strong>Account Number:</strong> *******4920</div>
          <div><strong>IFSC Code:</strong> STFIN000234</div>
          <div><strong>PAN No:</strong> ABCDE1234F</div>
          <div><strong>UAN No:</strong> 100987654321</div>
          <div><strong>Emp Code:</strong> EMP-001</div>
        </div>

        <h3>Documents & Attachments</h3>
        <ul style={{ listStyleType: 'none', padding: 0 }}>
          <li style={{ padding: '8px 0', borderBottom: '1px solid #333' }}>📄 Identification_Proof.pdf <span style={{ color: '#64b5f6', cursor: 'pointer', marginLeft: '10px' }}>(Download)</span></li>
          <li style={{ padding: '8px 0', borderBottom: '1px solid #333' }}>📄 Graduation_Degree.pdf <span style={{ color: '#64b5f6', cursor: 'pointer', marginLeft: '10px' }}>(Download)</span></li>
        </ul>
      </div>
    </div>
  );
}