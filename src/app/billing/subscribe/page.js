"use client";
import React from "react";
import { useRouter, useSearchParams } from "next/navigation";
import StripeElementsProvider from "@/stripe/components/StripeElementsProvider";
import PaymentForm from "@/stripe/components/PaymentForm";
import { createPublicSubscription } from "@/stripe/services/checkoutService";

// const plans = [
//   { code: "IND_1M", label: "One Month" },
//   { code: "IND_3M", label: "Three Months" },
//   { code: "IND_6M", label: "Six Months" },
// ];

export default function PublicSubscribePage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [email, setEmail] = React.useState("");
  const [planCode, setPlanCode] = React.useState("IND_1M");
  const [clientSecret, setClientSecret] = React.useState(null);
  const [subscriptionId, setSubscriptionId] = React.useState(null);
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState(null);
  const startedRef = React.useRef(false);

  // Read query params once
  const qpEmail = searchParams?.get("email") || "";
  const qpPlan = searchParams?.get("plan") || "";
  const silentMode = Boolean(qpEmail && qpPlan);
  
  // If required params are missing, redirect away to prevent manual editing
  React.useEffect(() => {
    if (!qpEmail || !qpPlan) {
      // Redirect users back to the funnel to select plan and enter email
      try { 
        router.replace("/getting-started"); 
      } catch (error){
        console.error("Failed to redirect to /getting-started", error);
      }
    }
  }, [qpEmail, qpPlan]);

  // Prefill from query params and optionally autostart
  // On first load, try to consume pre-created data from sessionStorage (set by InstantPlanPreviewStep)
  React.useEffect(() => {
    if (typeof window === 'undefined') return;
    if (!clientSecret && !subscriptionId) {
      try {
        const cached = sessionStorage.getItem('pre_checkout');
        if (cached) {
          const { cs, sid } = JSON.parse(cached);
          if (cs) setClientSecret(cs);
          if (sid) setSubscriptionId(sid);
          sessionStorage.removeItem('pre_checkout');
        }
      } catch(error) {
        console.error("Error reading pre_checkout from sessionStorage",error);
      }
    }
  }, [clientSecret, subscriptionId]);

  // Auto-start when we have email+plan and no pre-created data; run once
  React.useEffect(() => {
    if (qpEmail && qpPlan && !clientSecret && !loading && !startedRef.current) {
      setEmail(qpEmail);
      setPlanCode(qpPlan);
      startedRef.current = true;
      startCheckout(qpEmail, qpPlan);
    }
  }, [qpEmail, qpPlan, clientSecret, loading]);

  async function startCheckout(eEmail, ePlan) {
    setLoading(true);
    setError(null);
    try {
      const theEmail = eEmail ?? email;
      const thePlan = ePlan ?? planCode;
      const res = await createPublicSubscription(theEmail, thePlan);
      setClientSecret(res.client_secret);
      setSubscriptionId(res.subscription_id);
    } catch (e) {
      setError(e?.message || "Failed to create subscription");
    } finally {
      setLoading(false);
    }
  }

  function handleSuccess({ paymentIntentId }) {
    const params = new URLSearchParams();
    if (subscriptionId) params.set('subscription_id', subscriptionId);
    if (paymentIntentId) params.set('payment_intent', paymentIntentId);
    router.push(`/stripe/success?${params.toString()}`);
  }

  // While starting in silent mode, render nothing unless there is an error
  if (!clientSecret) {
    if (!qpEmail || !qpPlan) return null; // redirect effect will run
    if (error) {
      return (
        <div className="max-w-xl mx-auto p-6">
          <div className="text-sm text-red-600 mb-3">{String(error)}</div>
          <button onClick={() => startCheckout(qpEmail, qpPlan)} className="px-4 py-2 bg-gray-900 text-white">Retry</button>
        </div>
      );
    }
    // Silent background processing
    return null;
  }

  // Render payment form once ready. Hide the static heading in silent mode
  return (
    <div className="max-w-xl mx-auto p-6 space-y-6">
      {!silentMode && <h1 className="text-2xl font-semibold">Subscribe</h1>}
      <StripeElementsProvider options={{ clientSecret }}>
        <PaymentForm
          clientSecret={clientSecret}
          onSuccess={handleSuccess}
          onError={(e) => setError(e?.message || "Payment failed")}
        />
      </StripeElementsProvider>
    </div>
  );
}
