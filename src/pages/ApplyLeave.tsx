import React, { useState } from 'react';
import { LeaveForm } from '../components/LeaveForm';
import { Calendar, AlertCircle } from 'lucide-react';

export const ApplyLeave: React.FC = () => {
  const [successMsg, setSuccessMsg] = useState(false);

  const handleSuccess = () => {
    setSuccessMsg(true);
    setTimeout(() => setSuccessMsg(false), 5000);
  };

  return (
    <div className="space-y-6 fade-in-slide">
      
      {/* Banner */}
      <div className="relative rounded-3xl overflow-hidden p-6 md:p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800/80 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -z-10" />
        
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400">
            <Calendar className="w-3.5 h-3.5" />
            Apply For Leave
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Leave Request Application
          </h2>
          <p className="text-sm text-slate-400 max-w-xl">
            Submit a new application by specifying leave type categories, start dates, and end dates.
          </p>
        </div>
      </div>

      {successMsg && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/20 rounded-2xl flex items-center gap-2.5 text-xs font-bold text-emerald-400 animate-fade-in">
          <AlertCircle className="w-4.5 h-4.5" />
          Leave request submitted successfully.
        </div>
      )}

      {/* Leave Form Container */}
      <div className="glass-card p-6 md:p-8 rounded-3xl space-y-4">
        <LeaveForm onSuccess={handleSuccess} />
      </div>

    </div>
  );
};
