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
