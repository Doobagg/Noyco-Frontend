"use client";
import { useEffect, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { apiRequest } from "@/lib/api";
import { useDispatch } from "react-redux";
import { checkAuthStatus } from "@/store/slices/authSlice";

export default function CompleteSignupPage() {
  const router = useRouter();
  const params = useSearchParams();
  const dispatch = useDispatch();
  const [email, setEmail] = useState(params.get("email") || "");
  const [otp, setOtp] = useState("");
  const [password, setPassword] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Prefer email from query param if present
    const e = params.get("email");
    if (e) {
      setEmail(e);
      // sync to session for consistency
      try { if (typeof window !== 'undefined') sessionStorage.setItem('funnelEmail', e); } 
      catch(error){
        console.error("Failed to set funnelEmail in sessionStorage", error);
      }
      return;
    }
    // Fallback to sessionStorage values saved during funnel
    try {
      if (typeof window !== 'undefined') {
        const cached = sessionStorage.getItem('funnelEmail');
        if (cached) {
          setEmail(cached);
          return;
        }
        const progressRaw = sessionStorage.getItem('funnelProgress');
        if (progressRaw) {
          const progress = JSON.parse(progressRaw);
          const maybeEmail = progress?.data?.email;
          if (maybeEmail) {
            setEmail(maybeEmail);
            return;
          }
        }
      }
    } catch (error) {
      console.error("Error syncing email from sessionStorage", error);
    }
  }, [params]);

  const onSubmit = async () => {
    if (!email || !otp || !password) {
      setError("Email, OTP and password are required");
      return;
    }
    setSubmitting(true);
    setError(null);
    try {
      await apiRequest("/auth/verify-otp-and-set-password", {
        method: "POST",
        body: JSON.stringify({ email, otp, password })
      });
      try { 
        await dispatch(checkAuthStatus()) 
      } catch (error) {
        console.error("Error checking auth status", error);
      }
      router.push("/dashboard/individual?onboarding=1");
    } catch (e) {
      setError(e?.message || "Verification failed");
    } finally {
      setSubmitting(false);
    }
  };

  const resend = async () => {
    try {
      await apiRequest('/public/otp/resend', { method: 'POST', body: JSON.stringify({ email }) });
      alert('OTP resent. Please check your inbox.');
    } catch (e) {
      setError(e?.message || 'Could not resend OTP');
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-2xl font-semibold mb-2">Complete your signup</h1>
      <p className="text-gray-600 mb-6 text-center">Enter the 6-digit code we sent and set your password to continue.</p>
      <div className="w-full max-w-md bg-white shadow p-6 rounded-md space-y-3">
        <div>
          <label className="text-sm font-medium">Email</label>
          {/* Read-only email display to prevent edits */}
          <div className="p-2 w-full border bg-gray-50 text-gray-700">{email || 'Unknown'}</div>
        </div>
        <label className="text-sm font-medium">OTP code</label>
        <input className="border p-2 w-full" value={otp} onChange={(e)=>setOtp(e.target.value)} maxLength={6} placeholder="123456" />
        <label className="text-sm font-medium">Password</label>
        <input type="password" className="border p-2 w-full" value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="Create a password" />
        {error && <div className="text-sm text-red-600">{String(error)}</div>}
        <button onClick={onSubmit} disabled={submitting} className="w-full py-3 bg-gray-900 text-white">
          {submitting ? 'Submitting…' : 'Verify & Continue'}
        </button>
        <button onClick={resend} className="w-full py-2 border mt-1">Resend code</button>
      </div>
    </div>
  );
}
