"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { CreditCard, Lock, AlertCircle } from "lucide-react";
import { toast } from "sonner";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";

interface StripePaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  amount: number;
  clientSecret: string;
  onPaymentSuccess: (paymentIntentId: string) => void;
  onPaymentError: (error: string) => void;
}

const StripePaymentModal: React.FC<StripePaymentModalProps> = ({
  isOpen,
  onClose,
  amount,
  clientSecret,
  onPaymentSuccess,
  onPaymentError,
}) => {
  const stripe = useStripe();
  const elements = useElements();
  const [isProcessing, setIsProcessing] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string>("");

  useEffect(() => {
    if (!isOpen) {
      setErrorMessage("");
      setIsProcessing(false);
    }
  }, [isOpen]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) {
      toast.error("Stripe hasn't loaded yet. Please wait.");
      return;
    }

    setIsProcessing(true);
    setErrorMessage("");

    try {
      // Confirm payment with Stripe
      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
        confirmParams: {
          return_url: `${window.location.origin}/order-success`,
        },
      });

      if (error) {
        // Payment failed
        setErrorMessage(error.message || "Payment failed");
        onPaymentError(error.message || "Payment failed");
        toast.error(error.message || "Payment failed");
      } else if (paymentIntent && paymentIntent.status === "succeeded") {
        // Payment succeeded
        onPaymentSuccess(paymentIntent.id);
        toast.success("Payment successful!");
      } else {
        // Payment requires additional action or is processing
        setErrorMessage("Payment processing. Please wait...");
      }
    } catch (error: any) {
      console.error("Payment error:", error);
      const errorMsg = error.message || "An unexpected error occurred";
      setErrorMessage(errorMsg);
      onPaymentError(errorMsg);
      toast.error(errorMsg);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <CreditCard className="h-5 w-5" />
            Stripe Payment
          </DialogTitle>
          <DialogDescription>
            Enter your card details to complete the payment
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-lg">
            <div className="flex justify-between items-center">
              <span className="text-sm font-medium">Total Amount:</span>
              <span className="text-2xl font-bold">${amount.toFixed(2)}</span>
            </div>
          </div>

          {/* Stripe Payment Element */}
          <div className="min-h-[200px]">
            <PaymentElement
              options={{
                layout: "tabs",
                paymentMethodOrder: ["card"],
              }}
            />
          </div>

          {errorMessage && (
            <div className="flex items-start gap-2 p-3 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
              <AlertCircle className="h-5 w-5 text-red-600 dark:text-red-500 flex-shrink-0 mt-0.5" />
              <div className="text-sm text-red-700 dark:text-red-300">
                {errorMessage}
              </div>
            </div>
          )}

          <div className="bg-gray-50 dark:bg-gray-800/50 p-3 rounded-lg">
            <p className="text-xs text-muted-foreground mb-2">
              <strong>Test Cards (Sandbox Mode):</strong>
            </p>
            <ul className="text-xs text-muted-foreground space-y-1">
              <li>• Success: 4242 4242 4242 4242</li>
              <li>• Decline: 4000 0000 0000 0002</li>
              <li>• 3D Secure: 4000 0025 0000 3155</li>
            </ul>
          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Lock className="h-3 w-3" />
            <span>Secure payment powered by Stripe (Test Mode)</span>
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={isProcessing}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isProcessing || !stripe || !elements}
              className="flex-1"
            >
              {isProcessing ? (
                <span className="flex items-center gap-2">
                  <span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  Processing...
                </span>
              ) : (
                `Pay $${amount.toFixed(2)}`
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default StripePaymentModal;
