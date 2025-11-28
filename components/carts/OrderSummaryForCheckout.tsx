"use client";
import React, { useEffect, useState } from "react";
import CartItemsDetails from "./CartItemsDetails";
import { Separator } from "../ui/separator";
import useCartStore from "@/store/cartStore";
import { Button } from "../ui/button";
import Loader from "../others/Loader";
import { formatPrice } from "@/lib/formatPrice";
import { useCheckoutStore } from "@/store/checkoutStore";
import { createOrder, confirmStripePayment, createStripePaymentIntent } from "@/service/order";
import { toast } from "sonner";
import { useRouter } from "next/navigation";
import StripePaymentModal from "../modals/StripePaymentModal";
import { StripeProvider } from "@/providers/StripeProvider";
import { CreditCard, Wallet } from "lucide-react";

const OrderSummaryForCheckout = () => {
  const [isMounted, setIsMounted] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [showStripeModal, setShowStripeModal] = useState(false);
  const [currentOrderId, setCurrentOrderId] = useState<number | null>(null);
  const [clientSecret, setClientSecret] = useState<string>("");

  const router = useRouter();

  useEffect(() => {
    setIsMounted(true);
  }, []);

  const { cartItems, getTotalPrice, getTax, getShippingFee, getTotalAmount, clearCart, couponCode } =
    useCartStore();
  const { shippingAddress } = useCheckoutStore();

  if (!isMounted) {
    return <Loader />;
  }

  const validateCheckout = () => {
    if (!shippingAddress) {
      toast.error("Please fill in shipping address");
      return false;
    }

    if (cartItems.length === 0) {
      toast.error("Your cart is empty");
      return false;
    }

    return true;
  };

  const createOrderPayload = (paymentMethod: 'STRIPE' | 'COD') => {
    if (!shippingAddress) return null;

    return {
      shippingAddress,
      items: cartItems.map(item => {
        // Ensure color is sent correctly - use selectedColor if available, otherwise use first color from array
        const color = item.selectedColor || (item.color && item.color.length > 0 ? item.color[0] : "");

        // Determine product image by matching selected color index to images array
        const colorIndex = item.selectedColor && Array.isArray(item.color)
          ? item.color.indexOf(item.selectedColor)
          : -1;
        const productImage = Array.isArray(item.images) && item.images.length > 0
          ? (colorIndex >= 0 && colorIndex < item.images.length
              ? item.images[colorIndex]
              : item.images[0])
          : undefined;
        
        return {
          productId: item.productId || item.id,
          quantity: item.quantity,
          price: item.price,
          productName: item.name,
          productImage,
          color: color, // Make sure color is always a string, not undefined
        };
      }),
      totalAmount: getTotalAmount(),
      subtotal: getTotalPrice(),
      tax: getTax(),
      shippingFee: getShippingFee(),
      couponCode: couponCode || undefined,
      paymentMethod,
    };
  };

  const handleStripePayment = async () => {
    if (!validateCheckout()) return;

    setIsProcessing(true);

    try {
      const payload = createOrderPayload('STRIPE');
      if (!payload) {
        toast.error("Failed to create order payload");
        return;
      }

      // Create order
      const order = await createOrder(payload);
      setCurrentOrderId(order.id);
      
      // Create Stripe payment intent
      const paymentIntent = await createStripePaymentIntent(order.id);
      setClientSecret(paymentIntent.clientSecret);
      
      // Show Stripe payment modal
      setShowStripeModal(true);
      
      toast.success("Order created! Please complete payment.");
    } catch (error: any) {
      toast.error(error.message || "Failed to create order");
      console.error("Create order error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleCashOnDelivery = async () => {
    if (!validateCheckout()) return;

    setIsProcessing(true);

    try {
      const payload = createOrderPayload('COD');
      if (!payload) {
        toast.error("Failed to create order payload");
        return;
      }

      // Create order with COD
      const order = await createOrder(payload);
      
      toast.success("Order placed successfully!");
      
      // Clear cart
      clearCart();
      
      // Redirect to order success page
      router.push(`/order-success`);
    } catch (error: any) {
      toast.error(error.message || "Failed to place order");
      console.error("Place order error:", error);
    } finally {
      setIsProcessing(false);
    }
  };

  const handlePaymentSuccess = async (paymentIntentId: string) => {
    if (!currentOrderId) return;

    try {
      // Confirm payment with backend
      await confirmStripePayment(currentOrderId, paymentIntentId);
      
      toast.success("Payment successful! Order confirmed.");
      
      // Clear cart
      clearCart();
      
      // Close modal
      setShowStripeModal(false);
      
      // Redirect to order success page
      router.push(`/order-success`);
    } catch (error: any) {
      toast.error(error.message || "Payment confirmation failed");
      console.error("Payment confirmation error:", error);
    }
  };

  const handlePaymentError = (error: string) => {
    toast.error(error);
    setShowStripeModal(false);
  };

  return (
    <div className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg">
      {/* ordered items details */}
      <div>
        <h2 className="text-lg font-semibold my-2 lg:p-4">Order Items</h2>
        <CartItemsDetails />
        <Separator className="dark:bg-white/50 mb-2" />
      </div>

      {/* order summary for order place */}
      <div className="lg:px-4">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
          Order Summary
        </h2>
        <div className="flex justify-between mb-4">
          <span className="text-gray-700 dark:text-gray-300">Subtotal:</span>
          <span className="text-gray-900 dark:text-white">
            ${formatPrice(getTotalPrice())}
          </span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="text-gray-700 dark:text-gray-300">Shipping:</span>
          <span className="text-gray-900 dark:text-white">
            ${formatPrice(getShippingFee())}
          </span>
        </div>
        <div className="flex justify-between mb-4">
          <span className="text-gray-700 dark:text-gray-300">Tax:</span>
          <span className="text-gray-900 dark:text-white">
            ${formatPrice(getTax())}
          </span>
        </div>
        <div className="flex justify-between">
          <span className="text-xl font-semibold text-gray-900 dark:text-white">
            Total:
          </span>
          <span className="text-xl font-semibold text-gray-900 dark:text-white">
            ${formatPrice(getTotalAmount())}
          </span>
        </div>
        
        <div className="space-y-3 mt-6">
          <Button 
            onClick={handleStripePayment}
            disabled={isProcessing || cartItems.length === 0}
            className="w-full text-lg bg-blue-500 dark:bg-blue-600 text-white py-6 hover:bg-blue-600 dark:hover:bg-blue-700 focus:outline-none rounded-lg hover:ring-2 flex items-center justify-center gap-2"
          >
            {isProcessing ? (
              <>
                <span className="h-5 w-5 animate-spin rounded-full border-2 border-current border-t-transparent" />
                Processing...
              </>
            ) : (
              <>
                <CreditCard className="h-5 w-5" />
                Pay with Stripe
              </>
            )}
          </Button>

          <Button 
            onClick={handleCashOnDelivery}
            disabled={isProcessing || cartItems.length === 0}
            variant="outline"
            className="w-full text-lg py-6 rounded-lg flex items-center justify-center gap-2"
          >
            <Wallet className="h-5 w-5" />
            Cash on Delivery
          </Button>
        </div>

        {showStripeModal && currentOrderId && clientSecret && (
          <StripeProvider clientSecret={clientSecret}>
            <StripePaymentModal
              isOpen={showStripeModal}
              onClose={() => setShowStripeModal(false)}
              amount={getTotalAmount()}
              clientSecret={clientSecret}
              onPaymentSuccess={handlePaymentSuccess}
              onPaymentError={handlePaymentError}
            />
          </StripeProvider>
        )}
      </div>
    </div>
  );
};

export default OrderSummaryForCheckout;
