import React from 'react';
import { useLeave } from '../context/LeaveContext';
import { CheckCircle2, Clock, XCircle, AlertTriangle } from 'lucide-react';

export const RecentRequestsTable: React.FC = () => {
  const { leaveRequests } = useLeave();

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Approved
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-400">
            <Clock className="w-3.5 h-3.5 animate-pulse" />
            Pending
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-xs font-bold text-rose-400">
            <XCircle className="w-3.5 h-3.5" />
            Rejected
          </span>
        );
      case 'cancelled':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700/60 text-xs font-bold text-slate-400">
            Cancelled
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="glass-card rounded-3xl overflow-hidden shadow-2xl">
      <div className="overflow-x-auto">
        <table className="w-full text-left border-collapse">
          <thead>
            <tr className="border-b border-slate-800 bg-slate-900/30 text-slate-400 font-bold text-xs uppercase tracking-wider">
              <th className="py-4.5 px-6">Employee</th>
              <th className="py-4.5 px-6">Leave Details</th>
              <th className="py-4.5 px-6">Duration</th>
              <th className="py-4.5 px-6">Reason</th>
              <th className="py-4.5 px-6">Applied Date</th>
              <th className="py-4.5 px-6">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-800/50 text-sm font-medium">
            {leaveRequests.slice(0, 5).map((req) => (
              <tr key={req.id} className="hover:bg-slate-900/20 transition-colors">
                {/* Employee details */}
                <td className="py-4 px-6 whitespace-nowrap">
                  <div className="flex items-center gap-3">
                    <img 
                      src={req.employeeAvatar} 
                      alt={req.employeeName} 
                      className="w-10 h-10 rounded-full object-cover border border-slate-800"
                    />
                    <div>
                      <h4 className="font-bold text-sm text-slate-200">{req.employeeName}</h4>
                      <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">
                        {req.employeeDepartment}
                      </span>
                    </div>
                  </div>
                </td>

                {/* Category & Dates */}
                <td className="py-4 px-6 whitespace-nowrap">
                  <div className="space-y-1">
                    <span className="block font-bold text-slate-200 capitalize text-sm">
                      {req.leaveType} Leave
                    </span>
                    <span className="block text-xs text-slate-500 font-semibold">
                      {req.startDate} to {req.endDate}
                    </span>
                  </div>
                </td>

                {/* Duration */}
                <td className="py-4 px-6 whitespace-nowrap">
                  <span className="text-slate-300 font-bold">{req.duration}</span>
                  <span className="text-xs text-slate-500 font-medium"> {req.duration === 1 ? 'day' : 'days'}</span>
                </td>

                {/* Reason */}
                <td className="py-4 px-6">
                  <div className="max-w-xs truncate text-slate-300 text-xs font-semibold">
                    {req.reason}
                  </div>
                </td>

                {/* Applied Date */}
                <td className="py-4 px-6 whitespace-nowrap text-xs text-slate-500">
                  {req.appliedDate}
                </td>

                {/* Status Badge */}
                <td className="py-4 px-6 whitespace-nowrap">
                  {getStatusBadge(req.status)}
                </td>
              </tr>
            ))}

            {leaveRequests.length === 0 && (
              <tr>
                <td colSpan={6} className="text-center py-16 text-slate-500 font-semibold">
                  <AlertTriangle className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                  No leave requests found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};
