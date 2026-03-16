import { Navigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';
import type { UserRole } from '../../types';
import { LoadingState } from '../shared/LoadingState';

interface AuthGuardProps {
  children: JSX.Element;
  roles?: UserRole[];
}

export const AuthGuard = ({ children, roles }: AuthGuardProps) => {
  const location = useLocation();
  const { initialized, user } = useAuthStore((state) => ({
    initialized: state.initialized,
    user: state.user
  }));

  if (!initialized) {
    return <LoadingState label="Preparing GreenVolt Nexus..." />;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (roles && !roles.includes(user.role)) {
    if (user.role === 'station_owner') {
      return <Navigate to="/app/owner" replace />;
    }

    if (user.role === 'admin') {
      return <Navigate to="/app/admin" replace />;
    }

    return <Navigate to="/app/user" replace />;
  }

  return children;
};

