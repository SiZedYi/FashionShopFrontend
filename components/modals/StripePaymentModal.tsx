"use client";
import React, { useCallback, useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { useStripe, useElements, PaymentElement } from '@stripe/react-stripe-js';
import { formatPrice } from '@/lib/formatPrice';
import { toast } from 'sonner';

interface StripePaymentModalProps {
	isOpen: boolean;
	onClose: () => void;
	amount: number;
	clientSecret: string;
	onPaymentSuccess: (paymentIntentId: string) => void;
	onPaymentError: (error: string) => void;
}

// Scrollable modal content with Stripe PaymentElement
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
	const [submitting, setSubmitting] = useState(false);

	const handleSubmit = useCallback(async () => {
		if (!stripe || !elements) {
			return;
		}
		setSubmitting(true);
		try {
			const result = await stripe.confirmPayment({
				elements,
				confirmParams: {
					// Optionally provide a return_url for redirects (3D Secure)
					return_url: typeof window !== 'undefined' ? window.location.origin + '/order-success' : undefined,
				},
				redirect: 'if_required',
			});

			if (result.error) {
				const msg = result.error.message || 'Payment failed';
				toast.error(msg);
				onPaymentError(msg);
			} else if (result.paymentIntent) {
				const pid = result.paymentIntent.id;
				toast.success('Payment confirmed');
				onPaymentSuccess(pid);
			} else {
				const msg = 'Unknown payment state';
				toast.error(msg);
				onPaymentError(msg);
			}
		} catch (err: any) {
			const msg = err.message || 'Unexpected payment error';
			toast.error(msg);
			onPaymentError(msg);
		} finally {
			setSubmitting(false);
		}
	}, [stripe, elements, onPaymentError, onPaymentSuccess]);

	return (
		<Dialog open={isOpen}>
			<DialogContent className="max-w-xl p-0" onInteractOutside={e => e.preventDefault()}>
				<DialogHeader className="px-6 pt-6">
					<DialogTitle className="text-xl">Complete Payment</DialogTitle>
				</DialogHeader>
				{/* Scrollable content wrapper */}
				<div className="px-6 pb-6">
					<div className="text-sm mb-4 text-gray-700 dark:text-gray-300">
						<p className="font-medium">Amount: {formatPrice(amount)}</p>
						<p className="text-xs mt-1">Secure payment powered by Stripe.</p>
					</div>
					<div className="max-h-[60vh] overflow-y-auto pr-2 space-y-4">
						{/* Payment Element */}
						{clientSecret && (
							<PaymentElement
								options={{
									layout: 'tabs',
								}}
							/>
						)}
						<div className="space-y-2 text-xs text-gray-500 dark:text-gray-400">
							<p>All transactions are processed securely. If additional authentication (3D Secure) is required you may be briefly redirected.</p>
							<p>Do not close this window until the payment finishes.</p>
						</div>
					</div>
					<div className="flex flex-col sm:flex-row gap-3 mt-6">
						<button
							type="button"
							onClick={onClose}
							disabled={submitting}
							className="inline-flex justify-center items-center rounded-md border border-gray-300 bg-white dark:bg-gray-800 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-primary disabled:opacity-50"
						>
							Cancel
						</button>
						<button
							type="button"
							onClick={handleSubmit}
							disabled={!stripe || !elements || submitting}
							className="inline-flex justify-center items-center rounded-md bg-[#635BFF] px-4 py-2 text-sm font-semibold text-white shadow hover:bg-[#5147ff] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-[#635BFF] disabled:opacity-50"
						>
							{submitting ? (
								<>
									<span className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent mr-2" />
									Processing...
								</>
							) : (
								'Pay Now'
							)}
						</button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
};

export default StripePaymentModal;
