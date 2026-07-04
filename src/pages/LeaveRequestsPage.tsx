import React, { useState } from 'react';
import { LeaveRequestsTable } from '../components/LeaveRequestsTable';
import { RequestDetailsModal } from '../components/RequestDetailsModal';
import { Calendar, Inbox } from 'lucide-react';
import type { LeaveRequest } from '../types';

export const LeaveRequestsPage: React.FC = () => {
  const [selectedRequest, setSelectedRequest] = useState<LeaveRequest | null>(null);

  return (
    <div className="space-y-6 fade-in-slide">
      
      {/* Banner */}
      <div className="relative rounded-3xl overflow-hidden p-6 md:p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800/80 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -z-10" />
        
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400">
            <Inbox className="w-3.5 h-3.5" />
            Review Queue Active
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Leave Request Queue
          </h2>
          <p className="text-sm text-slate-400 max-w-xl">
            Process incoming leave applications, write administrative remarks, and Approve or Reject requests.
          </p>
        </div>
      </div>

      {/* Table grid */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-400" />
          Awaiting Actions Review
        </h3>

        <div className="glass-card rounded-3xl overflow-hidden shadow-2xl">
          <LeaveRequestsTable onViewDetails={(req) => setSelectedRequest(req)} />
        </div>
      </div>

      {/* Details popover */}
      <RequestDetailsModal 
        request={selectedRequest} 
        onClose={() => setSelectedRequest(null)} 
      />

    </div>
  );
};
