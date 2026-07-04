import React from 'react';
import { useLeave } from '../context/LeaveContext';
import { FileText, Clock, CheckCircle2, XCircle } from 'lucide-react';

export const DashboardStatistics: React.FC = () => {
  const { leaveRequests } = useLeave();

  const total = leaveRequests.length;
  const pending = leaveRequests.filter(req => req.status === 'pending').length;
  const approved = leaveRequests.filter(req => req.status === 'approved').length;
  const rejected = leaveRequests.filter(req => req.status === 'rejected' || req.status === 'cancelled').length;

  const stats = [
    {
      label: 'Total Requests',
      value: total,
      icon: <FileText className="w-5 h-5 text-indigo-400" />,
      borderColor: 'border-indigo-500/20'
    },
    {
      label: 'Awaiting Review',
      value: pending,
      icon: <Clock className="w-5 h-5 text-amber-400" />,
      borderColor: 'border-amber-500/20'
    },
    {
      label: 'Approved Applications',
      value: approved,
      icon: <CheckCircle2 className="w-5 h-5 text-emerald-400" />,
      borderColor: 'border-emerald-500/20'
    },
    {
      label: 'Rejected / Cancelled',
      value: rejected,
      icon: <XCircle className="w-5 h-5 text-rose-400" />,
      borderColor: 'border-rose-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {stats.map((stat, i) => (
        <div key={i} className={`p-6 rounded-3xl bg-slate-900 border ${stat.borderColor} flex items-center justify-between`}>
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">{stat.label}</span>
            <span className="text-2xl font-black text-white">{stat.value}</span>
          </div>
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl">
            {stat.icon}
          </div>
        </div>
      ))}
    </div>
  );
};
