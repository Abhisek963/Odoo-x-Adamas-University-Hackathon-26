import api from './api';
import type { EmployeeSalary } from '../types';

export const payrollService = {
  /**
   * Fetch all employee salary records
   */
  getSalaries: (): Promise<EmployeeSalary[]> => {
    return api.get('/payroll');
  },

  /**
   * Adjust/update employee salary structure details
   */
  updateSalary: (
    id: string,
    updated: Omit<EmployeeSalary, 'id' | 'employeeName' | 'employeeAvatar' | 'employeeDepartment' | 'netSalary'>
  ): Promise<EmployeeSalary> => {
    return api.put(`/payroll/${id}`, updated);
  }
};
