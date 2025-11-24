import Cookies from 'js-cookie';
import { CreateOrderPayload, Order, PaymentResult, StripePaymentIntent } from '@/types/order';

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
