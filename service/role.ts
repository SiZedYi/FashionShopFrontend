import Cookies from 'js-cookie';
import { Role, CreateRolePayload, UpdateRolePayload, PagedRoles } from '@/types/role';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Get all roles with pagination
 */
export async function getRoles(params: {
  page?: number;
  size?: number;
  token?: string;
}): Promise<PagedRoles | null> {
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

    const response = await fetch(`${API_URL}/admin/roles?${query}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error('getRoles failed', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    
    if (!data || !Array.isArray(data.data)) {
      console.error('getRoles invalid shape:', data);
      return null;
    }

    return data as PagedRoles;
  } catch (error: any) {
    console.error('getRoles error:', error);
    return null;
  }
}

/**
 * Get all roles without pagination
 */
export async function getAllRoles(token?: string): Promise<Role[]> {
  const authToken = token || Cookies.get('admin_token') || Cookies.get('auth_token');
  
  if (!authToken) {
    throw new Error('Please login to view roles');
  }

  try {
    const response = await fetch(`${API_URL}/admin/roles/all`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || 'Failed to get roles');
    }

    const data = await response.json();
    return data as Role[];
  } catch (error: any) {
    console.error('getAllRoles error:', error);
    throw error;
  }
}

/**
 * Get role by ID
 */
export async function getRoleById(id: number, token?: string): Promise<Role | null> {
  const authToken = token || Cookies.get('admin_token') || Cookies.get('auth_token');
  
  if (!authToken) {
    console.error('No authentication token available');
    return null;
  }

  try {
    const response = await fetch(`${API_URL}/admin/roles/${id}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error('getRoleById failed', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    return data as Role;
  } catch (error: any) {
    console.error('getRoleById error:', error);
    return null;
  }
}

/**
 * Create a new role
 */
export async function createRole(payload: CreateRolePayload): Promise<Role> {
  const authToken = Cookies.get('admin_token') || Cookies.get('auth_token');
  
  if (!authToken) {
    throw new Error('Please login to create role');
  }

  try {
    const response = await fetch(`${API_URL}/admin/roles`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || 'Failed to create role');
    }

    const data = await response.json();
    return data as Role;
  } catch (error: any) {
    console.error('createRole error:', error);
    throw error;
  }
}

/**
 * Update a role
 */
export async function updateRole(id: number, payload: UpdateRolePayload): Promise<Role> {
  const authToken = Cookies.get('admin_token') || Cookies.get('auth_token');
  
  if (!authToken) {
    throw new Error('Please login to update role');
  }

  try {
    const response = await fetch(`${API_URL}/admin/roles/${id}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || 'Failed to update role');
    }

    const data = await response.json();
    return data as Role;
  } catch (error: any) {
    console.error('updateRole error:', error);
    throw error;
  }
}

/**
 * Delete a role
 */
export async function deleteRole(id: number): Promise<void> {
  const authToken = Cookies.get('admin_token') || Cookies.get('auth_token');
  
  if (!authToken) {
    throw new Error('Please login to delete role');
  }

  try {
    const response = await fetch(`${API_URL}/admin/roles/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || 'Failed to delete role');
    }
  } catch (error: any) {
    console.error('deleteRole error:', error);
    throw error;
  }
}
