import { apiRequest } from '@/lib/api';

// Custom checkout (authenticated): create subscription and return client secret
export const createSubscription = async (planType) => {
  const body = { plan_type: planType };
  const res = await apiRequest('/stripe/create-subscription', {
    method: 'POST',
    body: JSON.stringify(body),
  });
  // { client_secret, subscription_id, customer_id }
  return res;
};

// Public funnel custom checkout
export const createPublicSubscription = async (email, planCode) => {
  const res = await apiRequest('/public/billing/create-subscription', {
    method: 'POST',
    body: JSON.stringify({ email, plan_code: planCode }),
  });
  return res; // { client_secret, subscription_id, customer_id }
};