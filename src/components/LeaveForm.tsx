import React, { useState, useEffect } from 'react';
import { useLeave } from '../context/LeaveContext';
import { Send, Paperclip, AlertTriangle } from 'lucide-react';

interface LeaveFormProps {
  onSuccess?: () => void;
}

export const LeaveForm: React.FC<LeaveFormProps> = ({ onSuccess }) => {
  const { applyLeave } = useLeave();
  const [leaveType, setLeaveType] = useState('annual');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [reason, setReason] = useState('');
  const [attachmentName, setAttachmentName] = useState('');
  const [errors, setErrors] = useState<{
    startDate?: string;
    endDate?: string;
    reason?: string;
    attachment?: string;
  }>({});

  const todayStr = new Date().toISOString().split('T')[0];

  // Live Validation hook
  useEffect(() => {
    const newErrors: typeof errors = {};

    // Validate Start Date
    if (startDate) {
      if (startDate < todayStr) {
        newErrors.startDate = 'Start date cannot be in the past.';
      }
    }

    // Validate End Date
    if (endDate && startDate) {
      if (endDate < startDate) {
        newErrors.endDate = 'End date cannot be before start date.';
      }
    }

    // Validate Reason length live if dirty
    if (reason) {
      if (reason.length < 10) {
        newErrors.reason = 'Reason must be at least 10 characters.';
      } else if (reason.length > 500) {
        newErrors.reason = 'Reason cannot exceed 500 characters.';
      }
    }

    setErrors(newErrors);
  }, [startDate, endDate, reason, todayStr]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) {
      setAttachmentName('');
      return;
    }

    const allowedTypes = ['application/pdf', 'image/jpeg', 'image/jpg', 'image/png'];
    const maxSizeBytes = 5 * 1024 * 1024; // 5 MB

    if (!allowedTypes.includes(file.type)) {
      setErrors(prev => ({ ...prev, attachment: 'Only PDF, JPG, JPEG, and PNG formats are accepted.' }));
      setAttachmentName('');
      return;
    }

    if (file.size > maxSizeBytes) {
      setErrors(prev => ({ ...prev, attachment: 'File size cannot exceed 5 MB.' }));
      setAttachmentName('');
      return;
    }

    // Clear attachment error and save name
    setErrors(prev => {
      const copy = { ...prev };
      delete copy.attachment;
      return copy;
    });
    setAttachmentName(file.name);
  };

  const isFormInvalid = 
    !startDate || 
    !endDate || 
    !reason || 
    !attachmentName || 
    Object.keys(errors).length > 0;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Final checks
    const finalErrors: typeof errors = {};
    if (!startDate) finalErrors.startDate = 'Start date is required.';
    if (!endDate) finalErrors.endDate = 'End date is required.';
    if (!reason) {
      finalErrors.reason = 'Reason is required.';
    } else if (reason.length < 10) {
      finalErrors.reason = 'Reason must be at least 10 characters.';
    }
    if (!attachmentName) finalErrors.attachment = 'Attachment is required.';

    if (Object.keys(finalErrors).length > 0 || isFormInvalid) {
      setErrors(prev => ({ ...prev, ...finalErrors }));
      return;
    }

    applyLeave({
      leaveType,
      startDate,
      endDate,
      reason
    });

    // Reset Form state
    setStartDate('');
    setEndDate('');
    setReason('');
    setAttachmentName('');
    setErrors({});

    if (onSuccess) onSuccess();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Leave Type Selector */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Leave Category</label>
          <select
            value={leaveType}
            onChange={(e) => setLeaveType(e.target.value)}
            className="w-full px-4 py-3 bg-slate-950 border border-slate-800 rounded-xl text-sm focus:outline-none focus:border-indigo-500 text-slate-200"
          >
            <option value="annual">Paid Leave</option>
            <option value="sick">Sick Leave</option>
            <option value="unpaid">Unpaid Leave</option>
          </select>
        </div>

        {/* Start Date */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Start Date</label>
          <input
            type="date"
            value={startDate}
            onChange={(e) => setStartDate(e.target.value)}
            className={`w-full px-4 py-3 bg-slate-950 border rounded-xl text-sm focus:outline-none transition-all ${
              errors.startDate
                ? 'border-rose-500/60 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30 text-rose-300'
                : 'border-slate-800 focus:border-indigo-500 text-slate-200'
            }`}
            required
          />
          {errors.startDate && (
            <span className="text-[10px] text-rose-400 font-bold block flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              {errors.startDate}
            </span>
          )}
        </div>

        {/* End Date */}
        <div className="space-y-2">
          <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">End Date</label>
          <input
            type="date"
            value={endDate}
            onChange={(e) => setEndDate(e.target.value)}
            className={`w-full px-4 py-3 bg-slate-950 border rounded-xl text-sm focus:outline-none transition-all ${
              errors.endDate
                ? 'border-rose-500/60 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30 text-rose-300'
                : 'border-slate-800 focus:border-indigo-500 text-slate-200'
            }`}
            required
          />
          {errors.endDate && (
            <span className="text-[10px] text-rose-400 font-bold block flex items-center gap-1">
              <AlertTriangle className="w-3 h-3" />
              {errors.endDate}
            </span>
          )}
        </div>
      </div>

      {/* Reason Description */}
      <div className="space-y-2">
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">Reason for Request</label>
        <textarea
          rows={4}
          value={reason}
          onChange={(e) => setReason(e.target.value)}
          placeholder="Please explain the reason for your leave request in detail (min 10, max 500 characters)..."
          className={`w-full px-4 py-3 bg-slate-950 border rounded-xl text-sm focus:outline-none placeholder-slate-600 transition-all ${
            errors.reason
              ? 'border-rose-500/60 focus:border-rose-500 focus:ring-1 focus:ring-rose-500/30 text-rose-300'
              : 'border-slate-800 focus:border-indigo-500 text-slate-200'
          }`}
          required
        />
        {errors.reason ? (
          <span className="text-[10px] text-rose-400 font-bold block flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            {errors.reason}
          </span>
        ) : (
          reason && (
            <span className="text-[10px] text-slate-500 font-semibold block text-right">
              {reason.length} / 500 characters
            </span>
          )
        )}
      </div>

      {/* Attachment Upload Field */}
      <div className="space-y-3">
        <label className="block text-xs font-bold text-slate-400 uppercase tracking-wider">
          Attachment *
          {leaveType === 'sick' && (
            <span className="ml-2 text-[10px] text-amber-400 lowercase font-bold">
              (Recommended for Sick Leave)
            </span>
          )}
        </label>

        <div className="flex items-center gap-4">
          <label className={`flex items-center gap-2 px-4 py-2.5 bg-slate-950 hover:bg-slate-900 border rounded-xl text-xs font-bold transition-all cursor-pointer select-none ${
            errors.attachment
              ? 'border-rose-500/60 text-rose-300 hover:border-rose-400'
              : 'border-slate-800 text-slate-300 hover:text-white hover:border-slate-700'
          }`}>
            <Paperclip className="w-4 h-4 text-indigo-400" />
            Choose File
            <input
              type="file"
              accept=".pdf, .jpg, .jpeg, .png, image/jpeg, image/png, application/pdf"
              onChange={handleFileChange}
              className="hidden"
            />
          </label>
          <span className="text-xs text-slate-400 truncate max-w-[250px] font-semibold">
            {attachmentName || 'No file chosen'}
          </span>
        </div>

        {errors.attachment ? (
          <span className="text-[10px] text-rose-400 font-bold block flex items-center gap-1">
            <AlertTriangle className="w-3 h-3" />
            {errors.attachment}
          </span>
        ) : (
          <p className="text-[10px] text-slate-500 font-semibold tracking-wide">
            Upload a medical certificate for Sick Leave (optional for other leave types). Accepted formats: PDF, JPG, JPEG, PNG (Max 5 MB).
          </p>
        )}
      </div>

      {/* Action Submit */}
      <div className="flex justify-end pt-2">
        <button
          type="submit"
          disabled={isFormInvalid}
          className={`px-6 py-3 text-xs font-bold rounded-xl shadow-lg transition-all active:scale-[0.98] flex items-center gap-2 ${
            isFormInvalid
              ? 'bg-slate-800 border border-slate-800 text-slate-500 cursor-not-allowed shadow-none'
              : 'bg-indigo-600 hover:bg-indigo-500 text-white shadow-indigo-600/25 cursor-pointer'
          }`}
        >
          <Send className="w-4 h-4" />
          Submit Application
        </button>
      </div>
    </form>
  );
};
