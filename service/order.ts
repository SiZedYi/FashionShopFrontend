import Cookies from 'js-cookie';
import { CreateOrderPayload, Order, PaymentResult, StripePaymentIntent, PagedOrders } from '@/types/order';

const API_URL = process.env.NEXT_PUBLIC_API_URL;
console.log('api', API_URL);

/**
 * Create a new order
 */
export async function createOrder(payload: CreateOrderPayload): Promise<Order> {
  const token = Cookies.get('auth_token');
  
  if (!token) {
    throw new Error('Please login to place an order');
  }

  try {
    const response = await fetch(`${API_URL}/orders`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || 'Failed to create order');
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to create order');
  }
}

/**
 * Create Stripe payment intent for an order
 */
export async function createStripePaymentIntent(orderId: number): Promise<StripePaymentIntent> {
  const token = Cookies.get('auth_token');
  
  if (!token) {
    throw new Error('Please login to proceed with payment');
  }

  try {
    const response = await fetch(`${API_URL}/payments/stripe/create-payment-intent`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ orderId })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || 'Failed to create payment intent');
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to create payment intent');
  }
}

/**
 * Confirm Stripe payment
 */
export async function confirmStripePayment(orderId: number, paymentIntentId: string): Promise<PaymentResult> {
  const token = Cookies.get('auth_token');
  
  if (!token) {
    throw new Error('Please login to confirm payment');
  }

  try {
    const response = await fetch(`${API_URL}/payments/stripe/confirm`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify({ orderId, paymentIntentId })
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || 'Failed to confirm payment');
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to confirm payment');
  }
}

/**
 * Get order by ID
 */
export async function getOrderById(orderId: number): Promise<Order> {
  const token = Cookies.get('auth_token');
  
  if (!token) {
    throw new Error('Please login to view order');
  }

  try {
    const response = await fetch(`${API_URL}/orders/${orderId}`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || 'Failed to get order');
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get order');
  }
}

/**
 * Get all orders for current user
 */
export async function getMyOrders(): Promise<Order[]> {
  const token = Cookies.get('auth_token');
  
  if (!token) {
    throw new Error('Please login to view orders');
  }

  try {
    const response = await fetch(`${API_URL}/orders/my-orders`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || 'Failed to get orders');
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get orders');
  }
}

/**
 * Get paged orders for current user with sorting.
 * Supports both array response and Spring-style Page object.
 */
export interface PagedOrdersResponse {
  content: Order[];
  totalElements?: number;
  totalPages?: number;
  page?: number; // 1-based page index for UI consumption
  size?: number;
  number?: number; // spring current page index (0-based, legacy)
  last?: boolean; // indicates this is the last page
}

export async function getMyOrdersPaged(params: {
  page?: number; // 1-based coming from UI
  size?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
}): Promise<PagedOrdersResponse> {
  const token = Cookies.get('auth_token');
  if (!token) {
    throw new Error('Please login to view orders');
  }
  const { page = 1, size = 10, sortBy = 'createdAt', sortDirection = 'DESC' } = params;
  const query = new URLSearchParams({
    page: String(page),
    size: String(size),
    sortBy,
    sortDirection,
  }).toString();
  try {
    const response = await fetch(`${API_URL}/orders/my-orders?${query}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || 'Failed to get orders');
    }
    const data = await response.json();
    // NEW shape support: { page, size, totalElements, totalPages, last, data: [...] }
    if (data && Array.isArray(data.data)) {
      const rawPage = typeof data.page === 'number' ? data.page : undefined;
      // Detect zero-based if backend returns 0 while UI requested 1.
      const zeroBased = rawPage === 0 && page === 1;
      const uiPage = rawPage !== undefined ? (zeroBased ? rawPage + 1 : rawPage) : page;
      return {
        content: data.data,
        totalElements: data.totalElements,
        totalPages: data.totalPages,
        page: uiPage,
        size: data.size ?? size,
        last: !!data.last,
      };
    }
    // If backend returns a Spring Page object { content: [...], number, totalPages, ... }
    if (data && Array.isArray(data.content)) {
      const effectiveZeroIndex = data.page ?? data.number;
      const zeroBased = typeof effectiveZeroIndex === 'number' && effectiveZeroIndex === 0 && page === 1;
      const uiPage = typeof effectiveZeroIndex === 'number'
        ? (zeroBased ? effectiveZeroIndex + 1 : effectiveZeroIndex)
        : page;
      return {
        content: data.content,
        totalElements: data.totalElements,
        totalPages: data.totalPages,
        page: uiPage,
        size: data.size ?? size,
        last: !!data.last,
      };
    }
    // If backend returns plain array
    if (Array.isArray(data)) {
      return {
        content: data,
        page,
        size,
      };
    }
    // Unknown shape -> attempt to find orders field
    if (Array.isArray(data.orders)) {
      return {
        content: data.orders,
        page,
        size,
      };
    }
    throw new Error('Unexpected orders response shape');
  } catch (error: any) {
    throw new Error(error.message || 'Failed to get orders');
  }
}

/**
 * Cancel an order
 */
export async function cancelOrder(orderId: number): Promise<Order> {
  const token = Cookies.get('auth_token');
  
  if (!token) {
    throw new Error('Please login to cancel order');
  }

  try {
    const response = await fetch(`${API_URL}/orders/${orderId}/cancel`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      throw new Error(errorData.message || errorData.error || 'Failed to cancel order');
    }

    const data = await response.json();
    return data;
  } catch (error: any) {
    throw new Error(error.message || 'Failed to cancel order');
  }
}

/**
 * Get all orders for admin dashboard with pagination and sorting
 */
export async function getAllOrdersAdmin(params: {
  page?: number;
  size?: number;
  sortBy?: string;
  sortDirection?: 'ASC' | 'DESC';
  token?: string;
}): Promise<PagedOrders | null> {
  const { page = 1, size = 10, sortBy = 'createdAt', sortDirection = 'DESC', token } = params;
  
  // Try to get token from params or cookies (admin_token for admin routes)
  const authToken = token || Cookies.get('admin_token') || Cookies.get('auth_token');
  
  if (!authToken) {
    console.error('No authentication token available');
    return null;
  }

  try {
    const query = new URLSearchParams({
      page: String(page),
      size: String(size),
      sortBy,
      sortDirection,
    }).toString();

    const response = await fetch(`${API_URL}/admin/orders?${query}`, {
      headers: {
        'Authorization': `Bearer ${authToken}`,
        'Content-Type': 'application/json'
      },
      cache: 'no-store' // Ensure fresh data on each request
    });

    if (!response.ok) {
      console.error('getAllOrdersAdmin failed', response.status, response.statusText);
      return null;
    }

    const data = await response.json();
    
    if (!data || !Array.isArray(data.data)) {
      console.error('getAllOrdersAdmin invalid shape:', data);
      return null;
    }

    return data as PagedOrders;
  } catch (error: any) {
    console.error('getAllOrdersAdmin error:', error);
    return null;
  }
}
