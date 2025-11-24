"use client";
import React from 'react';
import { useParams, useRouter } from 'next/navigation';
import { getOrderById } from '@/service/order';
import { Order } from '@/types/order';
import { formatPrice } from '@/lib/formatPrice';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const OrderDetailPage = () => {
  const params = useParams();
  const router = useRouter();
  const orderIdParam = params?.orderId;
  const orderId = Number(orderIdParam);

  const [order, setOrder] = React.useState<Order | null>(null);
  const [loading, setLoading] = React.useState<boolean>(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    if (!orderId || Number.isNaN(orderId)) {
      setError('Invalid order id');
      setLoading(false);
      return;
    }
    let mounted = true;
    async function fetchOrder() {
      try {
        const data = await getOrderById(orderId);
        if (mounted) setOrder(data);
      } catch (err: any) {
        const msg = err.message || 'Failed to load order';
        setError(msg);
        toast.error(msg);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchOrder();
    return () => { mounted = false; };
  }, [orderId]);

  return (
    <div className="px-4 py-8 lg:px-16 lg:py-12 bg-gray-100 dark:bg-gray-800 min-h-[60vh]">
      <div className="max-w-5xl mx-auto">
        <button
          onClick={() => router.back()}
          className="text-sm mb-4 text-primary hover:underline"
        >← Back</button>
        <h1 className="text-2xl lg:text-3xl font-bold text-gray-800 dark:text-white mb-6">Order Details</h1>
        {loading && <p className="text-gray-700 dark:text-gray-300">Loading order...</p>}
        {!loading && error && <p className="text-red-600 dark:text-red-400">{error}</p>}
        {!loading && !error && order && (
          <div className="bg-white dark:bg-gray-900 p-6 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-4">
              <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Order #{order.orderNumber || order.id}</h2>
              <div className="flex flex-wrap gap-2">
                {(() => {
                  const statusMap: Record<string,string> = {
                    pending: 'bg-amber-100 text-amber-800 dark:bg-amber-900/30 dark:text-amber-300',
                    processing: 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300',
                    shipped: 'bg-indigo-100 text-indigo-800 dark:bg-indigo-900/30 dark:text-indigo-300',
                    delivered: 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300',
                    cancelled: 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300',
                    paid: 'bg-emerald-100 text-emerald-800 dark:bg-emerald-900/30 dark:text-emerald-300'
                  };
                  const rawStatus = (order.status || '').toString();
                  const normalized = rawStatus.toLowerCase();
                  const statusClass = statusMap[normalized] || 'bg-gray-200 text-gray-700 dark:bg-gray-800 dark:text-gray-300';
                  return (
                    <span className={`inline-flex items-center rounded-full px-2 py-1 font-semibold uppercase text-xs tracking-wide ${statusClass}`}>{rawStatus.toUpperCase()}</span>
                  );
                })()}
                {(() => {
                  const method = (order.paymentMethod || '').toUpperCase();
                  const methodClass = method === 'STRIPE'
                    ? 'bg-[#635BFF] text-white'
                    : method === 'COD'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-300 text-gray-800 dark:bg-gray-700 dark:text-gray-200';
                  return (
                    <span className={`inline-flex items-center rounded-full px-2 py-1 font-semibold uppercase text-xs tracking-wide ${methodClass}`}>{method}</span>
                  );
                })()}
              </div>
            </div>
            <Separator />
            <div className="mt-4 grid md:grid-cols-2 gap-6">
              <div>
                <h3 className="font-medium mb-2">Amounts</h3>
                <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                  <li>Total: {formatPrice(order.totalAmount)}</li>
                  <li>Subtotal: {formatPrice(order.subtotal)}</li>
                  <li>Tax: {formatPrice(order.tax)}</li>
                  <li>Shipping: {formatPrice(order.shippingFee)}</li>
                  {order.couponCode && <li>Coupon: {order.couponCode}</li>}
                </ul>
              </div>
              <div>
                <h3 className="font-medium mb-2">Shipping Address</h3>
                <ul className="space-y-1 text-sm text-gray-700 dark:text-gray-300">
                  <li>{order.shippingAddress.firstName} {order.shippingAddress.lastName}</li>
                  <li>{order.shippingAddress.address}</li>
                  <li>{order.shippingAddress.city}, {order.shippingAddress.country} {order.shippingAddress.zip}</li>
                  <li>Phone: {order.shippingAddress.phone}</li>
                </ul>
              </div>
            </div>
            <Separator className="my-6" />
            <div>
              <h3 className="font-medium mb-3">Items</h3>
              <div className="space-y-2">
                {order.items.map(item => (
                  <div key={item.id || item.productId} className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 p-3 rounded border border-gray-200 dark:border-gray-700 text-sm">
                    <div>
                      <p className="font-medium text-gray-800 dark:text-white">{item.productName || 'Product #' + item.productId}</p>
                      {item.productSku && <p className="text-xs text-gray-500 dark:text-gray-400">SKU: {item.productSku}</p>}
                    </div>
                    <div className="flex flex-wrap gap-4 text-gray-700 dark:text-gray-300">
                      <span>Qty: {item.quantity}</span>
                      <span>Unit: {formatPrice(item.unitPrice ?? item.price ?? 0)}</span>
                      <span>Line: {formatPrice(item.lineTotal ?? (item.quantity * (item.unitPrice ?? item.price ?? 0)))}</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <Separator className="my-6" />
            <div className="grid sm:grid-cols-2 gap-4 text-xs text-gray-600 dark:text-gray-400">
              <div>
                <p>Placed: {order.placedAt ? new Date(order.placedAt).toLocaleString() : new Date(order.createdAt).toLocaleString()}</p>
                {order.paidAt && <p>Paid: {new Date(order.paidAt).toLocaleString()}</p>}
              </div>
              <div>
                <p>Created: {new Date(order.createdAt).toLocaleString()}</p>
                <p>Updated: {new Date(order.updatedAt).toLocaleString()}</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderDetailPage;