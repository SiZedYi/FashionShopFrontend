import Cookies from 'js-cookie';
import { Permission, CreatePermissionPayload, UpdatePermissionPayload, PagedPermissions } from '@/types/permission';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Get all permissions with pagination
 */
export async function getPermissions(params: {
  page?: number;
  size?: number;
  token?: string;
}): Promise<PagedPermissions | null> {
  const { page = 1, size = 10, token } = params;
  
  const authToken = token || Cookies.get('admin_token') || Cookies.get('auth_token');
  
  if (!authToken) {
    console.error('No authentication token available');
    return null;
  }

  try {
    const query = new URLSearchParams({
      page: String(page),
      size: String(size),
    }).toString();

    const response = await fetch(`${API_URL}/admin/permissions?${query}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error('getPermissions failed', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    
    if (!data || !Array.isArray(data.data)) {
      console.error('getPermissions invalid shape:', data);
      return null;
    }

    return data as PagedPermissions;
  } catch (error: any) {
    console.error('getPermissions error:', error);
    return null;
  }
}

/**
 * Get all permissions without pagination
 */
export async function getAllPermissions(token?: string): Promise<Permission[]> {
  const authToken = token || Cookies.get('admin_token') || Cookies.get('auth_token');
  
  if (!authToken) {
    throw new Error('Please login to view permissions');
  }

  try {
    const response = await fetch(`${API_URL}/admin/permissions/all`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || 'Failed to get permissions');
    }

    const data = await response.json();
    return data as Permission[];
  } catch (error: any) {
    console.error('getAllPermissions error:', error);
    throw error;
  }
}

/**
 * Get permission by ID
 */
export async function getPermissionById(id: number, token?: string): Promise<Permission | null> {
  const authToken = token || Cookies.get('admin_token') || Cookies.get('auth_token');
  
  if (!authToken) {
    console.error('No authentication token available');
    return null;
  }

  try {
    const response = await fetch(`${API_URL}/admin/permissions/${id}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error('getPermissionById failed', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    return data as Permission;
  } catch (error: any) {
    console.error('getPermissionById error:', error);
    return null;
  }
}

/**
 * Create a new permission
 */
export async function createPermission(payload: CreatePermissionPayload): Promise<Permission> {
  const authToken = Cookies.get('admin_token') || Cookies.get('auth_token');
  
  if (!authToken) {
    throw new Error('Please login to create permission');
  }

  try {
    const response = await fetch(`${API_URL}/admin/permissions`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || 'Failed to create permission');
    }

    const data = await response.json();
    return data as Permission;
  } catch (error: any) {
    console.error('createPermission error:', error);
    throw error;
  }
}

/**
 * Update a permission
 */
export async function updatePermission(id: number, payload: UpdatePermissionPayload): Promise<Permission> {
  const authToken = Cookies.get('admin_token') || Cookies.get('auth_token');
  
  if (!authToken) {
    throw new Error('Please login to update permission');
  }

  try {
    const response = await fetch(`${API_URL}/admin/permissions/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || 'Failed to update permission');
    }

    const data = await response.json();
    return data as Permission;
  } catch (error: any) {
    console.error('updatePermission error:', error);
    throw error;
  }
}

/**
 * Delete a permission
 */
export async function deletePermission(id: number): Promise<void> {
  const authToken = Cookies.get('admin_token') || Cookies.get('auth_token');
  
  if (!authToken) {
    throw new Error('Please login to delete permission');
  }

  try {
    const response = await fetch(`${API_URL}/admin/permissions/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || 'Failed to delete permission');
    }
  } catch (error: any) {
    console.error('deletePermission error:', error);
    throw error;
  }
}
