import React, { useState } from 'react';

export default function PrivateInfo() {
  // Personal inputs are allowed to change
  const [personal, setPersonal] = useState({
    phone: '+91 98765 43210',
    address: 'Flat 402, Skyline Towers, Hitech City, Hyderabad, 500081',
    email: 'ananya.sharma@enterprise.com',
    dob: '1998-05-14',
    nationality: 'Indian',
    gender: 'Female',
    maritalStatus: 'Single',
    joiningDate: '2024-08-12'
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 text-sm">
      {/* Allowed Fields for Editing */}
      <div className="space-y-4">
        <h3 className="text-xs font-bold uppercase tracking-wider text-blue-400 border-b border-gray-800 pb-2">Editable Personal Details</h3>
        
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Mobile Contact</label>
            <input 
              type="text" 
              value={personal.phone} 
              onChange={(e) => setPersonal({...personal, phone: e.target.value})}
              className="w-full bg-[#252525] border border-gray-700 rounded p-2 text-white focus:outline-none focus:border-blue-500 transition font-mono" 
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-gray-500 mb-1">Personal Email</label>
            <input 
              type="email" 
              value={personal.email} 
              onChange={(e) => setPersonal({...personal, email: e.target.value})}
              className="w-full bg-[#252525] border border-gray-700 rounded p-2 text-white focus:outline-none focus:border-blue-500 transition" 
            />
          </div>
        </div>

        <div>
          <label className="block text-xs font-semibold text-gray-500 mb-1">Residing Address</label>
          <textarea 
            rows="2"
            value={personal.address} 
            onChange={(e) => setPersonal({...personal, address: e.target.value})}
            className="w-full bg-[#252525] border border-gray-700 rounded p-2 text-white focus:outline-none focus:border-blue-500 transition" 
          />
        </div>

        <div className="grid grid-cols-2 gap-4 pt-2 text-xs">
          <div><span className="text-gray-500 block">Date of Birth</span><span className="text-gray-300 font-mono">{personal.dob}</span></div>
          <div><span className="text-gray-500 block">Nationality</span><span className="text-gray-300">{personal.nationality}</span></div>
          <div><span className="text-gray-500 block">Gender</span><span className="text-gray-300">{personal.gender}</span></div>
          <div><span className="text-gray-500 block">Marital Status</span><span className="text-gray-300">{personal.maritalStatus}</span></div>
        </div>
      </div>

      {/* STRICTLY READ-ONLY BANK DETAILS SCHEMAS */}
      <div className="bg-[#181818] p-5 rounded border border-gray-800 space-y-4">
        <div className="flex justify-between items-center border-b border-gray-800 pb-2">
          <h3 className="text-xs font-bold uppercase tracking-wider text-amber-500">Corporate Banking Registration</h3>
          <span className="text-[10px] bg-gray-800 text-gray-400 px-2 py-0.5 rounded uppercase font-bold tracking-widest">Locked</span>
        </div>

        <div className="space-y-3 font-mono text-xs">
          <div className="flex justify-between border-b border-gray-800/40 pb-1"><span className="text-gray-500">Bank Name</span><span className="text-gray-300">HDFC Bank Ltd</span></div>
          <div className="flex justify-between border-b border-gray-800/40 pb-1"><span className="text-gray-500">Account Number</span><span className="text-gray-300">XXXX XXXX 5019 2841</span></div>
          <div className="flex justify-between border-b border-gray-800/40 pb-1"><span className="text-gray-500">IFSC Code</span><span className="text-gray-300">HDFC0000112</span></div>
          <div className="flex justify-between border-b border-gray-800/40 pb-1"><span className="text-gray-500">PAN Number</span><span className="text-gray-300">BPWPSXXXXK</span></div>
          <div className="flex justify-between border-b border-gray-800/40 pb-1"><span className="text-gray-500">UAN Registration</span><span className="text-gray-300">10092415XXXX</span></div>
          <div className="flex justify-between pt-1"><span className="text-gray-500">Date of Joining</span><span className="text-gray-300">{personal.joiningDate}</span></div>
        </div>
      </div>
    </div>
  );
}