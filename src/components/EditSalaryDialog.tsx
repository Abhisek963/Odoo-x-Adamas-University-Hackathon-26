import React, { useState, useEffect } from 'react';
import type { EmployeeSalary } from '../types';
import { X, Save, Calculator } from 'lucide-react';
import { useLeave } from '../context/LeaveContext';

interface EditSalaryDialogProps {
  record: EmployeeSalary | null;
  onClose: () => void;
}

export const EditSalaryDialog: React.FC<EditSalaryDialogProps> = ({ record, onClose }) => {
  const { updateSalary } = useLeave();

  // Local state for inputs
  const [basic, setBasic] = useState(0);
  const [hra, setHra] = useState(0);
  const [allowance, setAllowance] = useState(0);
  const [bonus, setBonus] = useState(0);
  const [pf, setPf] = useState(0);
  const [pt, setPt] = useState(0);

  // Sync inputs with selected record
  useEffect(() => {
    if (record) {
      setBasic(record.basicSalary);
      setHra(record.hra);
      setAllowance(record.standardAllowance);
      setBonus(record.performanceBonus);
      setPf(record.providentFund);
      setPt(record.professionalTax);
    }
  }, [record]);

  if (!record) return null;

  // Real-time calculation of Net Salary
  const calculatedNet = (basic + hra + allowance + bonus) - (pf + pt);

  const formatCurrency = (val: number) => {
    return new Intl.NumberFormat('en-IN', {
      style: 'currency',
      currency: 'INR',
      maximumFractionDigits: 0
    }).format(val);
  };

  const handleSave = (e: React.FormEvent) => {
    e.preventDefault();
    updateSalary(record.id, {
      basicSalary: basic,
      hra,
      standardAllowance: allowance,
      performanceBonus: bonus,
      providentFund: pf,
      professionalTax: pt
    });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in">
      <div className="relative w-full max-w-lg bg-slate-900 border border-slate-800 rounded-3xl shadow-2xl p-6 md:p-8 space-y-6">
        
        {/* Close Button */}
        <button 
          onClick={onClose}
          className="absolute top-4 right-4 p-2 text-slate-400 hover:text-white bg-slate-800/80 hover:bg-slate-800 rounded-xl border border-slate-700/50 transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Header */}
        <div className="border-b border-slate-800 pb-4">
          <h3 className="text-lg font-black text-white">Adjust Salary Structure</h3>
          <p className="text-xs text-slate-500 mt-1">Modifying compensation ledger for {record.employeeName}.</p>
        </div>

        <form onSubmit={handleSave} className="space-y-5">
          {/* Earnings section */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-1.5">Earnings</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Basic Salary</label>
                <input 
                  type="number"
                  value={basic}
                  onChange={(e) => setBasic(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-slate-200"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">HRA</label>
                <input 
                  type="number"
                  value={hra}
                  onChange={(e) => setHra(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-slate-200"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Standard Allowance</label>
                <input 
                  type="number"
                  value={allowance}
                  onChange={(e) => setAllowance(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-slate-200"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Performance Bonus</label>
                <input 
                  type="number"
                  value={bonus}
                  onChange={(e) => setBonus(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-slate-200"
                  required
                />
              </div>
            </div>
          </div>

          {/* Deductions section */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-widest border-b border-slate-800 pb-1.5">Deductions</h4>
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Provident Fund (PF)</label>
                <input 
                  type="number"
                  value={pf}
                  onChange={(e) => setPf(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-slate-200"
                  required
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] text-slate-500 font-bold uppercase tracking-wider">Professional Tax (PT)</label>
                <input 
                  type="number"
                  value={pt}
                  onChange={(e) => setPt(Math.max(0, Number(e.target.value)))}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-850 rounded-xl text-xs focus:outline-none focus:border-indigo-500 text-slate-200"
                  required
                />
              </div>
            </div>
          </div>

          {/* Real-time Calculation Summary Card */}
          <div className="p-4.5 bg-indigo-950/20 border border-indigo-500/20 rounded-2xl flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <Calculator className="w-5 h-5 text-indigo-400" />
              <div>
                <span className="block text-[9px] text-slate-500 font-bold uppercase tracking-wider">Net Monthly Payout</span>
                <span className="text-base font-black text-indigo-400">{formatCurrency(calculatedNet)}</span>
              </div>
            </div>
            <span className="text-[10px] text-slate-500 font-bold italic">Auto-calculated</span>
          </div>

          {/* Footer Actions */}
          <div className="flex justify-end gap-2 border-t border-slate-800/60 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="px-5 py-2.5 bg-slate-800 hover:bg-slate-700 text-xs font-bold text-slate-300 hover:text-white rounded-xl border border-slate-700/60 transition-all active:scale-[0.98]"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-5 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-xs font-bold text-white rounded-xl shadow-lg shadow-indigo-600/25 transition-all active:scale-[0.98] flex items-center gap-1.5"
            >
              <Save className="w-4 h-4" />
              Save Adjustments
            </button>
          </div>
        </form>

      </div>
    </div>
  );
};
