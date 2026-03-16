import { create } from 'zustand';
import type { AuthUser } from '../types';

interface AuthState {
  user: AuthUser | null;
  token: string | null;
  initialized: boolean;
  setAuth: (payload: { user: AuthUser; token: string }) => void;
  setUser: (user: AuthUser | null) => void;
  markInitialized: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  token: window.localStorage.getItem('greenvolt-token'),
  initialized: false,
  setAuth: ({ user, token }) => {
    window.localStorage.setItem('greenvolt-token', token);
    set({ user, token, initialized: true });
  },
  setUser: (user) => set({ user }),
  markInitialized: () => set({ initialized: true }),
  logout: () => {
    window.localStorage.removeItem('greenvolt-token');
    set({ user: null, token: null, initialized: true });
  }
}));

