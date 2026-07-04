import React, { useState } from 'react';
import type { LeaveRequest } from '../types';
import { Eye, Check, X, CheckCircle2, Clock, XCircle, AlertTriangle } from 'lucide-react';
import { useLeave } from '../context/LeaveContext';
import { ApprovalDialog } from './ApprovalDialog';

interface LeaveRequestsTableProps {
  onViewDetails: (request: LeaveRequest) => void;
}

export const LeaveRequestsTable: React.FC<LeaveRequestsTableProps> = ({ onViewDetails }) => {
  const { leaveRequests } = useLeave();
  const [reviewRequest, setReviewRequest] = useState<LeaveRequest | null>(null);

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
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/30 text-slate-400 font-bold text-xs uppercase tracking-wider">
            <th className="py-4.5 px-6">Employee</th>
            <th className="py-4.5 px-6">Department</th>
            <th className="py-4.5 px-6">Leave Type</th>
            <th className="py-4.5 px-6">Applied Date</th>
            <th className="py-4.5 px-6">Status</th>
            <th className="py-4.5 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/50 text-sm font-medium">
          {leaveRequests.map((req) => (
            <tr key={req.id} className="hover:bg-slate-900/20 transition-colors">
              {/* Employee profile */}
              <td className="py-4 px-6 whitespace-nowrap">
                <div className="flex items-center gap-3.5">
                  <img 
                    src={req.employeeAvatar} 
                    alt={req.employeeName} 
                    className="w-10 h-10 rounded-full object-cover border border-slate-800 shadow-md"
                  />
                  <h4 className="font-bold text-sm text-slate-200">{req.employeeName}</h4>
                </div>
              </td>

              {/* Department */}
              <td className="py-4 px-6 whitespace-nowrap text-slate-300">
                {req.employeeDepartment}
              </td>

              {/* Leave Type */}
              <td className="py-4 px-6 whitespace-nowrap">
                <span className="block font-bold text-slate-300 capitalize text-sm">
                  {req.leaveType} Leave
                </span>
                <span className="block text-[10px] text-slate-500 font-semibold mt-0.5">
                  {req.startDate} to {req.endDate} ({req.duration} {req.duration === 1 ? 'day' : 'days'})
                </span>
              </td>

              {/* Applied Date */}
              <td className="py-4 px-6 whitespace-nowrap text-xs text-slate-500">
                {req.appliedDate}
              </td>

              {/* Status badge */}
              <td className="py-4 px-6 whitespace-nowrap">
                {getStatusBadge(req.status)}
              </td>

              {/* Action buttons */}
              <td className="py-4 px-6 whitespace-nowrap text-center">
                <div className="flex items-center justify-center gap-2">
                  {/* View Details */}
                  <button
                    onClick={() => onViewDetails(req)}
                    className="p-2 text-indigo-400 hover:text-white bg-slate-800 border border-slate-700/60 rounded-xl transition-all"
                    title="View Details"
                  >
                    <Eye className="w-4 h-4" />
                  </button>

                  {/* Inline approve/reject if status is pending */}
                  {req.status === 'pending' ? (
                    <>
                      <button
                        onClick={() => setReviewRequest(req)}
                        className="p-2 text-emerald-400 hover:text-white bg-emerald-500/10 hover:bg-emerald-500 border border-emerald-500/20 rounded-xl transition-all"
                        title="Process Request"
                      >
                        <Check className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => setReviewRequest(req)}
                        className="p-2 text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-500 border border-rose-500/20 rounded-xl transition-all"
                        title="Process Request"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </>
                  ) : (
                    <span className="text-xs text-slate-600 font-medium italic px-2">Reviewed</span>
                  )}
                </div>
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
      <ApprovalDialog request={reviewRequest} onClose={() => setReviewRequest(null)} />
    </div>
  );
};
