"use client";
import React from "react";
import { Elements } from "@stripe/react-stripe-js";
import { getStripe } from "@/stripe/utils/stripeLoader";

export default function StripeElementsProvider({ options, children }) {
  const [stripe, setStripe] = React.useState(null);

  React.useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const s = await getStripe();
        if (mounted) setStripe(s);
      } catch (e) {
        console.error("Stripe init failed", e);
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Do not render children until <Elements> is ready; avoids useStripe outside context
  if (!stripe) return null;
  return (
    <Elements stripe={stripe} options={options}>
      {children}
    </Elements>
  );
}
