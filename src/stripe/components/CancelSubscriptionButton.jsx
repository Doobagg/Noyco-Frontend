"use client";
import React, { useState } from 'react';
import { cancelSubscription, resumeSubscription } from '../services/subscriptionService';
import { showToast } from '@/lib/toast';
import { Loader2 } from 'lucide-react';

export default function CancelSubscriptionButton({
  subscriptionId,
  cancelAtPeriodEnd,
  currentPeriodEnd,
  onStatusChange,
  className = ''
}) {
  const [loading, setLoading] = useState(false);

  const formattedEnd = currentPeriodEnd ? new Date(currentPeriodEnd * 1000).toLocaleDateString() : null;

  const handleCancel = async () => {
    if (!subscriptionId) return;
    if (!window.confirm('Cancel at end of current billing period?')) return;
    try {
      setLoading(true);
      const res = await cancelSubscription(subscriptionId);
      onStatusChange?.(res);
      showToast('Cancellation scheduled', 'success');
    } catch (e) {
      showToast(e.message || 'Failed to cancel', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleResume = async () => {
    if (!subscriptionId) return;
    try {
      setLoading(true);
      const res = await resumeSubscription(subscriptionId);
      onStatusChange?.(res);
      showToast('Subscription will continue', 'success');
    } catch (e) {
      showToast(e.message || 'Failed to resume', 'error');
    } finally {
      setLoading(false);
    }
  };

  if (!subscriptionId) {
    return <div className="text-xs text-gray-500">No active subscription</div>;
  }

  return (
    <div className={`flex flex-col gap-2 ${className}`}>
      {cancelAtPeriodEnd ? (
        <>
          <div className="text-xs text-yellow-700 bg-yellow-50 border border-yellow-200 p-2">
            Cancellation scheduled{formattedEnd && <> — access until <strong>{formattedEnd}</strong></>}.
          </div>
          <button
            onClick={handleResume}
            disabled={loading}
            className="px-4 py-2 rounded bg-green-600 text-white text-sm font-medium hover:bg-green-700 disabled:opacity-60 flex items-center justify-center"
          >
            {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Resume Plan'}
          </button>
        </>
      ) : (
        <button
          onClick={handleCancel}
          disabled={loading}
          className="px-4 py-2 rounded bg-red-600 text-white text-sm font-medium hover:bg-red-700 disabled:opacity-60 flex items-center justify-center"
        >
          {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : 'Cancel Plan'}
        </button>
      )}
    </div>
  );
}
