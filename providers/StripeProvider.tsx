"use client";

import React from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements } from "@stripe/react-stripe-js";

// Load Stripe outside of component render to avoid recreating object on each render
const stripePromise = loadStripe(
  process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "",
  {
    developerTools: { assistant: { enabled: false } },
  }
);

interface StripeProviderProps {
  children: React.ReactNode;
  clientSecret?: string;
}

export const StripeProvider: React.FC<StripeProviderProps> = ({
  children,
  clientSecret,
}) => {
  const options = clientSecret
    ? {
        clientSecret,
        appearance: {
          theme: "stripe" as const,
          variables: {
            colorPrimary: "#0570de",
            colorBackground: "#ffffff",
            colorText: "#30313d",
            colorDanger: "#df1b41",
            fontFamily: "system-ui, sans-serif",
            spacingUnit: "4px",
            borderRadius: "8px",
          },
          assistant: { enabled: false },
        },
      }
    : undefined;

  return (
    <Elements stripe={stripePromise} options={options}>
      {children}
    </Elements>
  );
};
