import React from 'react';
import { useLeave } from '../context/LeaveContext';
import { EmployeeDashboard } from './EmployeeDashboard';
import { AdminDashboard } from './AdminDashboard';

export const Dashboard: React.FC = () => {
  const { userRole } = useLeave();

  return userRole === 'employee' ? <EmployeeDashboard /> : <AdminDashboard />;
};
