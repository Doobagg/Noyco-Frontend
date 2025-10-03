import { apiRequest } from './api';
import { checkAuthStatus } from '@/store/slices/authSlice';

export async function verifyOtpAndSetPassword(dispatch, { email, otp, password }) {
  const res = await apiRequest('/auth/verify-otp-and-set-password', {
    method: 'POST',
    body: JSON.stringify({ email, otp, password })
  });
  try { await dispatch(checkAuthStatus()); } catch {}
  return res;
}
