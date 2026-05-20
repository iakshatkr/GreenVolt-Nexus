import { Navigate, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import { AppShell } from '../components/layout/AppShell';
import { AuthGuard } from '../components/layout/AuthGuard';
import { PageTransition } from '../components/shared/PageTransition';
import { AdminDashboardPage } from '../pages/admin/AdminDashboardPage';
import { LandingPage } from '../pages/LandingPage';
import { LoginPage } from '../pages/LoginPage';
import { NotFoundPage } from '../pages/NotFoundPage';
import { OwnerDashboardPage } from '../pages/owner/OwnerDashboardPage';
import { RegisterPage } from '../pages/RegisterPage';
import { DashboardRedirectPage } from '../pages/user/DashboardRedirectPage';
import { UserDashboardPage } from '../pages/user/UserDashboardPage';

export const AppRouter = () => {
  const location = useLocation();

  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        <Route
          path="/"
          element={
            <PageTransition>
              <LandingPage />
            </PageTransition>
          }
        />
        <Route
          path="/login"
          element={
            <PageTransition>
              <LoginPage />
            </PageTransition>
          }
        />
        <Route
          path="/register"
          element={
            <PageTransition>
              <RegisterPage />
            </PageTransition>
          }
        />
        <Route
          path="/app"
          element={
            <AuthGuard>
              <PageTransition>
                <AppShell />
              </PageTransition>
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
        <Route
          path="*"
          element={
            <PageTransition>
              <NotFoundPage />
            </PageTransition>
          }
        />
        <Route path="/dashboard" element={<Navigate to="/app" replace />} />
      </Routes>
    </AnimatePresence>
  );
};
