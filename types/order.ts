export interface ShippingAddress {
  firstName: string;
  lastName: string;
  address: string;
  phone: string;
  city: string;
  zip: string;
  country: string;
}

export interface OrderItem {
  productId: number;
  quantity: number;
  price: number;
  color?: string;
  productName?: string;
  productImage?: string;
}

export interface CreateOrderPayload {
  shippingAddress: ShippingAddress;
  items: OrderItem[];
  totalAmount: number;
  subtotal: number;
  tax: number;
  shippingFee: number;
  couponCode?: string;
  paymentMethod: 'STRIPE' | 'COD'; // Cash on Delivery or Stripe
}

export interface Order {
  id: number;
  orderNumber: string;
  customerId: number;
  items: OrderItem[];
  shippingAddress: ShippingAddress;
  totalAmount: number;
  subtotal: number;
  tax: number;
  shippingFee: number;
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED';
  paymentMethod: string;
  createdAt: string;
  updatedAt: string;
}

export interface StripePaymentIntent {
  clientSecret: string;
  orderId: number;
  amount: number;
}

export interface PaymentResult {
  success: boolean;
  orderId?: number;
  orderNumber?: string;
  message?: string;
  error?: string;
}
