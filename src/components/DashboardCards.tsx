import React from 'react';
import { useLeave } from '../context/LeaveContext';

export const DashboardCards: React.FC = () => {
  const { leaveBalance } = useLeave();

  const getPercentage = (used: number, total: number) => {
    return Math.min(100, Math.round((used / total) * 100));
  };

  const leaveMetrics = [
    {
      title: 'Annual Leave Utilization',
      used: leaveBalance.usedAnnual,
      total: leaveBalance.annual + leaveBalance.usedAnnual,
      percentage: getPercentage(leaveBalance.usedAnnual, leaveBalance.annual + leaveBalance.usedAnnual),
      color: 'bg-indigo-500',
      glow: 'glow-indigo'
    },
    {
      title: 'Sick Leave Utilization',
      used: leaveBalance.usedSick,
      total: leaveBalance.sick + leaveBalance.usedSick,
      percentage: getPercentage(leaveBalance.usedSick, leaveBalance.sick + leaveBalance.usedSick),
      color: 'bg-violet-500',
      glow: 'glow-violet'
    },
    {
      title: 'Casual Leave Utilization',
      used: leaveBalance.usedCasual,
      total: leaveBalance.casual + leaveBalance.usedCasual,
      percentage: getPercentage(leaveBalance.usedCasual, leaveBalance.casual + leaveBalance.usedCasual),
      color: 'bg-emerald-500',
      glow: 'glow-emerald'
    },
    {
      title: 'Unpaid Leave Utilization',
      used: leaveBalance.usedUnpaid,
      total: leaveBalance.unpaid + leaveBalance.usedUnpaid,
      percentage: getPercentage(leaveBalance.usedUnpaid, leaveBalance.unpaid + leaveBalance.usedUnpaid),
      color: 'bg-amber-500',
      glow: 'glow-amber'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {leaveMetrics.map((metric, i) => (
        <div key={i} className={`glass-card p-6 rounded-3xl space-y-4 hover:border-slate-700/80 transition-colors ${metric.glow}`}>
          <div className="flex justify-between items-center">
            <h4 className="font-bold text-sm text-slate-200">{metric.title}</h4>
            <span className="text-xs text-slate-500 font-bold">{metric.used} / {metric.total} Days Used</span>
          </div>
          
          <div className="space-y-1.5">
            <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800/80 flex">
              <div 
                className={`h-full ${metric.color} rounded-full transition-all duration-500`}
                style={{ width: `${metric.percentage}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] text-slate-500 font-bold uppercase tracking-wider">
              <span>0%</span>
              <span className="text-slate-300">{metric.percentage}% Utilized</span>
              <span>100%</span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};
