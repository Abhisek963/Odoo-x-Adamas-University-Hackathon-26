import React from 'react';
import type { EmployeeSalary } from '../types';
import { Edit3 } from 'lucide-react';
import { useLeave } from '../context/LeaveContext';

interface SalaryTableProps {
  onEditSalary: (record: EmployeeSalary) => void;
}

export const SalaryTable: React.FC<SalaryTableProps> = ({ onEditSalary }) => {
  const { salaries, userRole, currentUser } = useLeave();

  const displaySalaries = userRole === 'employee' 
    ? salaries.filter(s => s.employeeName === currentUser.name) 
    : salaries;

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(value);
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full text-left border-collapse">
        <thead>
          <tr className="border-b border-slate-800 bg-slate-900/30 text-slate-400 font-bold text-xs uppercase tracking-wider">
            <th className="py-4.5 px-5">Employee</th>
            <th className="py-4.5 px-5 text-right">Basic Salary</th>
            <th className="py-4.5 px-5 text-right">HRA</th>
            <th className="py-4.5 px-5 text-right">Std Allowance</th>
            <th className="py-4.5 px-5 text-right">Perf Bonus</th>
            <th className="py-4.5 px-5 text-right">Provident Fund</th>
            <th className="py-4.5 px-5 text-right">Prof Tax</th>
            <th className="py-4.5 px-5 text-right text-indigo-400">Net Salary</th>
            {userRole === 'admin' && <th className="py-4.5 px-5 text-center">Action</th>}
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/50 text-sm font-medium">
          {displaySalaries.map((sal) => (
            <tr key={sal.id} className="hover:bg-slate-900/20 transition-colors">
              {/* Employee profile */}
              <td className="py-4 px-5 whitespace-nowrap">
                <div className="flex items-center gap-3">
                  <img 
                    src={sal.employeeAvatar} 
                    alt={sal.employeeName} 
                    className="w-10 h-10 rounded-full object-cover border border-slate-800 shadow-md"
                  />
                  <div>
                    <h4 className="font-bold text-sm text-slate-200">{sal.employeeName}</h4>
                    <span className="text-[10px] text-slate-500 font-semibold uppercase tracking-wider block">
                      {sal.employeeDepartment}
                    </span>
                  </div>
                </div>
              </td>

              {/* Earnings */}
              <td className="py-4 px-5 whitespace-nowrap text-right text-slate-300">
                {formatCurrency(sal.basicSalary)}
              </td>
              <td className="py-4 px-5 whitespace-nowrap text-right text-slate-300">
                {formatCurrency(sal.hra)}
              </td>
              <td className="py-4 px-5 whitespace-nowrap text-right text-slate-300">
                {formatCurrency(sal.standardAllowance)}
              </td>
              <td className="py-4 px-5 whitespace-nowrap text-right text-emerald-400">
                {formatCurrency(sal.performanceBonus)}
              </td>

              {/* Deductions */}
              <td className="py-4 px-5 whitespace-nowrap text-right text-rose-400/80">
                {formatCurrency(sal.providentFund)}
              </td>
              <td className="py-4 px-5 whitespace-nowrap text-right text-rose-400/80">
                {formatCurrency(sal.professionalTax)}
              </td>

              {/* Net Salary */}
              <td className="py-4 px-5 whitespace-nowrap text-right text-indigo-400 font-bold">
                {formatCurrency(sal.netSalary)}
              </td>

              {/* Action */}
              {userRole === 'admin' && (
                <td className="py-4 px-5 text-center whitespace-nowrap">
                  <button
                    onClick={() => onEditSalary(sal)}
                    className="p-2 text-indigo-400 hover:text-white bg-indigo-500/10 hover:bg-indigo-500 rounded-xl transition-all"
                    title="Edit Salary Structure"
                  >
                    <Edit3 className="w-4 h-4" />
                  </button>
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};
