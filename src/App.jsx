import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import LandingPage from './pages/landing/LandingPage';
import LoginPage from './pages/auth/LoginPage';
import RegisterPage from './pages/auth/RegisterPage';
import AwaitingApproval from './pages/auth/AwaitingApproval';
import FarmerDashboard from './pages/farmer/FarmerDashboard';
import RecordCollection from './pages/farmer/RecordCollection';
import BatchList from './pages/farmer/BatchList';
import SyncStatus from './pages/farmer/SyncStatus';
import Settings from './pages/shared/Settings';
import LabDashboard from './pages/lab/LabDashboard';
import IssuedCertificates from './pages/lab/IssuedCertificates';
import LabAnalytics from './pages/lab/LabAnalytics';
import ManufacturerDashboard from './pages/manufacturer/ManufacturerDashboard';
import VerifyArrivals from './pages/manufacturer/VerifyArrivals';
import BuildProduct from './pages/manufacturer/BuildProduct';
import QRManagement from './pages/manufacturer/QRManagement';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminApprovals from './pages/admin/AdminApprovals';
import AdminBatchExplorer from './pages/admin/AdminBatchExplorer';
import AdminFarmerRegistry from './pages/admin/AdminFarmerRegistry';
import AdminAnomalyAlerts from './pages/admin/AdminAnomalyAlerts';
import RegulatorPortal from './pages/regulator/RegulatorPortal';
import RegulatorAuditTrail from './pages/regulator/RegulatorAuditTrail';
import RegulatorTrends from './pages/regulator/RegulatorTrends';
import RegulatorAnomalyReports from './pages/regulator/RegulatorAnomalyReports';
import VerifyPortal from './pages/verify/VerifyPortal';
import { useAuthStore } from './lib/store';

const queryClient = new QueryClient();

function ProtectedRoute({ children, role }) {
  const { user, isAuthenticated } = useAuthStore();

  if (!isAuthenticated) return <Navigate to="/login" />;
  
  // Enforce Registration Approval
  if (user?.isActive === false && user?.role !== 'admin') {
    return <Navigate to="/awaiting-approval" />;
  }

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
          <Route path="/register" element={<RegisterPage />} />
          <Route path="/awaiting-approval" element={<AwaitingApproval />} />
          <Route path="/verify/:batchId" element={<VerifyPortal />} />

          {/* Farmer Routes */}
          <Route path="/farmer" element={
            <ProtectedRoute role="farmer">
              <FarmerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/farmer/record" element={
            <ProtectedRoute role="farmer">
              <RecordCollection />
            </ProtectedRoute>
          } />
          <Route path="/farmer/batches" element={
            <ProtectedRoute role="farmer">
              <BatchList />
            </ProtectedRoute>
          } />
          <Route path="/farmer/sync" element={
            <ProtectedRoute role="farmer">
              <SyncStatus />
            </ProtectedRoute>
          } />
          <Route path="/farmer/settings" element={
            <ProtectedRoute role="farmer">
              <Settings />
            </ProtectedRoute>
          } />

          {/* User Requested Aliases (Guarded by same role for now) */}
          <Route path="/sync" element={
            <ProtectedRoute role="farmer">
              <SyncStatus />
            </ProtectedRoute>
          } />
          <Route path="/settings" element={
            <ProtectedRoute role="farmer">
              <Settings />
            </ProtectedRoute>
          } />

          {/* Lab Routes */}
          <Route path="/lab" element={
            <ProtectedRoute role="lab">
              <LabDashboard />
            </ProtectedRoute>
          } />
          <Route path="/lab/certificates" element={
            <ProtectedRoute role="lab">
              <IssuedCertificates />
            </ProtectedRoute>
          } />
          <Route path="/lab/analytics" element={
            <ProtectedRoute role="lab">
              <LabAnalytics />
            </ProtectedRoute>
          } />

          {/* Manufacturer Routes */}
          <Route path="/manufacturer" element={
            <ProtectedRoute role="manufacturer">
              <ManufacturerDashboard />
            </ProtectedRoute>
          } />
          <Route path="/manufacturer/verify" element={
            <ProtectedRoute role="manufacturer">
              <VerifyArrivals />
            </ProtectedRoute>
          } />
          <Route path="/manufacturer/products" element={
            <ProtectedRoute role="manufacturer">
              <BuildProduct />
            </ProtectedRoute>
          } />
          <Route path="/manufacturer/qr" element={
            <ProtectedRoute role="manufacturer">
              <QRManagement />
            </ProtectedRoute>
          } />

          {/* Admin Routes */}
          <Route path="/admin" element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/approvals" element={
            <ProtectedRoute role="admin">
              <AdminApprovals />
            </ProtectedRoute>
          } />
          <Route path="/admin/batches" element={
            <ProtectedRoute role="admin">
              <AdminBatchExplorer />
            </ProtectedRoute>
          } />
          <Route path="/admin/farmers" element={
            <ProtectedRoute role="admin">
              <AdminFarmerRegistry />
            </ProtectedRoute>
          } />
          <Route path="/admin/alerts" element={
            <ProtectedRoute role="admin">
              <AdminAnomalyAlerts />
            </ProtectedRoute>
          } />

          {/* Regulator Routes */}
          <Route path="/regulator" element={
            <ProtectedRoute role="regulator">
              <RegulatorPortal />
            </ProtectedRoute>
          } />
          <Route path="/regulator/audit" element={
            <ProtectedRoute role="regulator">
              <RegulatorAuditTrail />
            </ProtectedRoute>
          } />
          <Route path="/regulator/trends" element={
            <ProtectedRoute role="regulator">
              <RegulatorTrends />
            </ProtectedRoute>
          } />
          <Route path="/regulator/reports" element={
            <ProtectedRoute role="regulator">
              <RegulatorAnomalyReports />
            </ProtectedRoute>
          } />
        </Routes>
      </Router>
    </QueryClientProvider>
  );
}

export default App;
