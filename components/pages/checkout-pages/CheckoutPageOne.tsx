"use client";

import OrderSummaryForCheckout from "@/components/carts/OrderSummaryForCheckout";
import CheckoutForm from "@/components/forms/CheckoutForm";
import CouponCodeForm from "@/components/forms/CouponCodeForm";
import { Separator } from "@/components/ui/separator";
import React from "react";
import { useCheckoutStore } from "@/store/checkoutStore";
import { AlertCircle } from "lucide-react";

const CheckoutPageOne = () => {
  const { shippingAddress } = useCheckoutStore();

  return (
    <section className="px-4 py-4 lg:px-16  bg-white dark:bg-gray-800">
      <div className="max-w-screen-xl mx-auto">
        <div className="mb-4">
          <h1 className="text-3xl lg:text-4xl font-bold text-gray-900 dark:text-white ">
            Checkout
          </h1>
          <p>Please fill out the address form if you haven&apos;t save it</p>
          <Separator className="dark:bg-white/50 mt-2" />
        </div>

        {!shippingAddress && (
          <div className="mb-6 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg flex items-start gap-3">
            <AlertCircle className="h-5 w-5 text-yellow-600 dark:text-yellow-500 flex-shrink-0 mt-0.5" />
            <div>
              <h3 className="font-semibold text-yellow-800 dark:text-yellow-200">
                Shipping Address Required
              </h3>
              <p className="text-sm text-yellow-700 dark:text-yellow-300">
                Please fill in your shipping address below and click &quot;Save&quot; before placing an order.
              </p>
            </div>
          </div>
        )}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Shipping Address */}
          <div>
            <div className="bg-gray-100 dark:bg-gray-700 p-6 rounded-lg">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                Shipping Address
              </h2>
              <CheckoutForm />
            </div>
              <CouponCodeForm />
          </div>
          {/* Order Summary */}
          <OrderSummaryForCheckout />
        </div>
      </div>
    </section>
  );
};

export default CheckoutPageOne;
