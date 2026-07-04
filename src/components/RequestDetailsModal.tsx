import React from 'react';
import type { LeaveRequest } from '../types';
import { X, Calendar, FileText, User, CheckCircle2, Clock, XCircle } from 'lucide-react';

interface RequestDetailsModalProps {
  request: LeaveRequest | null;
  onClose: () => void;
}

export const RequestDetailsModal: React.FC<RequestDetailsModalProps> = ({ request, onClose }) => {
  if (!request) return null;

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'approved':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400">
            <CheckCircle2 className="w-4 h-4" />
            Approved by HR Manager
          </span>
        );
      case 'pending':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-400">
            <Clock className="w-4 h-4 animate-pulse" />
            Pending Action Review
          </span>
        );
      case 'rejected':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/20 text-xs font-bold text-rose-400">
            <XCircle className="w-4 h-4" />
            Rejected by HR Manager
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-xl bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 md:p-8 space-y-6">
        
        {/* Close button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-xl border border-slate-700/50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="border-b border-slate-800 pb-4">
          <h3 className="text-lg font-black text-white">Leave Application Details</h3>
          <span className="text-xs text-slate-500 font-semibold tracking-wider uppercase block mt-0.5">
            Request ID: {request.id}
          </span>
        </div>

        {/* Employee header */}
        <div className="flex items-center gap-3.5 p-4 bg-slate-950/40 border border-slate-800/60 rounded-2xl">
          <img 
            src={request.employeeAvatar} 
            alt={request.employeeName} 
            className="w-12 h-12 rounded-full object-cover border border-slate-800"
          />
          <div>
            <h4 className="font-bold text-sm text-slate-200">{request.employeeName}</h4>
            <span className="text-xs text-slate-500 font-semibold uppercase tracking-wider block">
              Department: {request.employeeDepartment}
            </span>
          </div>
        </div>

        {/* Details List */}
        <div className="space-y-4 font-medium text-xs">
          {/* Status block */}
          <div className="flex items-center justify-between border-b border-slate-800/40 pb-3">
            <span className="text-slate-500 uppercase tracking-widest">Application Status</span>
            {getStatusLabel(request.status)}
          </div>

          {/* Date range details */}
          <div className="flex items-center gap-3 text-slate-300">
            <Calendar className="w-4.5 h-4.5 text-slate-500 shrink-0" />
            <div>
              <span className="block text-[9px] text-slate-500 uppercase tracking-wider">Leave Period</span>
              <span className="text-xs font-semibold text-slate-200">
                {request.startDate} to {request.endDate} 
                <span className="text-indigo-400 ml-1.5 font-bold">({request.duration} {request.duration === 1 ? 'Day' : 'Days'})</span>
              </span>
            </div>
          </div>

          {/* Leave category */}
          <div className="flex items-center gap-3 text-slate-300 border-b border-slate-800/40 pb-3">
            <User className="w-4.5 h-4.5 text-slate-500 shrink-0" />
            <div>
              <span className="block text-[9px] text-slate-500 uppercase tracking-wider">Leave Category</span>
              <span className="text-xs font-semibold text-slate-200 capitalize">{request.leaveType} Leave</span>
            </div>
          </div>

          {/* Reason text */}
          <div className="flex items-start gap-3 text-slate-300 leading-normal">
            <FileText className="w-4.5 h-4.5 text-slate-500 shrink-0 mt-0.5" />
            <div>
              <span className="block text-[9px] text-slate-500 uppercase tracking-wider mb-0.5">Reason for Request</span>
              <p className="text-slate-300 italic text-xs">&ldquo;{request.reason}&rdquo;</p>
            </div>
          </div>

          {/* Manager comments if any */}
          {request.comments && (
            <div className="p-3 bg-slate-950 border border-slate-850 rounded-xl text-xs text-slate-400">
              <span className="block text-[9px] text-indigo-400 font-bold uppercase tracking-wider mb-1">HR Remarks</span>
              {request.comments}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="flex justify-end pt-3 border-t border-slate-800/60">
          <button
            onClick={onClose}
            className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 hover:text-white rounded-xl border border-slate-700/60 transition-all active:scale-[0.98]"
          >
            Close View
          </button>
        </div>

      </div>
    </div>
  );
};
