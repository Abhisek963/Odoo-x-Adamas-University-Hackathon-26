import api from './api';
import type { Employee } from '../types';

export const employeeService = {
  /**
   * Fetch all employees
   */
  getEmployees: (): Promise<Employee[]> => {
    return api.get('/employees');
  },

  /**
   * Fetch single employee details by ID
   */
  getEmployeeById: (id: string): Promise<Employee> => {
    return api.get(`/employees/${id}`);
  }
};
