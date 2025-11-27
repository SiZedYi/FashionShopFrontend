import Cookies from 'js-cookie';
import { PagedCustomers, Customer, Address, UserProfile } from '@/types/customer';

const API_URL = process.env.NEXT_PUBLIC_API_URL;

/**
 * Get all customers with pagination and search
 */
export async function getCustomers(params: {
  page?: number;
  size?: number;
  name?: string;
  token?: string;
}): Promise<PagedCustomers | null> {
  const { page = 1, size = 10, name, token } = params;
  
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
    
    if (name) {
      queryParams.append('name', name);
    }

    const response = await fetch(`${API_URL}/customer?${queryParams.toString()}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error('getCustomers failed', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    
    if (!data || !Array.isArray(data.data)) {
      console.error('getCustomers invalid shape:', data);
      return null;
    }

    return data as PagedCustomers;
  } catch (error: any) {
    console.error('getCustomers error:', error);
    return null;
  }
}

/**
 * Get customer by ID
 */
export async function getCustomerById(customerId: number, token?: string): Promise<Customer | null> {
  const authToken = token || Cookies.get('admin_token') || Cookies.get('auth_token');
  
  if (!authToken) {
    console.error('No authentication token available');
    return null;
  }

  try {
    const response = await fetch(`${API_URL}/customer/${customerId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      console.error('getCustomerById failed', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    
    if (!data || !data.id) {
      console.error('getCustomerById invalid shape:', data);
      return null;
    }

    return data as Customer;
  } catch (error: any) {
    console.error('getCustomerById error:', error);
    return null;
  }
}

/**
 * Update customer
 */
export async function updateCustomer(
  customerId: number,
  payload: {
    fullName: string;
    phone: string;
    password?: string;
    isActive: boolean;
  }
): Promise<Customer | null> {
  const authToken = Cookies.get('admin_token') || Cookies.get('auth_token');
  
  if (!authToken) {
    console.error('No authentication token available');
    throw new Error('Please login to update customer');
  }
  console.log(payload, 'pay');
  
  try {
    const response = await fetch(`${API_URL}/customer/${customerId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || 'Failed to update customer');
    }

    const data = await response.json();
    return data as Customer;
  } catch (error: any) {
    console.error('updateCustomer error:', error);
    throw error;
  }
}

/**
 * Get user profile with addresses
 */
export async function getUserProfile(token?: string): Promise<UserProfile> {
  // Support both client-side (js-cookie) and server-side (passed token)
  const authToken = token || Cookies.get('auth_token');
  
  if (!authToken) {
    throw new Error('Please login to view profile');
  }

  try {
    const response = await fetch(`${API_URL}/customer/profile`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || 'Failed to get profile');
    }

    const data = await response.json();
    return data as UserProfile;
  } catch (error: any) {
    console.error('getUserProfile error:', error);
    throw error;
  }
}

/**
 * Get all addresses for current user
 */
export async function getAddresses(token?: string): Promise<Address[]> {
  // Support both client-side (js-cookie) and server-side (passed token)
  const authToken = token || Cookies.get('auth_token');
  
  if (!authToken) {
    throw new Error('Please login to view addresses');
  }

  try {
    const response = await fetch(`${API_URL}/customer/address`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || 'Failed to get addresses');
    }

    const data = await response.json();
    return data as Address[];
  } catch (error: any) {
    console.error('getAddresses error:', error);
    throw error;
  }
}

/**
 * Get address by ID
 */
export async function getAddressById(addressId: number, token?: string): Promise<Address> {
  // Support both client-side (js-cookie) and server-side (passed token)
  const authToken = token || Cookies.get('auth_token');
  
  if (!authToken) {
    throw new Error('Please login to view address');
  }

  try {
    const response = await fetch(`${API_URL}/customer/address/${addressId}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store'
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || 'Failed to get address');
    }

    const data = await response.json();
    return data as Address;
  } catch (error: any) {
    console.error('getAddressById error:', error);
    throw error;
  }
}

/**
 * Create a new address
 */
export async function createAddress(payload: {
  fullName: string;
  phone: string;
  line1: string;
  line2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}): Promise<Address> {
  const authToken = Cookies.get('auth_token');
  
  if (!authToken) {
    throw new Error('Please login to create address');
  }

  try {
    const response = await fetch(`${API_URL}/customer/address`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || 'Failed to create address');
    }

    const data = await response.json();
    return data as Address;
  } catch (error: any) {
    console.error('createAddress error:', error);
    throw error;
  }
}

/**
 * Update an address
 */
export async function updateAddress(
  addressId: number,
  payload: {
    fullName: string;
    phone: string;
    line1: string;
    line2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    isDefault: boolean;
  }
): Promise<Address> {
  const authToken = Cookies.get('auth_token');
  
  if (!authToken) {
    throw new Error('Please login to update address');
  }

  try {
    const response = await fetch(`${API_URL}/customer/address/${addressId}`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || 'Failed to update address');
    }

    const data = await response.json();
    return data as Address;
  } catch (error: any) {
    console.error('updateAddress error:', error);
    throw error;
  }
}
