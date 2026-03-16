import { useEffect } from 'react';
import { apiClient } from '../api/client';
import { useAuthStore } from '../store/authStore';
import type { ApiResponse, AuthUser } from '../types';

export const useBootstrapAuth = () => {
  const token = useAuthStore((state) => state.token);
  const user = useAuthStore((state) => state.user);
  const setUser = useAuthStore((state) => state.setUser);
  const logout = useAuthStore((state) => state.logout);
  const markInitialized = useAuthStore((state) => state.markInitialized);

  useEffect(() => {
    if (!token) {
      markInitialized();
      return;
    }

    if (user) {
      markInitialized();
      return;
    }

    apiClient
      .get<ApiResponse<AuthUser>>('/auth/me')
      .then((response) => {
        setUser(response.data.data);
        markInitialized();
      })
      .catch(() => {
        logout();
      });
  }, [logout, markInitialized, setUser, token, user]);
};

