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
    if (!sessionId) {
      setMessage('Missing session id. Redirecting…');
      setTimeout(() => router.push('/'), 1500);
      return;
    }

    let attempts = 0;
    const poll = async () => {
      try {
        const res = await apiRequest(`/public/stripe/session-status?session_id=${encodeURIComponent(sessionId)}`, { suppressError: true });
        setStatus(res);
        if (res?.email) setEmail(res.email);
        if (!res?.processed && attempts < 10) {
          attempts += 1;
          setTimeout(poll, 1500);
        } else if (res?.processed) {
          if (res.userStatus === 'active') {
            // If already active, try to hydrate auth and go to dashboard
            try { await dispatch(checkAuthStatus()); } catch {}
            setTimeout(() => router.push('/dashboard/individual/plan'), 1200);
          } else {
            setMessage('Payment succeeded. Please verify your email and set a password to continue.');
          }
        } else {
          setMessage('Payment still processing. You can refresh this page in a moment.');
        }
      } catch (e) {
        console.error('Polling failed', e);
        if (attempts < 10) {
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
        <div className="w-full max-w-md bg-white shadow p-6 rounded-md">
          <h2 className="text-lg font-semibold mb-2">Verify email and set password</h2>
          <p className="text-sm text-gray-600 mb-4">
            We sent a 6-digit code to <span className="font-medium">{email || 'your email'}</span>. Enter it below, set a password, and you’ll be logged in.
          </p>
          <label className="block text-sm font-medium mb-1">Email</label>
          <input className="w-full border rounded px-3 py-2 mb-3" value={email} readOnly />
          <label className="block text-sm font-medium mb-1">OTP code</label>
          <input className="w-full border rounded px-3 py-2 mb-3" value={otp} onChange={e => setOtp(e.target.value)} placeholder="123456" maxLength={6} />
          <label className="block text-sm font-medium mb-1">Password</label>
          <input className="w-full border rounded px-3 py-2 mb-4" type="password" value={password} onChange={e => setPassword(e.target.value)} placeholder="Create a password" />
          <button
            disabled={submitting || !otp || !password}
            onClick={async () => {
              try {
                setSubmitting(true);
                const res = await apiRequest('/auth/verify-otp-and-set-password', {
                  method: 'POST',
                  body: JSON.stringify({ email, otp, password })
                });
                // hydrate auth and go to dashboard
                try { await dispatch(checkAuthStatus()); } catch {}
                router.push('/dashboard/individual/plan');
              } catch (e) {
                setToast({ message: e.message || 'Verification failed', type: 'error' });
              } finally {
                setSubmitting(false);
              }
            }}
            className={`w-full px-4 py-2 rounded-md text-white ${submitting ? 'bg-gray-400' : 'bg-blue-600 hover:bg-blue-700'}`}
          >
            {submitting ? 'Submitting…' : 'Verify & Continue'}
          </button>
          <button
            onClick={async () => {
              try {
                await apiRequest('/public/otp/resend', {
                  method: 'POST',
                  body: JSON.stringify({ email }),
                });
                alert('OTP resent. Please check your inbox.');
              } catch (e) {
                setToast({ message: e.message || 'Could not resend OTP', type: 'error' });
              }
            }}
            className="w-full mt-3 px-4 py-2 rounded-md border border-gray-300 text-gray-700 hover:bg-gray-50"
          >
            Resend code
          </button>
        </div>
      )}
      {status?.processed && status?.userStatus === 'active' && (
        <button onClick={() => router.push('/dashboard/individual/plan')} className="mt-4 px-6 py-3 bg-blue-600 text-white rounded-lg">Go to Subscription</button>
      )}
      {toast && (
        <Toast message={toast.message} type={toast.type} duration={3000} onClose={() => setToast(null)} />
      )}
    </div>
  );
} 