import { create } from 'zustand';
import Cookies from 'js-cookie';

interface AdminUser {
  id: number;
  fullName: string;
  email: string;
  roles: string[];
}

type AdminAuthState = {
  adminUser: AdminUser | null;
  setAdminUser: (user: AdminUser | null) => void;
  clearAdminUser: () => void;
  hydrate: () => void;
  isAuthenticated: () => boolean;
};

export const useAdminAuthStore = create<AdminAuthState>((set, get) => ({
  adminUser: null,
  
  setAdminUser: (user) => {
    set({ adminUser: user });
    try {
      if (user) {
        localStorage.setItem('admin_user', JSON.stringify(user));
      } else {
        localStorage.removeItem('admin_user');
      }
    } catch {}
  },
  
  clearAdminUser: () => {
    set({ adminUser: null });
    try {
      localStorage.removeItem('admin_user');
      Cookies.remove('admin_token');
    } catch {}
  },
  
  hydrate: () => {
    try {
      const raw = localStorage.getItem('admin_user');
      if (raw) {
        const parsed: AdminUser = JSON.parse(raw);
        set({ adminUser: parsed });
      }
    } catch {}
  },
  
  isAuthenticated: () => {
    const token = Cookies.get('admin_token');
    const user = get().adminUser;
    return !!token && !!user;
  }
}));
