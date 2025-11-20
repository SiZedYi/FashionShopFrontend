import { create } from 'zustand';
import type { User } from '@/types/user';
import Cookies from 'js-cookie';
import { getCurrentUser } from '@/service/auth';

type AuthState = {
  user: User | null;
  setUser: (u: User | null) => void;
  clearUser: () => void;
  hydrate: () => void;
  syncUserFromServer: () => Promise<void>;
};

export const useAuthStore = create<AuthState>((set) => ({
  user: null,
  setUser: (u) => {
    set({ user: u });
    try {
      if (u) {
        localStorage.setItem('auth_user', JSON.stringify(u));
      } else {
        localStorage.removeItem('auth_user');
      }
    } catch {}
  },
  clearUser: () => {
    set({ user: null });
    try { localStorage.removeItem('auth_user'); } catch {}
  },
  hydrate: () => {
    try {
      const raw = localStorage.getItem('auth_user');
      if (raw) {
        const parsed: User = JSON.parse(raw);
        set({ user: parsed });
      }
    } catch {}
  },
  syncUserFromServer: async () => {
    try {
      const token = Cookies.get('auth_token');
      if (!token) return;
      const remote = await getCurrentUser(token);
      if (remote) {
        // Map remote response to User shape if necessary
        const mapped: User = {
          id: remote.id,
            fullName: remote.fullName,
            email: remote.email,
            phone: remote.phone,
            roles: remote.roles,
            isActive: remote.isActive,
            createdAt: remote.createdAt,
        };
        set({ user: mapped });
        localStorage.setItem('auth_user', JSON.stringify(mapped));
      }
    } catch {}
  }
}));
