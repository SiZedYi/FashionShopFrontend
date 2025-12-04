import Cookies from 'js-cookie';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

export interface PagedUsers {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  data: AdminUser[];
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

/**
 * Get all admin users with pagination and search
 */
export async function getUsers(params: {
  page?: number;
  size?: number;
  email?: string;
  token?: string;
}): Promise<PagedUsers | null> {
  const { page = 1, size = 20, email, token } = params;
  
  // Get token from params or cookies
  const authToken = token || Cookies.get('admin_token') || Cookies.get('auth_token');
  
  if (!authToken) {
    console.error('No authentication token available');
    return null;
  }

  try {
    const queryParams = new URLSearchParams({
      page: String(page),
      size: String(size),
    });
    
    if (email) {
      queryParams.append('q', email);
    }

    const response = await fetch(`${API_URL}/admin/users?${queryParams.toString()}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error('getUsers failed', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    
    if (!data || !Array.isArray(data.data)) {
      console.error('getUsers invalid shape:', data);
      return null;
    }

    return data as PagedUsers;
  } catch (error: any) {
    console.error('getUsers error:', error);
    return null;
  }
}

/**
 * Get user by ID
 */
export async function getUserById(userId: number, token?: string): Promise<AdminUser | null> {
  const authToken = token || Cookies.get('admin_token') || Cookies.get('auth_token');
  
  if (!authToken) {
    console.error('No authentication token available');
    return null;
  }

  try {
    const response = await fetch(`${API_URL}/admin/users/${userId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error('getUserById failed', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    
    if (!data || !data.id) {
      console.error('getUserById invalid shape:', data);
      return null;
    }

    return data as AdminUser;
  } catch (error: any) {
    console.error('getUserById error:', error);
    return null;
  }
}

export interface CreateUserPayload {
  email: string;
  password: string;
  fullName: string;
  phone: string;
  isActive: boolean;
  roles: string[];
}

export interface UpdateUserPayload {
  fullName: string;
  phone: string;
  password?: string;
  isActive: boolean;
}

export interface UpdateUserRolesPayload {
  roles: string[];
}

/**
 * Create a new user
 */
export async function createUser(payload: CreateUserPayload): Promise<AdminUser> {
  const authToken = Cookies.get('admin_token') || Cookies.get('auth_token');
  
  if (!authToken) {
    throw new Error('Please login to create user');
  }

  try {
    const response = await fetch(`${API_URL}/admin/users`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || 'Failed to create user');
    }

    const data = await response.json();
    return data as AdminUser;
  } catch (error: any) {
    console.error('createUser error:', error);
    throw error;
  }
}

/**
 * Update a user
 */
export async function updateUser(userId: number, payload: UpdateUserPayload): Promise<AdminUser> {
  const authToken = Cookies.get('admin_token') || Cookies.get('auth_token');
  
  if (!authToken) {
    throw new Error('Please login to update user');
  }

  try {
    const response = await fetch(`${API_URL}/admin/users/${userId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || 'Failed to update user');
    }

    const data = await response.json();
    return data as AdminUser;
  } catch (error: any) {
    console.error('updateUser error:', error);
    throw error;
  }
}

/**
 * Update user roles
 */
export async function updateUserRoles(userId: number, payload: UpdateUserRolesPayload): Promise<AdminUser> {
  const authToken = Cookies.get('admin_token') || Cookies.get('auth_token');
  
  if (!authToken) {
    throw new Error('Please login to update user roles');
  }

  try {
    const response = await fetch(`${API_URL}/admin/users/${userId}/roles`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || 'Failed to update user roles');
    }

    const data = await response.json();
    return data as AdminUser;
  } catch (error: any) {
    console.error('updateUserRoles error:', error);
    throw error;
  }
}
