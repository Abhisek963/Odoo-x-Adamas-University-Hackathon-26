import api from './api';
import type { LeaveRequest, LeaveBalance } from '../types';

export const leaveService = {
  /**
   * Fetch all leave requests
   */
  getLeaveRequests: (): Promise<LeaveRequest[]> => {
    return api.get('/leaves');
  },

  /**
   * Fetch leave balance summary
   */
  getLeaveBalance: (): Promise<LeaveBalance> => {
    return api.get('/leaves/balance');
  },

  /**
   * Approve a pending leave request
   */
  approveLeaveRequest: (id: string, comments?: string): Promise<LeaveRequest> => {
    return api.patch(`/leaves/${id}/approve`, { comments });
  },

  /**
   * Reject a pending leave request
   */
  rejectLeaveRequest: (id: string, comments?: string): Promise<LeaveRequest> => {
    return api.patch(`/leaves/${id}/reject`, { comments });
  }
};
