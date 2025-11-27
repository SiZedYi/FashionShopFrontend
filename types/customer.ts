export interface Address {
  id: number;
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Customer {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  roles: string[];
  isActive: boolean;
  createdAt: string;
  addresses: Address[];
}

export interface UserProfile {
  id: number;
  email: string;
  fullName: string;
  phone: string;
  roles: string[];
  isActive: boolean;
  createdAt: string;
  addresses: Address[];
}

export interface PagedCustomers {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  data: Customer[];
}
