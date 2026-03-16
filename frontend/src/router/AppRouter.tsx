import { Navigate, Route, Routes } from 'react-router-dom';
import { AppShell } from '../components/layout/AppShell';
import { AuthGuard } from '../components/layout/AuthGuard';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { OwnerDashboardPage } from '../pages/owner/OwnerDashboardPage';
import { RegisterPage } from '../pages/RegisterPage';
import { DashboardRedirectPage } from '../pages/user/DashboardRedirectPage';
import { UserDashboardPage } from '../pages/user/UserDashboardPage';

export const AppRouter = () => (
  <Routes>
    <Route path="/" element={<LandingPage />} />
    <Route path="/login" element={<LoginPage />} />
    <Route path="/register" element={<RegisterPage />} />
    <Route
      path="/app"
      element={
        <AuthGuard>
          <AppShell />
        </AuthGuard>
      }
    >
      <Route index element={<DashboardRedirectPage />} />
      <Route
        path="user"
        element={
          <AuthGuard roles={['user', 'admin']}>
            <UserDashboardPage />
          </AuthGuard>
        }
      />
      <Route
        path="owner"
        element={
          <AuthGuard roles={['station_owner', 'admin']}>
            <OwnerDashboardPage />
          </AuthGuard>
        }
      />
      <Route
        path="admin"
        element={
          <AuthGuard roles={['admin']}>
            <AdminDashboardPage />
          </AuthGuard>
        }
      />
    </Route>
    <Route path="*" element={<NotFoundPage />} />
    <Route path="/dashboard" element={<Navigate to="/app" replace />} />
  </Routes>
);

