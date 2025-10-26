"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { apiRequest } from '@/lib/api';
import { useDispatch, useSelector } from 'react-redux';
import { checkAuthStatus } from '@/store/slices/authSlice';
import Toast from '@/components/ui/Toast';

export default function CheckoutSuccess() {
  const router = useRouter();
  const dispatch = useDispatch();
  const [message, setMessage] = useState('Finalizing your subscription...');
  const [status, setStatus] = useState(null);
  const [email, setEmail] = useState('');
  const [otp, setOtp] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
  const sessionId = params.get('session_id');
  const subscriptionId = params.get('subscription_id');
  const explicitPi = params.get('payment_intent');
  const clientSecret = params.get('payment_intent_client_secret');

    // Build polling url based on available params
    const buildUrl = () => {
      // Prefer Payment Intent since confirmPayment typically returns immediately when succeeded
      if (explicitPi) {
        return `/public/stripe/payment-status?payment_intent=${encodeURIComponent(explicitPi)}`;
      }
      if (clientSecret) {
        // Extract PI id from client secret format: pi_XXX_secret_YYY
        const piId = (clientSecret.startsWith('pi_') ? clientSecret.split('_secret')[0] : null);
        if (piId) {
          return `/public/stripe/payment-status?payment_intent=${encodeURIComponent(piId)}`;
        }
      }
      if (subscriptionId) {
        return `/public/stripe/payment-status?subscription_id=${encodeURIComponent(subscriptionId)}`;
      }
      if (sessionId) {
        return `/public/stripe/session-status?session_id=${encodeURIComponent(sessionId)}`;
      }
      return null;
    };

    const url = buildUrl();
    if (!url) {
      setMessage('Missing payment reference. Redirecting…');
      setTimeout(() => router.push('/'), 1500);
      return;
    }

    let attempts = 0;
    const poll = async () => {
      try {
        const res = await apiRequest(url, { suppressError: true });
        setStatus(res);
        if (res?.email) setEmail(res.email);
        if (!res?.processed && attempts < 20) {
          attempts += 1;
          setTimeout(poll, 1500);
        } else if (res?.processed) {
          if (res.userStatus === 'active') {
            try { await dispatch(checkAuthStatus()); } catch(error) {
              console.error('Auth status check failed after payment success', error);
            }
            setTimeout(() => router.push('/dashboard/individual'), 1200);
          } else {
            // Redirect to dedicated flow to finish registration
            const q = new URLSearchParams();
            if (res?.email) q.set('email', res.email);
            setTimeout(() => router.push(`/auth/complete-signup?${q.toString()}`), 800);
            return;
          }
        } else {
          setMessage('Payment still processing. You can refresh this page in a moment.');
        }
      } catch (e) {
        console.error('Polling failed', e);
        if (attempts < 20) {
          attempts += 1;
          setTimeout(poll, 2000);
        } else {
          setMessage('Having trouble confirming payment. Please check your email for updates.');
          setToast({ message: 'Could not confirm payment. Try again shortly.', type: 'error' });
        }
      }
    };
    poll();
  }, []);

  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4">
      <h1 className="text-3xl font-semibold mb-4 text-green-600">Payment Success 🎉</h1>
      <p className="text-gray-700 mb-8 text-center max-w-md">{message}</p>
      {status?.processed && status?.userStatus !== 'active' && (
        <div className="w-full max-w-md bg-white shadow p-6 rounded-md text-center">
          <p className="text-sm text-gray-700">Redirecting to finish signup…</p>
        </div>
      )}
      {status?.processed && status?.userStatus === 'active' && (
        <button onClick={() => router.push('/dashboard/individual')} className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg">Go to Dashboard</button>
      )}
      {toast && (
        <Toast message={toast.message} type={toast.type} duration={3000} onClose={() => setToast(null)} />
      )}
    </div>
  );
} 