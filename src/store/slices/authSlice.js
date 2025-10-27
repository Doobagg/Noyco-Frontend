import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { apiRequest } from '@/lib/api';

// Initial state
const initialState = {
  user: null,
  isAuthenticated: false,
  csrfToken: null,
  loading: true,
  error: null
};

// Helper function to get cookie by name
const getCookie = (name) => {
  if (typeof document === 'undefined') return null; // Handle SSR
  const value = `; ${document.cookie}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  return null;
};

// Async thunks
export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async (_, { rejectWithValue }) => {
    if (typeof localStorage !== 'undefined' && localStorage.getItem('loggedOut') === 'true') {
      return rejectWithValue('User is logged out');
    }
    try {
      const data = await apiRequest('/auth/me', {
        credentials: 'include'
      });

      if (data.authenticated === false) {
        return rejectWithValue('Not authenticated');
      }

      // Get CSRF token from cookie
      const csrfToken = getCookie('csrf_token');

      return {
        user: {
          id: data.user_id,
          email: data.email,
          role: data.role,
          role_entity_id: data.role_entity_id,
          name: data.name || null,
          phone: data.phone || null,
          hasPassword: data.has_password || false
          // hospital_unique_identity: data.hospital_unique_identity
        },
        csrf_token: csrfToken
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const login = createAsyncThunk(
  'auth/login',
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const data = await apiRequest('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password })
      });

      // Ensure we have the CSRF token from the response or cookie
      const csrfToken = data.csrf_token || getCookie('csrf_token');

      return {
        user: {
          ...data.user,
          hasPassword: true  // Regular login users have password
        },
        csrf_token: csrfToken
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const loginWithGoogle = createAsyncThunk(
  'auth/loginWithGoogle',
  async ({ id_token }, { rejectWithValue }) => {
    try {
      const data = await apiRequest('/auth/google/login', {
        method: 'POST',
        body: JSON.stringify({ id_token })
      });

      const csrfToken = data.csrf_token || getCookie('csrf_token');
      return {
        user: { 
          ...data.user,
          hasPassword: false  // OAuth users don't have password
        },
        csrf_token: csrfToken
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      // Only support individual registration now
      const endpoint = '/auth/individual/register';

      // Create a copy without the helper field `type`
      const payload = { ...userData };
      delete payload.type;

      const data = await apiRequest(endpoint, {
        method: 'POST',
        body: JSON.stringify(payload)
      });

      console.log("Registration data received:", data);

      // Ensure we have the CSRF token from the response or cookie
      const csrfToken = data.csrf_token || getCookie('csrf_token');

      return {
        user: {
          ...data.user,
          hasPassword: true  // Registered users have password
        },
        csrf_token: csrfToken
      };
    } catch (error) {
      return rejectWithValue(error.message);
    }
  }
);

// createAssistant functionality removed - no longer supporting assistant creation

// Global refresh lock to prevent multiple simultaneous refresh attempts
let isRefreshingGlobal = false;

export const refreshToken = createAsyncThunk(
  'auth/refreshToken',
  async (_, { rejectWithValue, getState }) => {
    // Abort early if we've explicitly logged out in this browser session
    if (typeof localStorage !== 'undefined' && localStorage.getItem('loggedOut') === 'true') {
      return rejectWithValue('User is logged out');
    }
    try {
      // Prevent refresh if we're already authenticated
      const { isAuthenticated, csrfToken } = getState().auth;
      if (isAuthenticated && csrfToken) {
        return { already_authenticated: true };
      }

      // Global lock to prevent multiple refresh attempts across components
      if (isRefreshingGlobal) {
        return rejectWithValue('Refresh already in progress');
      }

      isRefreshingGlobal = true;

      // Add a small timeout to prevent rapid successive calls
      await new Promise(resolve => setTimeout(resolve, 100));

      // Use localStorage to track refresh attempts across component remounts
      const now = Date.now();
      const lastRefreshAttempt = localStorage.getItem('lastRefreshAttempt');
      const refreshCooldown = 5000; // 5 seconds between refresh attempts (increased from 2s)

      if (lastRefreshAttempt && (now - parseInt(lastRefreshAttempt)) < refreshCooldown) {
        console.log("Refresh attempt too soon, skipping");
        isRefreshingGlobal = false;
        return rejectWithValue('Refresh attempt too frequent');
      }

      // Record this attempt
      localStorage.setItem('lastRefreshAttempt', now.toString());

      // Track refresh attempts count
      const maxRefreshAttempts = 2; // Reduced from 3 to fail faster
      const refreshCount = parseInt(localStorage.getItem('refreshCount') || '0');

      if (refreshCount >= maxRefreshAttempts) {
        // Clear refresh count after a delay
        setTimeout(() => {
          localStorage.setItem('refreshCount', '0');
        }, 60000); // Reset after 60 seconds (increased from 30s)

        isRefreshingGlobal = false;
        return rejectWithValue('Too many refresh attempts');
      }

      // Increment the refresh count
      localStorage.setItem('refreshCount', (refreshCount + 1).toString());

      try {
        // Make the refresh request with a longer timeout
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), 10000); // 10-second timeout

        const data = await apiRequest('/auth/refresh', {
          method: 'POST',
          credentials: 'include',
          signal: controller.signal
        });

        clearTimeout(timeoutId);

        // Get CSRF token from response or cookie
        const csrfToken = data.csrf_token || getCookie('csrf_token');

        // After successful refresh, get user data
        const userData = await apiRequest('/auth/me', {
          credentials: 'include'
        });

        if (userData.authenticated === false) {
          isRefreshingGlobal = false;
          return rejectWithValue('Authentication failed after token refresh');
        }

        // Reset refresh count on success
        localStorage.setItem('refreshCount', '0');

        isRefreshingGlobal = false;
        return {
          csrf_token: csrfToken,
          user: {
            id: userData.user_id,
            email: userData.email,
            role: userData.role,
            role_entity_id: userData.role_entity_id,
            name: userData.name || null,
            phone: userData.phone || null
          }
        };
      } catch (error) {
        isRefreshingGlobal = false;

        // If the error is a timeout or network error, provide a clearer message
        if (error.name === 'AbortError') {
          return rejectWithValue('Refresh token request timed out');
        }

        throw error; // Let the error handling below catch this
      }
    } catch (error) {
      console.error('Token refresh failed:', error);
      isRefreshingGlobal = false;

      // Clear any stale auth data if refresh fails with a critical error
      localStorage.removeItem('lastRefreshAttempt');
      localStorage.removeItem('refreshCount');

      return rejectWithValue(error.message || 'Token refresh failed');
    }
  }
);

export const logout = createAsyncThunk(
  'auth/logout',
  async (_, { getState, dispatch }) => {
    const { auth } = getState();

    // Mark as logged out immediately to prevent further refresh attempts during the request
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem('loggedOut', 'true');
    }

    // Optimistically reset client auth state
    dispatch(resetAuthState());

    // Try to get CSRF token from state or cookie
    let csrfToken = auth.csrfToken;
    if (!csrfToken && typeof document !== 'undefined') {
      const match = document.cookie
        .split('; ')
        .find((row) => row.startsWith('csrf_token='));
      csrfToken = match ? match.split('=')[1] : null;
    }

    try {
      if (csrfToken) {
        // Call logout endpoint to invalidate tokens & clear cookies
        await apiRequest('/auth/logout', {
          method: 'POST',
          headers: {
            'X-CSRF-Token': csrfToken,
          },
          suppressError: true,
        });
      }

      // Regardless of server response, clear local tracking so UI state resets
      localStorage.removeItem('lastRefreshAttempt');
      localStorage.removeItem('refreshCount');
      localStorage.removeItem('auth_last_init_time');
    } catch (error) {
      console.error('Logout error:', error);
    }
  }
);

// Auth slice
const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setCsrfToken: (state, action) => {
      state.csrfToken = action.payload;
    },
    resetAuthState: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.csrfToken = null;
      state.loading = false;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Check auth status
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.csrfToken = action.payload.csrf_token;
        state.loading = false;
        state.error = null;
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.user = null;
        state.isAuthenticated = false;
        state.loading = false;
        state.error = action.payload;
      })

      // Login
      .addCase(login.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.csrfToken = action.payload.csrf_token;
        state.loading = false;
        state.error = null;

        // Clear refresh tracking on successful login and remove loggedOut flag
        localStorage.removeItem('lastRefreshAttempt');
        localStorage.removeItem('refreshCount');
        localStorage.removeItem('loggedOut');
      })
      .addCase(login.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Google Login
      .addCase(loginWithGoogle.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(loginWithGoogle.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.csrfToken = action.payload.csrf_token;
        state.loading = false;
        state.error = null;
        localStorage.removeItem('lastRefreshAttempt');
        localStorage.removeItem('refreshCount');
        localStorage.removeItem('loggedOut');
      })
      .addCase(loginWithGoogle.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Register hospital
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.isAuthenticated = true;
        state.csrfToken = action.payload.csrf_token;
        state.loading = false;
        state.error = null;

        // Clear loggedOut flag on successful registration
        localStorage.removeItem('loggedOut');
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // Refresh token
      .addCase(refreshToken.pending, (state) => {
        // Don't set loading to true here to prevent UI flicker during refresh
        state.error = null;
      })
      .addCase(refreshToken.fulfilled, (state, action) => {
        // Only update if we got new data (not already_authenticated)
        if (!action.payload.already_authenticated) {
          state.csrfToken = action.payload.csrf_token;
          // Update user and authentication state if user data is available
          if (action.payload.user) {
            state.user = action.payload.user;
            state.isAuthenticated = true;
          }
        }
        state.error = null;
      })
      .addCase(refreshToken.rejected, (state) => {
        // If refresh fails, user needs to login again
        state.user = null;
        state.isAuthenticated = false;
        state.csrfToken = null;
      })

      // Logout
      .addCase(logout.pending, (state) => {
        // Immediately mark unauthenticated so UI hides protected links
        state.user = null;
        state.isAuthenticated = false;
        state.loading = true;
      })
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.isAuthenticated = false;
        state.csrfToken = null;
        state.loading = false;
      });
  },
});

export const { setCsrfToken, resetAuthState } = authSlice.actions;

export default authSlice.reducer;
