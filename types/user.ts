export interface User {
  id?: number;
  fullName: string;
  email: string;
  phone?: string;
  avatar?: string;
  roles?: string[];
  isActive?: boolean;
  createdAt?: string; // ISO date string
}

export interface AdminUser {
  id: number;
  email: string;
  fullName: string;
  phone: string | null;
  roles: string[];
  isActive: boolean;
  createdAt: string;
  addresses: any;
}

export interface PagedUsers {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  data: AdminUser[];
}
