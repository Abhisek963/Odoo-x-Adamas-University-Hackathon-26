import React from 'react';
import type { Employee } from '../types';
import { X, Mail, Phone, MapPin, Briefcase, Calendar, User } from 'lucide-react';

interface EmployeeDetailsDrawerProps {
  employee: Employee | null;
  onClose: () => void;
}

export const EmployeeDetailsDrawer: React.FC<EmployeeDetailsDrawerProps> = ({ employee, onClose }) => {
  if (!employee) return null;

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 z-40 bg-slate-950/70 backdrop-blur-sm transition-opacity duration-300"
        onClick={onClose}
      />

      {/* Drawer Panel */}
      <div className="fixed top-0 bottom-0 right-0 z-50 w-full max-w-md bg-slate-900 border-l border-slate-800/80 p-6 md:p-8 flex flex-col justify-between shadow-2xl transition-transform duration-300 transform translate-x-0 animate-in slide-in-from-right duration-200">
        
        <div className="space-y-6">
          {/* Header Close Trigger */}
          <div className="flex items-center justify-between border-b border-slate-800 pb-4">
            <span className="font-extrabold text-sm tracking-wider text-slate-400 uppercase">Employee Profile Details</span>
            <button 
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 border border-slate-800/80 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Profile Card banner */}
          <div className="text-center space-y-3.5 py-4 bg-slate-950/30 rounded-3xl border border-slate-800/40">
            <img 
              src={employee.avatar} 
              alt={employee.name} 
              className="w-24 h-24 rounded-full object-cover border-2 border-indigo-500/50 mx-auto shadow-lg"
            />
            <div>
              <h3 className="text-lg font-black text-white">{employee.name}</h3>
              <span className="text-xs text-indigo-400 font-bold tracking-wide">{employee.role}</span>
            </div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 text-[10px] font-bold text-slate-300 border border-slate-700/60 uppercase">
              {employee.id}
            </div>
          </div>

          {/* Detailed Info grid */}
          <div className="space-y-4 font-medium text-sm">
            <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-1.5">Employment Info</h4>
            
            <div className="flex items-center gap-3 text-slate-300">
              <Briefcase className="w-4 h-4 text-slate-500 shrink-0" />
              <div className="min-w-0">
                <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">Department</span>
                <span className="text-xs font-semibold text-slate-200">{employee.department}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-slate-300">
              <User className="w-4 h-4 text-slate-500 shrink-0" />
              <div className="min-w-0">
                <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">Reports To</span>
                <span className="text-xs font-semibold text-slate-200">{employee.manager}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-slate-300">
              <Calendar className="w-4 h-4 text-slate-500 shrink-0" />
              <div className="min-w-0">
                <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">Date of Joining</span>
                <span className="text-xs font-semibold text-slate-200">{employee.joiningDate}</span>
              </div>
            </div>

            <h4 className="font-extrabold text-xs text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-1.5 pt-2">Contact Details</h4>

            <div className="flex items-center gap-3 text-slate-300">
              <Mail className="w-4 h-4 text-slate-500 shrink-0" />
              <div className="min-w-0">
                <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">Email Address</span>
                <span className="text-xs font-semibold text-slate-200 truncate">{employee.email}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-slate-300">
              <Phone className="w-4 h-4 text-slate-500 shrink-0" />
              <div className="min-w-0">
                <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">Phone Number</span>
                <span className="text-xs font-semibold text-slate-200">{employee.phone}</span>
              </div>
            </div>

            <div className="flex items-center gap-3 text-slate-300">
              <MapPin className="w-4 h-4 text-slate-500 shrink-0" />
              <div className="min-w-0">
                <span className="block text-[10px] text-slate-500 font-bold uppercase tracking-wider">Location</span>
                <span className="text-xs font-semibold text-slate-200">{employee.location}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Footer */}
        <button
          onClick={onClose}
          className="w-full py-3 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 hover:text-white rounded-xl border border-slate-700/60 transition-all active:scale-[0.98]"
        >
          Close View
        </button>
      </div>
    </>
  );
};
