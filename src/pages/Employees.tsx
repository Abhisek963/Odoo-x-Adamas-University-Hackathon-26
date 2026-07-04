import React, { useState } from 'react';
import { useLeave } from '../context/LeaveContext';
import { EmployeeTable } from '../components/EmployeeTable';
import { EmployeeDetailsDrawer } from '../components/EmployeeDetailsDrawer';
import { Search, Filter, ChevronLeft, ChevronRight, Users, RefreshCw } from 'lucide-react';
import type { Employee } from '../types';

export const Employees: React.FC = () => {
  const { employees } = useLeave();

  const [searchTerm, setSearchTerm] = useState('');
  const [departmentFilter, setDepartmentFilter] = useState('all');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedEmployee, setSelectedEmployee] = useState<Employee | null>(null);

  const pageSize = 5;

  const departments = [
    { value: 'all', label: 'All Departments' },
    { value: 'Engineering', label: 'Engineering' },
    { value: 'Sales & Marketing', label: 'Sales & Marketing' },
    { value: 'Product & Design', label: 'Product & Design' },
    { value: 'Operations', label: 'Operations' },
    { value: 'Finance', label: 'Finance' }
  ];

  // Filtering
  const filteredEmployees = employees.filter((emp) => {
    const matchesSearch = 
      emp.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.role.toLowerCase().includes(searchTerm.toLowerCase()) ||
      emp.id.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDept = departmentFilter === 'all' || emp.department === departmentFilter;

    return matchesSearch && matchesDept;
  });

  // Pagination
  const totalItems = filteredEmployees.length;
  const totalPages = Math.ceil(totalItems / pageSize);
  const startIndex = (currentPage - 1) * pageSize;
  const paginatedEmployees = filteredEmployees.slice(startIndex, startIndex + pageSize);

  // Reset pagination on filter change
  const handleDeptChange = (dept: string) => {
    setDepartmentFilter(dept);
    setCurrentPage(1);
  };

  const handleSearchChange = (term: string) => {
    setSearchTerm(term);
    setCurrentPage(1);
  };

  const handleReset = () => {
    setSearchTerm('');
    setDepartmentFilter('all');
    setCurrentPage(1);
  };

  return (
    <div className="space-y-6 fade-in-slide">
      
      {/* Banner */}
      <div className="relative rounded-3xl overflow-hidden p-6 md:p-8 bg-gradient-to-r from-slate-900 via-indigo-950 to-slate-900 border border-slate-800/80 shadow-2xl">
        <div className="absolute top-0 right-0 w-80 h-80 bg-indigo-500/10 rounded-full blur-3xl -z-10" />
        
        <div className="space-y-2">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-500/10 border border-indigo-500/20 text-xs font-semibold text-indigo-400">
            <Users className="w-3.5 h-3.5" />
            Active Employee Directory
          </div>
          <h2 className="text-2xl md:text-3xl font-extrabold tracking-tight text-white">
            Employee Directory
          </h2>
          <p className="text-sm text-slate-400 max-w-xl">
            Search, filter, and review details for members across your organization.
          </p>
        </div>
      </div>

      {/* Search & Filter Header */}
      <div className="glass-card p-5 rounded-3xl space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          
          {/* Search bar */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-3 w-4.5 h-4.5 text-slate-500" />
            <input 
              type="text" 
              placeholder="Search by name, email, role or ID..."
              value={searchTerm}
              onChange={(e) => handleSearchChange(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-950/60 border border-slate-800/80 rounded-xl text-sm focus:outline-none focus:border-indigo-500 focus:ring-1 focus:ring-indigo-500 placeholder-slate-500 text-slate-200 transition-all"
            />
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center gap-1.5 text-xs font-semibold text-slate-400">
              <Filter className="w-4 h-4" />
              <span>Department:</span>
            </div>

            {/* Department dropdown */}
            <select 
              value={departmentFilter}
              onChange={(e) => handleDeptChange(e.target.value)}
              className="px-3.5 py-2.5 bg-slate-950 border border-slate-800 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-slate-300 font-medium"
            >
              {departments.map((dept) => (
                <option key={dept.value} value={dept.value}>{dept.label}</option>
              ))}
            </select>

            {/* Reset Button */}
            {(departmentFilter !== 'all' || searchTerm !== '') && (
              <button 
                onClick={handleReset}
                className="p-2.5 bg-slate-800 hover:bg-slate-700 border border-slate-700/50 rounded-xl text-slate-300 hover:text-white transition-colors"
                title="Reset Filters"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="glass-card rounded-3xl overflow-hidden shadow-2xl">
        <EmployeeTable 
          employees={paginatedEmployees} 
          onSelectEmployee={(emp) => setSelectedEmployee(emp)} 
        />

        {totalItems === 0 && (
          <div className="text-center py-16 text-slate-500 font-semibold border-t border-slate-800/60 bg-slate-900/10">
            No employees found matching your filters.
          </div>
        )}

        {/* Pagination controls footer */}
        {totalPages > 1 && (
          <div className="p-4 bg-slate-900/30 border-t border-slate-800/60 flex items-center justify-between font-semibold text-xs text-slate-400">
            <span>
              Showing {startIndex + 1} - {Math.min(startIndex + pageSize, totalItems)} of {totalItems} members
            </span>
            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                className="p-2 border border-slate-800 rounded-xl bg-slate-950 text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronLeft className="w-4 h-4" />
              </button>
              <span className="text-slate-300">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                className="p-2 border border-slate-800 rounded-xl bg-slate-950 text-slate-400 hover:text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all"
              >
                <ChevronRight className="w-4 h-4" />
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Employee Details Drawer */}
      <EmployeeDetailsDrawer 
        employee={selectedEmployee} 
        onClose={() => setSelectedEmployee(null)} 
      />

    </div>
  );
};
