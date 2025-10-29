"use client";
import React from "react";
import { useRouter } from "next/navigation";
import StripeElementsProvider from "@/stripe/components/StripeElementsProvider";
import PaymentForm from "@/stripe/components/PaymentForm";
import { createSubscription } from "@/stripe/services/checkoutService";

const plans = [
  { code: "one_month", label: "One Month" },
  { code: "three_months", label: "Three Months" },
  { code: "six_months", label: "Six Months" },
];

export default function CustomCheckoutPage() {
  const router = useRouter();
  const [plan, setPlan] = React.useState("one_month");
  const [clientSecret, setClientSecret] = React.useState(null);
  // const [subscriptionId, setSubscriptionId] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);

  async function startCheckout() {
    setLoading(true);
    setError(null);
    try {
      const res = await createSubscription(plan);
      setClientSecret(res.client_secret);
      // setSubscriptionId(res.subscription_id);
    } catch (e) {
      setError(e?.message || "Failed to create subscription");
    } finally {
      setLoading(false);
    }
  }

  function handleSuccess() {
    // Optionally route to success; backend webhook will activate plan
    router.push("/stripe/success");
  }

  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      <h1 className="text-2xl font-semibold">Custom Checkout</h1>
      <div className="space-y-2">
        <label className="text-sm">Plan</label>
        <select
          value={plan}
          onChange={(e) => setPlan(e.target.value)}
          className="border p-2 w-full"
        >
          {plans.map((p) => (
            <option value={p.code} key={p.code}>{p.label}</option>
          ))}
        </select>
      </div>
      {!clientSecret ? (
        <button onClick={startCheckout} disabled={loading} className="w-full py-3 bg-gray-900 text-white">
          {loading ? "Starting..." : "Start Checkout"}
        </button>
      ) : (
        <StripeElementsProvider options={{ clientSecret }}>
          <PaymentForm
            clientSecret={clientSecret}
            onSuccess={handleSuccess}
            onError={(e) => setError(e?.message || "Payment failed")}
          />
        </StripeElementsProvider>
      )}
      {error && <div className="text-sm text-red-600">{String(error)}</div>}
    </div>
  );
}
