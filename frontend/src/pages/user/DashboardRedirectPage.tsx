import { Navigate } from 'react-router-dom';
import { useAuthStore } from '../../store/authStore';

export const DashboardRedirectPage = () => {
  const user = useAuthStore((state) => state.user);

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (user.role === 'station_owner') {
    return <Navigate to="/app/owner" replace />;
  }

  if (user.role === 'admin') {
    return <Navigate to="/app/admin" replace />;
  }

  return <Navigate to="/app/user" replace />;
};

