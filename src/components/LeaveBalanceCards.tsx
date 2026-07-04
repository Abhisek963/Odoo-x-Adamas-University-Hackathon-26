import React from 'react';
import { useLeave } from '../context/LeaveContext';
import { Compass, HeartPulse, RefreshCw } from 'lucide-react';

export const LeaveBalanceCards: React.FC = () => {
  const { leaveBalance } = useLeave();

  const balanceCards = [
    {
      label: 'Annual Leave',
      value: leaveBalance.annual,
      used: leaveBalance.usedAnnual,
      icon: <Compass className="w-5 h-5 text-indigo-400" />,
      borderColor: 'border-indigo-500/20'
    },
    {
      label: 'Sick Leave',
      value: leaveBalance.sick,
      used: leaveBalance.usedSick,
      icon: <HeartPulse className="w-5 h-5 text-rose-400" />,
      borderColor: 'border-rose-500/20'
    },
    {
      label: 'Casual Leave',
      value: leaveBalance.casual,
      used: leaveBalance.usedCasual,
      icon: <Compass className="w-5 h-5 text-emerald-400" />,
      borderColor: 'border-emerald-500/20'
    },
    {
      label: 'Unpaid Leave',
      value: leaveBalance.unpaid,
      used: leaveBalance.usedUnpaid,
      icon: <RefreshCw className="w-5 h-5 text-amber-400" />,
      borderColor: 'border-amber-500/20'
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {balanceCards.map((card, i) => (
        <div key={i} className={`p-6 rounded-3xl bg-slate-900 border ${card.borderColor} flex items-center justify-between`}>
          <div>
            <span className="text-xs text-slate-400 font-bold uppercase tracking-wider block mb-1">{card.label}</span>
            <span className="text-2xl font-black text-white">{card.value} <span className="text-xs text-slate-500 font-bold">Days Left</span></span>
            <span className="text-[10px] text-slate-500 font-bold block mt-1.5">{card.used} Days Used</span>
          </div>
          <div className="p-3 bg-slate-950 border border-slate-800 rounded-2xl">
            {card.icon}
          </div>
        </div>
      ))}
    </div>
  );
};
