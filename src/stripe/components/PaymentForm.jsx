"use client";
import React from "react";
import { useStripe, useElements, PaymentElement } from "@stripe/react-stripe-js";

export default function PaymentForm({ clientSecret, onSuccess, onError }) {
  const stripe = useStripe();
  const elements = useElements();
  const [submitting, setSubmitting] = React.useState(false);
  const [error, setError] = React.useState(null);

  async function handleSubmit(e) {
    e?.preventDefault?.();
    if (!stripe || !elements || submitting) return;
    setSubmitting(true);
    setError(null);
    try {
      const result = await stripe.confirmPayment({
        elements,
        redirect: "if_required",
      });
      if (result.error) {
        setError(result.error.message || "Payment failed");
        onError?.(result.error);
      } else {
        // Success: extract intent id
        const pi = result.paymentIntent;
        onSuccess?.({ subscriptionId: null, paymentIntentId: pi?.id });
      }
    } catch (err) {
      setError(err?.message || "Something went wrong");
      onError?.(err);
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <PaymentElement options={{ layout: "tabs" }} />
      {error && <div className="text-sm text-red-600">{String(error)}</div>}
      <button
        type="submit"
        disabled={!stripe || submitting || !clientSecret}
        className="w-full py-3 bg-gray-900 text-white font-medium disabled:opacity-60"
      >
        {submitting ? "Processing..." : "Pay"}
      </button>
    </form>
  );
}
