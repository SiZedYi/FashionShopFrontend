"use client";

import React from "react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { CheckCircle, Package, Home } from "lucide-react";
import Link from "next/link";

const OrderSuccessPage = () => {
  const router = useRouter();

  return (
    <section className="min-h-screen flex items-center justify-center px-4 py-16 bg-gradient-to-br from-green-50 to-blue-50 dark:from-gray-900 dark:to-gray-800">
      <div className="max-w-md w-full">
        <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-2xl p-8 text-center">
          <div className="mx-auto mb-6 h-20 w-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
            <CheckCircle className="h-12 w-12 text-green-600 dark:text-green-500" />
          </div>

          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Order Placed Successfully!
          </h1>
          
          <p className="text-gray-600 dark:text-gray-300 mb-8">
            Thank you for your purchase. Your order has been received and is being processed.
          </p>

          <div className="bg-gray-50 dark:bg-gray-700/50 rounded-lg p-4 mb-8">
            <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">
              Order Confirmation
            </p>
            <p className="text-lg font-semibold text-gray-900 dark:text-white">
              Check your email for order details
            </p>
          </div>

          <div className="space-y-3">
            <Link href="/my-orders" className="block">
              <Button className="w-full py-6 text-lg flex items-center justify-center gap-2">
                <Package className="h-5 w-5" />
                View My Orders
              </Button>
            </Link>

            <Link href="/" className="block">
              <Button variant="outline" className="w-full py-6 text-lg flex items-center justify-center gap-2">
                <Home className="h-5 w-5" />
                Continue Shopping
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};

export default OrderSuccessPage;
