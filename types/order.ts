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
  // Common fields
  productId: number;
  quantity: number;
  // Field used when creating an order (mapped from cart line price)
  price?: number;
  // Response-only fields
  id?: number;
  productName?: string;
  productSku?: string;
  unitPrice?: number; // mirrors backend unitPrice
  lineTotal?: number; // mirrors backend lineTotal
  // Front-end enrichment fields (UI convenience)
  color?: string;
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
  items: OrderItem[]; // unified representation
  shippingAddress: ShippingAddress;
  totalAmount: number;
  subtotal: number;
  tax: number;
  shippingFee: number;
  couponCode?: string;
  // Allow lowercase variants to be compatible with potential backend casing
  status: 'PENDING' | 'PROCESSING' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED' | 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'PENDING' | 'PAID' | 'FAILED' | 'pending' | 'paid' | 'failed';
  paymentMethod: string;
  placedAt?: string; // when the order was placed
  paidAt?: string;   // when the payment completed (if applicable)
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

export interface PagedOrders {
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  last: boolean;
  data: Order[];
}
