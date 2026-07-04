import React from 'react';
import { Camera } from 'lucide-react';

export default function ProfileHeader() {
  return (
    <div className="bg-[#1e1e1e] p-6 rounded-lg border border-gray-800 grid grid-cols-1 md:grid-cols-3 gap-6 items-center">
      {/* Avatar Identification Column */}
      <div className="flex items-center space-x-4 col-span-1 border-r-0 md:border-r border-gray-800 pr-4">
        <div className="relative group shrink-0">
          <div className="w-20 h-20 rounded-full bg-[#2a2a2a] border-2 border-gray-700 flex items-center justify-center text-gray-500">
            <Camera size={24} />
          </div>
        </div>
        <div>
          <h2 className="text-xl font-bold tracking-tight text-white">Ananya Sharma</h2>
          <p className="text-xs text-gray-500 mt-0.5 font-mono">ID: EMP-2026-894</p>
        </div>
      </div>

      {/* Meta Placement Details Column */}
      <div className="grid grid-cols-2 gap-4 col-span-2 text-xs">
        <div>
          <span className="block text-gray-500 uppercase tracking-wider font-semibold">Company</span>
          <span className="text-gray-300 font-medium">Enterprise Solutions Ltd</span>
        </div>
        <div>
          <span className="block text-gray-500 uppercase tracking-wider font-semibold">Department</span>
          <span className="text-gray-300 font-medium">Core Software Engineering</span>
        </div>
        <div>
          <span className="block text-gray-500 uppercase tracking-wider font-semibold">Reporting Manager</span>
          <span className="text-gray-300 font-medium">Sarah Jenkins (VP)</span>
        </div>
        <div>
          <span className="block text-gray-500 uppercase tracking-wider font-semibold">Work Location</span>
          <span className="text-gray-300 font-medium">Remote / Mumbai HQ</span>
        </div>
      </div>
    </div>
  );
}