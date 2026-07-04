import React from 'react';
import { LeaveBalanceCards } from '../components/LeaveBalanceCards';
import { LeaveStatusCards } from '../components/LeaveStatusCards';
import { useLeave } from '../context/LeaveContext';
import { CheckCircle2, Clock, XCircle, AlertTriangle, ShieldCheck } from 'lucide-react';

export const EmployeeDashboard: React.FC = () => {
  const { leaveRequests, cancelRequest, currentUser } = useLeave();

  // Filter requests applied by current logged-in employee
  const myRequests = leaveRequests.filter(req => req.employeeName === currentUser.name);

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
    <div className="space-y-8 fade-in-slide">
      {/* Banner */}
      <div className="relative rounded-3xl overflow-hidden p-6 md:p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800/80 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -z-10" />
        
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400">
            <ShieldCheck className="w-3.5 h-3.5" />
            Employee Portal Mode
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Welcome Back, {currentUser.name.split(' ')[0]}!
          </h2>
          <p className="text-sm text-slate-400 max-w-xl">
            View your available leave category balances, check approval statuses, and request vacation time.
          </p>
        </div>
      </div>

      {/* Balance Cards */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white tracking-tight">Your Leave Balance</h3>
        <LeaveBalanceCards />
      </div>

      {/* Application Status metrics */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white tracking-tight">Leave Status Metrics</h3>
        <LeaveStatusCards />
      </div>

      {/* Recent Applications table */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white tracking-tight">Recent Leave Applications</h3>
        <div className="glass-card rounded-3xl overflow-hidden shadow-2xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="border-b border-slate-800 bg-slate-900/30 text-slate-400 font-bold text-xs uppercase tracking-wider">
                  <th className="py-4.5 px-6">Leave Details</th>
                  <th className="py-4.5 px-6">Duration</th>
                  <th className="py-4.5 px-6">Reason</th>
                  <th className="py-4.5 px-6">Applied Date</th>
                  <th className="py-4.5 px-6">Status</th>
                  <th className="py-4.5 px-6 text-center">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/50 text-sm font-medium">
                {myRequests.map((req) => (
                  <tr key={req.id} className="hover:bg-slate-900/20 transition-colors">
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
                    <td className="py-4 px-6 whitespace-nowrap text-slate-300 font-bold">
                      {req.duration} {req.duration === 1 ? 'day' : 'days'}
                    </td>

                    {/* Reason */}
                    <td className="py-4 px-6 text-slate-300 text-xs font-semibold max-w-xs truncate">
                      {req.reason}
                    </td>

                    {/* Applied Date */}
                    <td className="py-4 px-6 whitespace-nowrap text-xs text-slate-500">
                      {req.appliedDate}
                    </td>

                    {/* Status Badge */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      {getStatusBadge(req.status)}
                    </td>

                    {/* Cancel action if pending */}
                    <td className="py-4 px-6 whitespace-nowrap text-center">
                      {req.status === 'pending' ? (
                        <button
                          onClick={() => cancelRequest(req.id)}
                          className="px-3 py-1.5 text-rose-400 hover:text-white bg-rose-500/10 hover:bg-rose-500 rounded-xl transition-all text-xs font-bold"
                        >
                          Cancel
                        </button>
                      ) : (
                        <span className="text-xs text-slate-600 font-semibold italic">Completed</span>
                      )}
                    </td>
                  </tr>
                ))}

                {myRequests.length === 0 && (
                  <tr>
                    <td colSpan={6} className="text-center py-16 text-slate-500 font-semibold">
                      <AlertTriangle className="w-8 h-8 text-slate-600 mx-auto mb-3" />
                      You have not submitted any leave applications yet.
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};
