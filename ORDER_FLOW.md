1. User clicks "Pay with Stripe"
   ↓
2. Frontend → createOrder()
   Backend → Create order, return orderId: 123
   ↓
3. Frontend → createStripePaymentIntent(123)
   Backend → Stripe.createPaymentIntent()
   Stripe → Return clientSecret: "pi_3Nxxxxx_secret_yyyy"
   ↓
4. Frontend → Show Stripe modal with clientSecret
   Load Stripe Elements (real card form Stripe)
   ↓
5. User enters card: 4242 4242 4242 4242
   Click "Pay"
   ↓
6. Frontend → stripe.confirmPayment(elements)
   Stripe → Process payment
   Stripe → Return REAL PaymentIntent: pi_3Nxxxxx (status: succeeded)
   ↓
7. Frontend → confirmStripePayment(123, "pi_3Nxxxxx")
   Backend → PaymentIntent.retrieve("pi_3Nxxxxx")
   Stripe → Verify payment succeeded
   Backend → Update order status = PAID
   ↓
8. Frontend → Clear cart → Redirect to /order-success