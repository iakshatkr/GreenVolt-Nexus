import { create } from 'zustand';
import type { AuthUser } from '../types';

interface AuthState {
  user: AuthUser | null;
  initialized: boolean;
  setAuth: (payload: { user: AuthUser }) => void;
  setUser: (user: AuthUser | null) => void;
  markInitialized: () => void;
  logout: () => void;
}

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  initialized: false,
  setAuth: ({ user }) => {
    set({ user, initialized: true });
  },
  setUser: (user) => set({ user }),
  markInitialized: () => set({ initialized: true }),
  logout: () => {
    set({ user: null, initialized: true });
  }
}));
