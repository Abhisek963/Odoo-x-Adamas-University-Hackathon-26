import React, { createContext, useContext, useState } from 'react';
import type { LeaveRequest, LeaveBalance, Employee, EmployeeSalary } from '../types';

interface LeaveContextType {
  userRole: 'employee' | 'admin';
  setUserRole: (role: 'employee' | 'admin') => void;
  currentUser: {
    name: string;
    email: string;
    avatar: string;
    department: string;
  };
  leaveBalance: LeaveBalance;
  leaveRequests: LeaveRequest[];
  employees: Employee[];
  salaries: EmployeeSalary[];
  applyLeave: (request: {
    leaveType: string;
    startDate: string;
    endDate: string;
    reason: string;
  }) => void;
  cancelRequest: (id: string) => void;
  approveRequest: (id: string, comments?: string) => void;
  rejectRequest: (id: string, comments?: string) => void;
  updateSalary: (id: string, updated: Omit<EmployeeSalary, 'id' | 'employeeName' | 'employeeAvatar' | 'employeeDepartment' | 'netSalary'>) => void;
}

const LeaveContext = createContext<LeaveContextType | undefined>(undefined);

const initialBalance: LeaveBalance = {
  annual: 25,
  sick: 10,
  casual: 7,
  unpaid: 15,
  usedAnnual: 4,
  usedSick: 2,
  usedCasual: 1,
  usedUnpaid: 0
};

const initialRequests: LeaveRequest[] = [
  {
    id: 'req-1',
    employeeName: 'Priya Singh',
    employeeAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    employeeDepartment: 'Engineering',
    leaveType: 'annual',
    startDate: '2026-07-10',
    endDate: '2026-07-17',
    duration: 8,
    reason: 'Family summer vacation and wedding',
    status: 'pending',
    appliedDate: '2026-07-02'
  },
  {
    id: 'req-2',
    employeeName: 'Rahul Sharma',
    employeeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    employeeDepartment: 'Sales & Marketing',
    leaveType: 'casual',
    startDate: '2026-07-08',
    endDate: '2026-07-09',
    duration: 2,
    reason: 'Moving to a new apartment',
    status: 'pending',
    appliedDate: '2026-07-03'
  },
  {
    id: 'req-3',
    employeeName: 'Abhishek Kumar',
    employeeAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    employeeDepartment: 'Product & Design',
    leaveType: 'sick',
    startDate: '2026-07-04',
    endDate: '2026-07-05',
    duration: 2,
    reason: 'Flu and doctor ordered rest',
    status: 'approved',
    appliedDate: '2026-07-03'
  },
  {
    id: 'req-4',
    employeeName: 'Sneha Roy',
    employeeAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    employeeDepartment: 'Operations',
    leaveType: 'unpaid',
    startDate: '2026-06-15',
    endDate: '2026-06-20',
    duration: 6,
    reason: 'Personal family emergency travel',
    status: 'rejected',
    appliedDate: '2026-06-10',
    comments: 'Rejected due to critical deployment schedule.'
  },
  {
    id: 'req-5',
    employeeName: 'Neha Gupta',
    employeeAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    employeeDepartment: 'Finance',
    leaveType: 'annual',
    startDate: '2026-06-01',
    endDate: '2026-06-05',
    duration: 5,
    reason: 'Annual family reunion',
    status: 'approved',
    appliedDate: '2026-05-15'
  }
];

const initialEmployees: Employee[] = [
  {
    id: 'EMP001',
    name: 'Priya Singh',
    email: 'priya.singh@hrms.io',
    department: 'Engineering',
    role: 'Senior Software Engineer',
    status: 'active',
    joiningDate: '2022-04-12',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    phone: '+91 98765 11111',
    location: 'Bangalore, India',
    manager: 'Arjun Patel'
  },
  {
    id: 'EMP002',
    name: 'Rahul Sharma',
    email: 'rahul.sharma@hrms.io',
    department: 'Sales & Marketing',
    role: 'Marketing Lead',
    status: 'active',
    joiningDate: '2023-01-15',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    phone: '+91 98765 22222',
    location: 'Delhi, India',
    manager: 'Arjun Patel'
  },
  {
    id: 'EMP003',
    name: 'Abhishek Kumar',
    email: 'abhishek.kumar@hrms.io',
    department: 'Product & Design',
    role: 'Lead UX Designer',
    status: 'on-leave',
    joiningDate: '2021-11-01',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    phone: '+91 98765 33333',
    location: 'Mumbai, India',
    manager: 'Ananya Das'
  },
  {
    id: 'EMP004',
    name: 'Sneha Roy',
    email: 'sneha.roy@hrms.io',
    department: 'Operations',
    role: 'Operations Coordinator',
    status: 'active',
    joiningDate: '2024-03-10',
    avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    phone: '+91 98765 44444',
    location: 'Hyderabad, India',
    manager: 'Ananya Das'
  },
  {
    id: 'EMP005',
    name: 'Neha Gupta',
    email: 'neha.gupta@hrms.io',
    department: 'Finance',
    role: 'Financial Analyst',
    status: 'active',
    joiningDate: '2023-08-20',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    phone: '+91 91234 56789',
    location: 'Mumbai, India',
    manager: 'Ananya Das'
  },
  {
    id: 'EMP006',
    name: 'Arjun Patel',
    email: 'arjun.patel@hrms.io',
    department: 'Engineering',
    role: 'Engineering Director',
    status: 'active',
    joiningDate: '2020-05-01',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    phone: '+91 98765 66666',
    location: 'Bangalore, India',
    manager: 'Ananya Das'
  },
  {
    id: 'EMP007',
    name: 'Rohan Verma',
    email: 'rohan.verma@hrms.io',
    department: 'Product & Design',
    role: 'Product Manager',
    status: 'active',
    joiningDate: '2022-09-18',
    avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    phone: '+91 98765 77777',
    location: 'Pune, India',
    manager: 'Ananya Das'
  },
  {
    id: 'EMP008',
    name: 'Aditi Joshi',
    email: 'aditi.joshi@hrms.io',
    department: 'Engineering',
    role: 'Junior Frontend Developer',
    status: 'inactive',
    joiningDate: '2024-06-01',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    phone: '+91 98765 88888',
    location: 'Noida, India',
    manager: 'Priya Singh'
  },
  {
    id: 'EMP009',
    name: 'Karan Mehta',
    email: 'karan.mehta@hrms.io',
    department: 'Sales & Marketing',
    role: 'Sales Representative',
    status: 'active',
    joiningDate: '2023-11-12',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    phone: '+91 98765 99999',
    location: 'Kolkata, India',
    manager: 'Rahul Sharma'
  },
  {
    id: 'EMP010',
    name: 'Ananya Das',
    email: 'ananya.das@hrms.io',
    department: 'Finance',
    role: 'Finance Controller',
    status: 'active',
    joiningDate: '2021-06-01',
    avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    phone: '+91 99887 76655',
    location: 'Mumbai, India',
    manager: 'Priya Singh'
  }
];

const initialSalaries: EmployeeSalary[] = [
  {
    id: 'EMP001',
    employeeName: 'Priya Singh',
    employeeAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    employeeDepartment: 'Engineering',
    basicSalary: 60000,
    hra: 24000,
    standardAllowance: 3500,
    performanceBonus: 6000,
    providentFund: 7200,
    professionalTax: 200,
    netSalary: 86100
  },
  {
    id: 'EMP002',
    employeeName: 'Rahul Sharma',
    employeeAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    employeeDepartment: 'Sales & Marketing',
    basicSalary: 50000,
    hra: 20000,
    standardAllowance: 3000,
    performanceBonus: 5000,
    providentFund: 6000,
    professionalTax: 200,
    netSalary: 71800
  },
  {
    id: 'EMP003',
    employeeName: 'Abhishek Kumar',
    employeeAvatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    employeeDepartment: 'Product & Design',
    basicSalary: 55000,
    hra: 22000,
    standardAllowance: 3200,
    performanceBonus: 5500,
    providentFund: 6600,
    professionalTax: 200,
    netSalary: 78900
  },
  {
    id: 'EMP004',
    employeeName: 'Sneha Roy',
    employeeAvatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    employeeDepartment: 'Operations',
    basicSalary: 45000,
    hra: 18000,
    standardAllowance: 2800,
    performanceBonus: 4500,
    providentFund: 5400,
    professionalTax: 200,
    netSalary: 64700
  },
  {
    id: 'EMP005',
    employeeName: 'Neha Gupta',
    employeeAvatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    employeeDepartment: 'Finance',
    basicSalary: 58000,
    hra: 23200,
    standardAllowance: 3400,
    performanceBonus: 5800,
    providentFund: 6960,
    professionalTax: 200,
    netSalary: 83240
  },
  {
    id: 'EMP006',
    employeeName: 'Arjun Patel',
    employeeAvatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    employeeDepartment: 'Engineering',
    basicSalary: 75000,
    hra: 30000,
    standardAllowance: 4500,
    performanceBonus: 8000,
    providentFund: 9000,
    professionalTax: 200,
    netSalary: 108300
  }
];

export const LeaveProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [userRole, setUserRole] = useState<'employee' | 'admin'>('employee');
  const [leaveBalance, setLeaveBalance] = useState<LeaveBalance>(initialBalance);
  const [leaveRequests, setLeaveRequests] = useState<LeaveRequest[]>(initialRequests);
  const [employees] = useState<Employee[]>(initialEmployees);
  const [salaries, setSalaries] = useState<EmployeeSalary[]>(initialSalaries);

  const currentUser = {
    name: 'Arjun Patel',
    email: 'arjun.patel@hrms.io',
    avatar: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=facearea&facepad=2&w=256&h=256&q=80',
    department: 'Engineering'
  };

  const applyLeave = (request: {
    leaveType: string;
    startDate: string;
    endDate: string;
    reason: string;
  }) => {
    const start = new Date(request.startDate);
    const end = new Date(request.endDate);
    const timeDiff = end.getTime() - start.getTime();
    const duration = Math.max(1, Math.ceil(timeDiff / (1000 * 3600 * 24)) + 1);

    const newRequest: LeaveRequest = {
      id: `req-${Date.now()}`,
      employeeName: currentUser.name,
      employeeAvatar: currentUser.avatar,
      employeeDepartment: currentUser.department,
      leaveType: request.leaveType as any,
      startDate: request.startDate,
      endDate: request.endDate,
      duration,
      reason: request.reason,
      status: 'pending',
      appliedDate: new Date().toISOString().split('T')[0]
    };

    setLeaveRequests((prev) => [newRequest, ...prev]);

    // Update local employee used leave balance for simulation
    setLeaveBalance((prev) => {
      const key = request.leaveType as keyof LeaveBalance;
      if (key === 'annual') return { ...prev, annual: Math.max(0, prev.annual - duration), usedAnnual: prev.usedAnnual + duration };
      if (key === 'sick') return { ...prev, sick: Math.max(0, prev.sick - duration), usedSick: prev.usedSick + duration };
      if (key === 'casual') return { ...prev, casual: Math.max(0, prev.casual - duration), usedCasual: prev.usedCasual + duration };
      if (key === 'unpaid') return { ...prev, unpaid: Math.max(0, prev.unpaid - duration), usedUnpaid: prev.usedUnpaid + duration };
      return prev;
    });
  };

  const cancelRequest = (id: string) => {
    setLeaveRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: 'cancelled' as const } : req))
    );
  };

  const approveRequest = (id: string, comments?: string) => {
    setLeaveRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: 'approved', comments } : req))
    );
  };

  const rejectRequest = (id: string, comments?: string) => {
    setLeaveRequests((prev) =>
      prev.map((req) => (req.id === id ? { ...req, status: 'rejected', comments } : req))
    );
  };

  const updateSalary = (
    id: string,
    updated: Omit<EmployeeSalary, 'id' | 'employeeName' | 'employeeAvatar' | 'employeeDepartment' | 'netSalary'>
  ) => {
    setSalaries((prev) =>
      prev.map((sal) => {
        if (sal.id === id) {
          const basic = Number(updated.basicSalary);
          const hra = Number(updated.hra);
          const std = Number(updated.standardAllowance);
          const bonus = Number(updated.performanceBonus);
          const pf = Number(updated.providentFund);
          const pt = Number(updated.professionalTax);

          const netSalary = (basic + hra + std + bonus) - (pf + pt);

          return {
            ...sal,
            basicSalary: basic,
            hra,
            standardAllowance: std,
            performanceBonus: bonus,
            providentFund: pf,
            professionalTax: pt,
            netSalary
          };
        }
        return sal;
      })
    );
  };

  return (
    <LeaveContext.Provider
      value={{
        userRole,
        setUserRole,
        currentUser,
        leaveBalance,
        leaveRequests,
        employees,
        salaries,
        applyLeave,
        cancelRequest,
        approveRequest,
        rejectRequest,
        updateSalary
      }}
    >
      {children}
    </LeaveContext.Provider>
  );
};

export const useLeave = () => {
  const context = useContext(LeaveContext);
  if (context === undefined) {
    throw new Error('useLeave must be used within a LeaveProvider');
  }
  return context;
};
