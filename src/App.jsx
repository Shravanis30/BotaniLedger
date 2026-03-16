import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LandingPage from './pages/landing/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import RecordCollection from './pages/farmer/RecordCollection';
import BatchList from './pages/farmer/BatchList';
import SyncStatus from './pages/farmer/SyncStatus';
import Settings from './pages/shared/Settings';
import LabDashboard from './pages/lab/LabDashboard';
import ManufacturerDashboard from './pages/manufacturer/ManufacturerDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';
import RegulatorPortal from './pages/regulator/RegulatorPortal';
import VerifyPortal from './pages/verify/VerifyPortal';
import { useAuthStore } from './lib/store';

const queryClient = new QueryClient();

function ProtectedRoute({ children, role }) {
  const { user, isAuthenticated } = useAuthStore();
  
  if (!isAuthenticated) return <Navigate to="/login" />;
  if (role && user.role !== role) return <Navigate to="/" />;
  
  return children;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          <Route path="/login" element={<LoginPage />} />
          <Route path="/verify/:batchId" element={<VerifyPortal />} />

          {/* Farmer Routes */}
          <Route path="/farmer" element={
            <ProtectedRoute role="FARMER">
              <FarmerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/farmer/record" element={
            <ProtectedRoute role="FARMER">
              <RecordCollection />
            </ProtectedRoute>
          } />
          <Route path="/farmer/batches" element={
            <ProtectedRoute role="FARMER">
              <BatchList />
            </ProtectedRoute>
          } />
          <Route path="/farmer/sync" element={
            <ProtectedRoute role="FARMER">
              <SyncStatus />
            </ProtectedRoute>
          } />
          <Route path="/farmer/settings" element={
            <ProtectedRoute role="FARMER">
              <Settings />
            </ProtectedRoute>
          } />

          {/* User Requested Aliases (Guarded by same role for now) */}
          <Route path="/sync" element={
            <ProtectedRoute role="FARMER">
              <SyncStatus />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute role="FARMER">
              <Settings />
            </ProtectedRoute>
          } />

          {/* Lab Routes */}
          <Route path="/lab" element={
            <ProtectedRoute role="LABORATORY">
              <LabDashboard />
            </ProtectedRoute>
          } />

          {/* Manufacturer Routes */}
          <Route path="/manufacturer" element={
            <ProtectedRoute role="MANUFACTURER">
              <ManufacturerDashboard />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute role="ADMIN">
              <AdminDashboard />
            </ProtectedRoute>
          } />

          {/* Regulator Routes */}
          <Route path="/regulator" element={
            <ProtectedRoute role="REGULATOR">
              <RegulatorPortal />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
