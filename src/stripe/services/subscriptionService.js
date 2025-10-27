// Subscription service helpers for cancel / resume / summary
import { apiRequest } from '@/lib/api';

export async function getCurrentSubscription(options = {}) {
	try {
		return await apiRequest('/stripe/subscription/current', { suppressError: true, ...options });
	} catch {
		return null;
	}
}

export async function cancelSubscription(subscriptionId) {
	if (!subscriptionId) throw new Error('Missing subscriptionId');
	return apiRequest('/stripe/subscription/cancel', {
		method: 'POST',
		body: { subscription_id: subscriptionId },
	});
}

export async function resumeSubscription(subscriptionId) {
	if (!subscriptionId) throw new Error('Missing subscriptionId');
	return apiRequest('/stripe/subscription/resume', {
		method: 'POST',
		body: { subscription_id: subscriptionId },
	});
}

// Optional: trigger a quiet refresh for polling usage
export async function refreshSubscription(delayMs = 0) {
	if (delayMs) await new Promise(r => setTimeout(r, delayMs));
	return getCurrentSubscription();
}

