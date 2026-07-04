const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Base utility for making fetch requests with custom error handling
 */
async function request(endpoint, options = {}) {
  const url = `${API_URL}${endpoint}`;
  
  const headers = {
    'Content-Type': 'application/json',
    ...options.headers,
  };

  const config = {
    ...options,
    headers,
  };

  try {
    const response = await fetch(url, config);
    
    // Parse response body. Note that server always returns JSON for standard responses.
    const data = await response.json();

    if (!response.ok) {
      // Create a localized error object carrying status code
      const error = new Error(data.message || 'An unexpected error occurred');
      error.status = response.status;
      throw error;
    }

    return data;
  } catch (err) {
    // If it's already our custom API error, bubble it up
    if (err.status) throw err;
    
    // Otherwise normalize to a generic network/server error
    const networkErr = new Error('Cannot connect to server. Please check your network or server logs.');
    networkErr.status = 500;
    throw networkErr;
  }
}

export const authAPI = {
  /**
   * Logs in a user
   * @param {string} login - Email or Employee ID
   * @param {string} password - User password
   */
  login: (login, password) => {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ login, password }),
    });
  },

  /**
   * Changes the password of an authenticated user
   * @param {string} currentPassword - Current password
   * @param {string} newPassword - New password
   * @param {string} token - User's authorization token
   */
  changePassword: (currentPassword, newPassword, token) => {
    return request('/auth/change-password', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ currentPassword, newPassword }),
    });
  },
};

export const employeeAPI = {
  /**
   * Fetches the current logged in employee's profile
   */
  getProfile: (token) => {
    return request('/employee/profile', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  /**
   * Updates allowed profile fields
   */
  updateProfile: (profileData, token) => {
    return request('/employee/profile', {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(profileData),
    });
  },

  /**
   * Fetches the current logged-in employee's calculated salary
   */
  getSalary: (token) => {
    return request('/employee/salary', {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },
};

export const leaveAPI = {
  /**
   * Submits a new leave request
   */
  applyLeave: (leaveData, token) => {
    return request('/leaves', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify(leaveData),
    });
  },

  /**
   * Fetches the personal leave history of the logged in user
   */
  getMyLeaves: (token, status) => {
    const query = status ? `?status=${status}` : '';
    return request(`/leaves/my${query}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  /**
   * Cancels a pending leave request
   */
  cancelLeave: (id, token) => {
    return request(`/leaves/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  /**
   * HR Only: Fetches all leave requests with filters
   */
  getAllLeaves: (token, filters = {}) => {
    const { status, leaveType, employeeId } = filters;
    const params = [];
    if (status) params.push(`status=${status}`);
    if (leaveType) params.push(`leaveType=${leaveType}`);
    if (employeeId) params.push(`employeeId=${employeeId}`);
    const query = params.length > 0 ? `?${params.join('&')}` : '';

    return request(`/leaves${query}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });
  },

  /**
   * HR Only: Approves a pending leave request
   */
  approveLeave: (id, reviewComment, token) => {
    return request(`/leaves/${id}/approve`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reviewComment }),
    });
  },

  /**
   * HR Only: Rejects a pending leave request
   */
  rejectLeave: (id, reviewComment, token) => {
    return request(`/leaves/${id}/reject`, {
      method: 'PUT',
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ reviewComment }),
    });
  },
};

