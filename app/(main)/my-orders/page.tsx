"use client";
import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { getMyOrders } from '@/service/order';
import { Order } from '@/types/order';
import { formatPrice } from '@/lib/formatPrice';
import { Separator } from '@/components/ui/separator';
import { toast } from 'sonner';

const MyOrdersPage = () => {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let mounted = true;
    async function fetchOrders() {
      try {
        const data = await getMyOrders();
        if (mounted) {
          setOrders(data);
        }
      } catch (err: any) {
        const msg = err.message || 'Failed to load orders';
        setError(msg);
        toast.error(msg);
      } finally {
        if (mounted) setLoading(false);
      }
    }
    fetchOrders();
    return () => { mounted = false; };
  }, []);

  return (
    <div className="px-4 py-8 lg:px-16 lg:py-12 bg-gray-100 dark:bg-gray-800 min-h-[60vh]">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl lg:text-4xl font-bold text-gray-800 dark:text-white mb-6">My Orders</h1>
        {loading && (
          <p className="text-gray-700 dark:text-gray-300">Loading orders...</p>
        )}
        {!loading && error && (
          <p className="text-red-600 dark:text-red-400">{error}</p>
        )}
        {!loading && !error && orders.length === 0 && (
          <p className="text-gray-700 dark:text-gray-300">You have no orders yet.</p>
        )}
        <div className="space-y-6">
          {orders.map(order => {
            const placedDate = order.placedAt || order.createdAt;
            return (
              <div key={order.id} className="bg-white dark:bg-gray-900 p-5 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700">
                <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2 mb-2">
                  <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Order #{order.orderNumber || order.id}</h2>
                  <span className="text-sm text-gray-600 dark:text-gray-300">Placed: {new Date(placedDate).toLocaleString()}</span>
                </div>
                <div className="flex flex-wrap gap-2 text-sm mb-4">
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
                <Separator />
                <div className="mt-4 flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                  <div className="text-sm text-gray-700 dark:text-gray-300">
                    <p className="font-medium">Total: {formatPrice(order.totalAmount)}</p>
                    <p className="text-xs">Subtotal: {formatPrice(order.subtotal)} | Tax: {formatPrice(order.tax)} | Shipping: {formatPrice(order.shippingFee)}</p>
                  </div>
                  <Link href={`/my-orders/${order.id}`} className="text-sm font-medium text-primary hover:underline">View Details →</Link>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default MyOrdersPage;
