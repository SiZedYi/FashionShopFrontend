export interface Permission {
  id: number;
  name: string;
  description: string;
  createdAt?: string;
  updatedAt?: string;
}

export interface CreatePermissionPayload {
  name: string;
  description: string;
}

export interface UpdatePermissionPayload {
  name: string;
  description: string;
}

export interface PagedPermissions {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  data: Permission[];
}
