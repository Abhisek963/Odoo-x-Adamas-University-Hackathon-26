import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, 
  CalendarPlus, 
  History, 
  Users, 
  Inbox, 
  Coins, 
  Menu, 
  X,
  Calendar,
  RefreshCw
} from 'lucide-react';
import { useLeave } from '../context/LeaveContext';

export const Sidebar: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const { userRole, setUserRole } = useLeave();

  const employeeNav = [
    { name: 'Dashboard', path: '/', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Apply Leave', path: '/apply', icon: <CalendarPlus className="w-5 h-5" /> },
    { name: 'Leave History', path: '/history', icon: <History className="w-5 h-5" /> },
    { name: 'Payroll (Read Only)', path: '/payroll', icon: <Coins className="w-5 h-5" /> },
  ];

  const adminNav = [
    { name: 'Admin Dashboard', path: '/', icon: <LayoutDashboard className="w-5 h-5" /> },
    { name: 'Employee Directory', path: '/employees', icon: <Users className="w-5 h-5" /> },
    { name: 'Leave Requests', path: '/requests', icon: <Inbox className="w-5 h-5" /> },
    { name: 'Payroll Management', path: '/payroll', icon: <Coins className="w-5 h-5" /> },
  ];

  const navigation = userRole === 'employee' ? employeeNav : adminNav;

  return (
    <>
      {/* Mobile Toggle Button */}
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="fixed top-4 left-4 z-50 p-2 rounded-xl bg-slate-900 border border-slate-800 text-slate-300 hover:text-white lg:hidden transition-colors"
      >
        {isOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
      </button>

      {/* Mobile Sidebar Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-40 bg-slate-950/80 backdrop-blur-sm lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar Panel */}
      <aside 
        className={`fixed top-0 bottom-0 left-0 z-40 w-72 bg-slate-900 border-r border-slate-800/80 flex flex-col justify-between transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static shrink-0 ${
          isOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Header branding */}
          <div className="h-20 flex items-center px-6 border-b border-slate-800/60 gap-2.5">
            <div className="p-2 bg-gradient-to-tr from-indigo-600 to-violet-500 rounded-xl shadow-lg">
              <Calendar className="w-5 h-5 text-white" />
            </div>
            <div>
              <span className="font-extrabold text-xl tracking-tight bg-gradient-to-r from-white to-indigo-400 bg-clip-text text-transparent">
                TechNova HRMS
              </span>
              <span className="block text-[10px] text-slate-500 font-semibold tracking-wide uppercase leading-relaxed">
                Human Resource Management System
              </span>
            </div>
          </div>

          {/* Navigation links */}
          <nav className="p-4 space-y-1 mt-4">
            {navigation.map((item) => (
              <NavLink
                key={item.name}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={({ isActive }) => 
                  `flex items-center gap-3.5 px-4 py-3.5 rounded-xl font-medium text-sm transition-all duration-200 ${
                    isActive 
                      ? 'bg-gradient-to-r from-indigo-600 to-violet-600 text-white shadow-lg shadow-indigo-900/40' 
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/40'
                  }`
                }
              >
                {item.icon}
                <span>{item.name}</span>
              </NavLink>
            ))}
          </nav>
        </div>

        {/* Footer Switching & Branding */}
        <div className="p-4 border-t border-slate-800/40 space-y-3.5">
          <button
            onClick={() => setUserRole(userRole === 'employee' ? 'admin' : 'employee')}
            className="w-full py-2.5 bg-slate-950 hover:bg-slate-800 border border-slate-850 rounded-xl text-xs font-bold text-indigo-400 hover:text-indigo-300 transition-all flex items-center justify-center gap-2 cursor-pointer shadow-inner active:scale-[0.98]"
          >
            <RefreshCw className="w-3.5 h-3.5 animate-spin-slow" />
            {userRole === 'employee' ? 'Switch to HR/Admin' : 'Switch to Employee View'}
          </button>
          <div className="text-[10px] text-slate-500 text-center font-medium uppercase tracking-wider space-y-0.5">
            <div>Current Role</div>
            <div className="text-slate-300 font-bold text-[11px] normal-case tracking-normal">
              {userRole === 'employee' ? 'Employee' : 'HR Administrator'}
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};