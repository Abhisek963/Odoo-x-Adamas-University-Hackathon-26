import React from 'react';
import { DashboardStatistics } from '../components/DashboardStatistics';
import { DashboardCards } from '../components/DashboardCards';
import { RecentRequestsTable } from '../components/RecentRequestsTable';
import { Calendar, ShieldAlert, Activity } from 'lucide-react';

export const AdminDashboard: React.FC = () => {
  return (
    <div className="space-y-8 fade-in-slide">
      {/* Banner */}
      <div className="relative rounded-3xl overflow-hidden p-6 md:p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800/80 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -z-10" />
        <div className="absolute bottom-0 left-20 w-60 h-60 bg-violet-500/10 rounded-full blur-3xl -z-10" />
        
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400">
            <ShieldAlert className="w-3.5 h-3.5" />
            Admin Console Active
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Administrative Dashboard
          </h2>
          <p className="text-sm text-slate-400 max-w-xl">
            Monitor organizational leave balance ratios, overview department metrics, and review employee applications.
          </p>
        </div>
      </div>

      {/* Dashboard Statistics */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <Activity className="w-5 h-5 text-indigo-400" />
          Leave Queue Metrics
        </h3>
        <DashboardStatistics />
      </div>

      {/* Dashboard Cards (utilization charts) */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-400" />
          Leave Utilization Status
        </h3>
        <DashboardCards />
      </div>

      {/* Recent Leave Requests table */}
      <div className="space-y-4">
        <h3 className="text-lg font-bold text-white tracking-tight flex items-center gap-2">
          <Calendar className="w-5 h-5 text-indigo-400" />
          Recent Leave Requests
        </h3>
        <RecentRequestsTable />
      </div>
    </div>
  );
};
