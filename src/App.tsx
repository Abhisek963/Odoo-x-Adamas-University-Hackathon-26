import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { LeaveProvider } from './context/LeaveContext';
import { MainLayout } from './layouts/MainLayout';
import { Dashboard } from './pages/Dashboard';
import { ApplyLeave } from './pages/ApplyLeave';
import { LeaveHistory } from './pages/LeaveHistory';
import { Employees } from './pages/Employees';
import { LeaveRequestsPage } from './pages/LeaveRequestsPage';
import { PayrollPage } from './pages/PayrollPage';

function App() {
  return (
    <LeaveProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<MainLayout />}>
            <Route index element={<Dashboard />} />
            <Route path="apply" element={<ApplyLeave />} />
            <Route path="history" element={<LeaveHistory />} />
            <Route path="employees" element={<Employees />} />
            <Route path="requests" element={<LeaveRequestsPage />} />
            <Route path="payroll" element={<PayrollPage />} />
            {/* Fallback route */}
            <Route path="*" element={<Dashboard />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </LeaveProvider>
  );
}

export default App;
