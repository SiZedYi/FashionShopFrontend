import { Permission } from './permission';

export interface Role {
  id: number;
  name: string;
  description: string;
  permissions?: Permission[];
  createdAt?: string;
  updatedAt?: string;
}

export interface CreateRolePayload {
  name: string;
  description: string;
  permissionIds: number[];
}

export interface UpdateRolePayload {
  name: string;
  description: string;
  permissionIds: number[];
}

export interface PagedRoles {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  data: Role[];
}
