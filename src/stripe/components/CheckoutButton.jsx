import React, { useState } from 'react';
import { createCheckout } from '../services/checkoutService';
import { showToast } from '@/lib/toast';

export default function CheckoutButton({ planType, children }) {
  const [loading, setLoading] = useState(false);

  const handleClick = async () => {
    if (loading) return;
    try {
  setLoading(true);
  await createCheckout(planType);
    } catch (err) {
      console.error('Checkout error', err);
      showToast('Unable to start checkout', 'error');
    } finally {
      setLoading(false);
    }
  };

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="flex items-center justify-center w-full py-3 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 font-semibold disabled:opacity-60"
    >
      {loading ? 'Redirecting...' : children || 'Checkout'}
    </button>
  );
} 