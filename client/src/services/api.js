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
