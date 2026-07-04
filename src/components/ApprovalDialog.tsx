import React, { useState } from 'react';
import type { LeaveRequest } from '../types';
import { X, Check, XCircle } from 'lucide-react';
import { useLeave } from '../context/LeaveContext';

interface ApprovalDialogProps {
  request: LeaveRequest | null;
  onClose: () => void;
}

export const ApprovalDialog: React.FC<ApprovalDialogProps> = ({ request, onClose }) => {
  const { approveRequest, rejectRequest } = useLeave();
  const [comment, setComment] = useState('');

  if (!request) return null;

  const handleApprove = () => {
    approveRequest(request.id, comment);
    onClose();
  };

  const handleReject = () => {
    rejectRequest(request.id, comment);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-md bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 md:p-8 space-y-6">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-xl border border-slate-700/50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="border-b border-slate-800 pb-4">
          <h3 className="text-lg font-black text-white">Process Leave Application</h3>
          <p className="text-xs text-slate-500 mt-1">Reviewing request from {request.employeeName}.</p>
        </div>

        {/* Request Quick Summary Info */}
        <div className="p-4 bg-slate-950/40 border border-slate-800/60 rounded-2xl space-y-2 text-xs font-semibold text-slate-400">
          <div className="flex justify-between">
            <span>Leave Category:</span>
            <span className="text-slate-200 capitalize">{request.leaveType} Leave</span>
          </div>
          <div className="flex justify-between">
            <span>Duration:</span>
            <span className="text-indigo-400">{request.duration} {request.duration === 1 ? 'Day' : 'Days'}</span>
          </div>
          <div className="flex justify-between border-t border-slate-800/60 pt-2 text-slate-500">
            <span>Reason:</span>
            <span className="text-slate-300 italic truncate max-w-[200px]">&ldquo;{request.reason}&rdquo;</span>
          </div>
        </div>

        {/* Comment Fields */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Admin Comment / Remarks</label>
          <textarea 
            rows={3}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Provide reasons or remarks for this approval/rejection decision..."
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 placeholder-slate-600 text-slate-200"
          />
        </div>

        {/* Actions Button Grid */}
        <div className="grid grid-cols-3 gap-2 pt-2">
          <button
            onClick={onClose}
            className="py-3 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 hover:text-white rounded-xl border border-slate-700/60 transition-all active:scale-[0.98]"
          >
            Cancel
          </button>
          
          <button
            onClick={handleReject}
            className="py-3 text-rose-400 hover:text-white hover:bg-rose-500 bg-rose-500/10 border border-rose-500/20 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 text-xs font-bold"
          >
            <XCircle className="w-4 h-4" />
            Reject
          </button>
          
          <button
            onClick={handleApprove}
            className="py-3 text-emerald-400 hover:text-white hover:bg-emerald-500 bg-emerald-500/10 border border-emerald-500/20 rounded-xl transition-all active:scale-[0.98] flex items-center justify-center gap-1.5 text-xs font-bold"
          >
            <Check className="w-4 h-4" />
            Approve
          </button>
        </div>

      </div>
    </div>
  );
};
