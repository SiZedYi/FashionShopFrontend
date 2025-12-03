import { create } from 'zustand';
import Cookies from 'js-cookie';
import { decodeAdminToken } from '@/lib/auth';

interface AdminUser {
  id: number;
  fullName: string;
  email: string;
  roles: string[];
  permissions: string[];
}

type AdminAuthState = {
  adminUser: AdminUser | null;
  setAdminUser: (user: AdminUser | null) => void;
  clearAdminUser: () => void;
  hydrate: () => void;
  isAuthenticated: () => boolean;
  hasPermission: (permission: string) => boolean;
  hasAnyPermission: (permissions: string[]) => boolean;
  hasAllPermissions: (permissions: string[]) => boolean;
  getPermissions: () => string[];
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
  },
  
  hasPermission: (permission: string) => {
    const user = get().adminUser;
    if (!user || !user.permissions) return false;
    return user.permissions.includes(permission);
  },
  
  hasAnyPermission: (permissions: string[]) => {
    const user = get().adminUser;
    if (!user || !user.permissions) return false;
    return permissions.some(p => user.permissions.includes(p));
  },
  
  hasAllPermissions: (permissions: string[]) => {
    const user = get().adminUser;
    if (!user || !user.permissions) return false;
    return permissions.every(p => user.permissions.includes(p));
  },
  
  getPermissions: () => {
    const user = get().adminUser;
    return user?.permissions || [];
  }
}));
