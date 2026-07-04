import { createContext, useState, useEffect, useContext } from 'react';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [mustChangePassword, setMustChangePassword] = useState(false);
  const [loading, setLoading] = useState(true);

  // Restore authentication state after browser refresh
  useEffect(() => {
    const storedToken = localStorage.getItem('token');
    const storedUser = localStorage.getItem('user');
    const storedMustChangePassword = localStorage.getItem('mustChangePassword');

    if (storedToken && storedUser) {
      try {
        setToken(storedToken);
        setUser(JSON.parse(storedUser));
        setMustChangePassword(storedMustChangePassword === 'true');
      } catch (err) {
        console.error('Failed to parse stored authentication state', err);
        logout(); // Clear malformed storage
      }
    }
    setLoading(false);
  }, []);

  const login = (userData, tokenVal, mustChangePass) => {
    setToken(tokenVal);
    setUser(userData);
    setMustChangePassword(mustChangePass);

    localStorage.setItem('token', tokenVal);
    localStorage.setItem('user', JSON.stringify(userData));
    localStorage.setItem('mustChangePassword', mustChangePass ? 'true' : 'false');
  };

  const logout = () => {
    setToken(null);
    setUser(null);
    setMustChangePassword(false);

    localStorage.removeItem('token');
    localStorage.removeItem('user');
    localStorage.removeItem('mustChangePassword');
  };

  const updatePasswordStatus = (mustChangePass) => {
    setMustChangePassword(mustChangePass);
    localStorage.setItem('mustChangePassword', mustChangePass ? 'true' : 'false');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        mustChangePassword,
        loading,
        login,
        logout,
        updatePasswordStatus
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
