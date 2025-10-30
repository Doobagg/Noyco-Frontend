import { API_BASE_URL } from './constant';

// Flag to prevent multiple refresh attempts
let isRefreshing = false;
let refreshPromise = null;
let failedRefreshTimestamp = 0;
const REFRESH_COOLDOWN = 5000; // 5 seconds cooldown between refresh attempts
const MAX_AUTH_RETRIES = 1; // Maximum number of retry attempts for auth endpoints
const MAX_REFRESH_RETRIES = 2; // Maximum number of refresh attempts

// Only bypass proxy for the initial login endpoints. All other auth calls
// should go through the same-origin proxy so cookies are always sent even with
// SameSite=Lax in dev.
const BYPASS_PROXY_ENDPOINTS = [
  "/auth/login",
  "/auth/google/login",
  "/docs/",
];

// Helper function to build API URLs
export const getApiUrl = (path) => {
  if (typeof window !== 'undefined') {
    // If this is an auth endpoint or docs endpoint, build absolute URL to API gateway
    if (BYPASS_PROXY_ENDPOINTS.includes(path) || path.startsWith('/docs/')) {
      return `${API_BASE_URL}${path}`;
    }
    // Otherwise use relative path (Next.js rewrite)
    return path;
  }

  // On the server (SSR) we always talk to the API gateway directly.
  return `${API_BASE_URL}${path}`;
};

// Helper function to handle token refresh
const handleTokenRefresh = async (storeInstance) => {
  // If we're already refreshing, return the existing promise
  if (isRefreshing) {
    return refreshPromise;
  }
  
  // Check if we recently failed a refresh attempt
  const now = Date.now();
  if (now - failedRefreshTimestamp < REFRESH_COOLDOWN) {
    console.log("Skipping refresh due to recent failure");
    return false;
  }
  
  // Check localStorage for refresh attempts count
  const refreshCount = parseInt(localStorage.getItem('apiRefreshCount') || '0');
  if (refreshCount >= MAX_REFRESH_RETRIES) {
    console.log(`Maximum refresh attempts (${MAX_REFRESH_RETRIES}) reached`);
    return false;
  }
  
  // Increment refresh count
  localStorage.setItem('apiRefreshCount', (refreshCount + 1).toString());
  
  isRefreshing = true;
  
  try {
    // Dynamically import to avoid circular dependency
    const { refreshToken } = await import('../store/slices/authSlice');
    refreshPromise = storeInstance.dispatch(refreshToken());
    const result = await refreshPromise;
    
    // If refresh was successful, reset count
    if (result.meta.requestStatus === 'fulfilled') {
      localStorage.setItem('apiRefreshCount', '0');
      return true;
    }
    
    return false;
  } catch (error) {
    console.error('Token refresh failed:', error);
    failedRefreshTimestamp = Date.now();
    return false;
  } finally {
    isRefreshing = false;
    refreshPromise = null;
  }
};

// Helper function for making API requests with proper error handling
export const apiRequest = async (url, options = {}) => {
  // Allow callers to suppress console error logs
  const { suppressError = false, ...requestOpts } = options;
  // Add retry counter to track attempts
  const retryCount = requestOpts.retryCount || 0;
  
  // Skip refresh attempts for auth endpoints to prevent loops
  const isAuthEndpoint = url.includes('/auth/login') || url.includes('/auth/refresh') || url.includes('/auth/me');
  
  // Don't retry auth endpoints too many times
  if (isAuthEndpoint && retryCount >= MAX_AUTH_RETRIES) {
    throw new Error('Maximum retry attempts reached for auth endpoint');
  }
  
  try {
    // Determine appropriate headers. If the body is FormData, let the browser set
    // the correct multipart boundary automatically by **not** explicitly
    // specifying the Content-Type header.
    const isFormData = typeof requestOpts.body !== 'undefined' &&
      ((typeof window !== 'undefined' && requestOpts.body instanceof FormData) ||
       (typeof FormData !== 'undefined' && requestOpts.body instanceof FormData));

    const headers = {
      // Default to JSON unless we are sending FormData
      ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
      ...requestOpts.headers,
    };

    // Check for CSRF token in cookies if not provided in headers
    if (!isAuthEndpoint && !headers['X-CSRF-Token'] && typeof document !== 'undefined') {
      const csrfToken = document.cookie
        .split('; ')
        .find(row => row.startsWith('csrf_token='))
        ?.split('=')[1];
      
      if (csrfToken) {
        headers['X-CSRF-Token'] = csrfToken;
      }
    }

    // Prepare body: if JSON content-type and body is a plain object, stringify it
    let preparedBody = requestOpts.body;
    const isPlainObject = preparedBody && typeof preparedBody === 'object' && !isFormData && !(preparedBody instanceof ArrayBuffer) && !(preparedBody instanceof Blob);
    if (isPlainObject && headers['Content-Type'] === 'application/json') {
      try {
        preparedBody = JSON.stringify(preparedBody);
      } catch (e) {
        console.error('Failed to stringify request body', e);
      }
    }

    // Ensure credentials are included for cookies
    const requestOptions = {
      ...requestOpts,
      body: preparedBody,
      credentials: 'include', // Always include credentials for cookie auth
      headers,
      retryCount, // Pass the retry counter
    };

    let response = await fetch(getApiUrl(url), requestOptions);
    
    // Handle token expiration (401 status)
    if (response.status === 401 && !isAuthEndpoint && retryCount < 1) {
      // Dynamically import store to avoid circular dependency
      const { store } = await import('../store');
      
      // Try to refresh the token
      const refreshSuccess = await handleTokenRefresh(store);
      
      if (refreshSuccess) {
        // Retry the original request with new token
        const csrfToken = store.getState().auth.csrfToken;
        if (csrfToken) {
          headers['X-CSRF-Token'] = csrfToken;
        }
        
        // Increment retry counter
        return apiRequest(url, {
          ...requestOptions,
          headers,
          retryCount: retryCount + 1
        });
      } else {
        // If refresh failed and we're not on an auth endpoint, clear auth state
        if (!isAuthEndpoint) {
          const { resetAuthState } = await import('../store/slices/authSlice');
          store.dispatch(resetAuthState());
        }
      }
    }
    
    // Handle non-JSON responses
    const contentType = response.headers.get('content-type');
    if (contentType && contentType.includes('application/json')) {
      const data = await response.json();
      
      if (!response.ok) {
        // Handle FastAPI validation errors (422)
        if (response.status === 422 && data.detail) {
          if (Array.isArray(data.detail)) {
            // FastAPI validation errors are arrays
            const errorMessages = data.detail.map(err => 
              `${err.loc?.join('.')} - ${err.msg}`
            ).join('; ');
            throw new Error(`Validation error: ${errorMessages}`);
          }
        }
        throw new Error(data.detail || data.message || 'API request failed');
      }
      
      return data;
    } else {
      const text = await response.text();
      if (!response.ok) {
        // Avoid dumping entire HTML into the error message (e.g., Next.js 404 pages)
        const trimmed = (text || '').trim();
        const looksLikeHtml = trimmed.startsWith('<!DOCTYPE html') || trimmed.startsWith('<html');
        const msg = looksLikeHtml
          ? `API request failed: ${response.status} ${response.statusText}`
          : `API request failed: ${trimmed.slice(0, 500)}`; // cap length
        throw new Error(msg);
      }
      return text;
    }
  } catch (error) {
    if (!suppressError) {
      console.error(`API request error (${url}):`, error);
    }
    throw error;
  }
};
