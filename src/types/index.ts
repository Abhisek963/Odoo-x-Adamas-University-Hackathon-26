export type LeaveType = 'annual' | 'sick' | 'casual' | 'unpaid';

export type LeaveStatus = 'pending' | 'approved' | 'rejected' | 'cancelled';

export interface LeaveRequest {
  id: string;
  employeeName: string;
  employeeAvatar: string;
  employeeDepartment: string;
  leaveType: LeaveType;
  startDate: string;
  endDate: string;
  duration: number;
  reason: string;
  status: LeaveStatus;
  appliedDate: string;
  comments?: string;
}

export interface LeaveBalance {
  annual: number;
  sick: number;
  casual: number;
  unpaid: number;
  usedAnnual: number;
  usedSick: number;
  usedCasual: number;
  usedUnpaid: number;
}

export interface Employee {
  id: string;
  name: string;
  email: string;
  department: string;
  role: string;
  status: 'active' | 'inactive' | 'on-leave';
  joiningDate: string;
  avatar: string;
  phone: string;
  location: string;
  manager: string;
}

export interface EmployeeSalary {
  id: string;
  employeeName: string;
  employeeAvatar: string;
  employeeDepartment: string;
  basicSalary: number;
  hra: number;
  standardAllowance: number;
  performanceBonus: number;
  providentFund: number;
  professionalTax: number;
  netSalary: number;
}
