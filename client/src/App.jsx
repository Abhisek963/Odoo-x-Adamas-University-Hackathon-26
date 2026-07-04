import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { ProtectedRoute } from './components/ProtectedRoute';
import { RoleRoute } from './components/RoleRoute';
import Login from './pages/Login';
import ChangePassword from './pages/ChangePassword';
import EmployeeDashboard from './pages/EmployeeDashboard';
import HrDashboard from './pages/HrDashboard';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<Login />} />

          {/* Protected Route with Force Password Change Lifecycle Enforcement */}
          <Route 
            path="/change-password" 
            element={
              <ProtectedRoute>
                <ChangePassword />
              </ProtectedRoute>
            } 
          />

          {/* Protected Employee Routes (Allowed for both employee & hr roles for testing) */}
          <Route 
            path="/employee" 
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['employee', 'hr']}>
                  <EmployeeDashboard />
                </RoleRoute>
              </ProtectedRoute>
            } 
          />

          {/* Protected HR Manager Routes */}
          <Route 
            path="/hr" 
            element={
              <ProtectedRoute>
                <RoleRoute allowedRoles={['hr']}>
                  <HrDashboard />
                </RoleRoute>
              </ProtectedRoute>
            } 
          />

          {/* Root Redirect Route */}
          <Route path="*" element={<Navigate to="/login" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
