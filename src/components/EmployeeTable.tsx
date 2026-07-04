import React from 'react';
import type { Employee } from '../types';
import { Eye, MapPin } from 'lucide-react';

interface EmployeeTableProps {
  employees: Employee[];
  onSelectEmployee: (employee: Employee) => void;
}

export const EmployeeTable: React.FC<EmployeeTableProps> = ({ employees, onSelectEmployee }) => {
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'active':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-xs font-bold text-emerald-400">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Active
          </span>
        );
      case 'on-leave':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-amber-500/10 border border-amber-500/20 text-xs font-bold text-amber-400">
            On Leave
          </span>
        );
      case 'inactive':
        return (
          <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-slate-800 border border-slate-700/60 text-xs font-bold text-slate-400">
            Inactive
          </span>
        );
      default:
        return null;
    }
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/30 text-slate-400 font-bold text-xs uppercase tracking-wider">
            <th className="py-4.5 px-6">Employee</th>
            <th className="py-4.5 px-6">ID & Designation</th>
            <th className="py-4.5 px-6">Department</th>
            <th className="py-4.5 px-6">Status</th>
            <th className="py-4.5 px-6">Location</th>
            <th className="py-4.5 px-6 text-center">Actions</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/50 text-sm font-medium">
          {employees.map((emp) => (
            <tr key={emp.id} className="hover:bg-slate-900/20 transition-colors">
              {/* Profile Card */}
              <td className="py-4 px-6 whitespace-nowrap">
                <div className="flex items-center gap-3.5">
                  <img 
                    src={emp.avatar} 
                    alt={emp.name} 
                    className="w-11 h-11 rounded-full object-cover border border-slate-800 shadow-md"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-slate-200">{emp.name}</h4>
                    <span className="text-xs text-slate-500 font-medium block mt-0.5">{emp.email}</span>
                  </div>
                </div>
              </td>

              {/* ID & Role */}
              <td className="py-4 px-6 whitespace-nowrap">
                <span className="block font-bold text-slate-300 text-xs tracking-wider">{emp.id}</span>
                <span className="block text-slate-400 text-xs mt-0.5 font-semibold">{emp.role}</span>
              </td>

              {/* Department */}
              <td className="py-4 px-6 whitespace-nowrap text-slate-300">
                {emp.department}
              </td>

              {/* Status */}
              <td className="py-4 px-6 whitespace-nowrap">
                {getStatusBadge(emp.status)}
              </td>

              {/* Location */}
              <td className="py-4 px-6 whitespace-nowrap text-xs text-slate-500 font-semibold">
                <div className="flex items-center gap-1">
                  <MapPin className="w-3.5 h-3.5" />
                  {emp.location}
                </div>
              </td>

              {/* Actions */}
              <td className="py-4 px-6 text-center whitespace-nowrap">
                <button
                  onClick={() => onSelectEmployee(emp)}
                  className="p-2 text-indigo-400 hover:text-white bg-indigo-500/10 hover:bg-indigo-500 rounded-xl transition-all inline-flex items-center gap-1 text-xs font-bold"
                  title="View Details"
                >
                  <Eye className="w-3.5 h-3.5" />
                  Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
