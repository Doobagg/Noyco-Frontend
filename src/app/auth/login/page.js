"use client";
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../../../store/hooks';
import { useRouter } from 'next/navigation';
import { Shield, Clock, Brain } from 'lucide-react';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [googleReady, setGoogleReady] = useState(false);
  const googleBtnRef = useRef(null);

  const { login, loginWithGoogle, loading } = useAuth();
  const router = useRouter();

  const handleSubmit = async () => {
    if (!email || !password) {
      setError('Email and password are required');
      return;
    }

    setError('');
    try {
      setIsSubmitting(true);
      const result = await login(email, password);

      if (result.success) {
        // Redirect based on user role
        const { user } = result;
        console.log("Login successful, user data:", user);

        if (user?.role === 'admin') {
          router.push('/dashboard/admin');
        }  else if (user?.role === 'individual') {
          router.push('/dashboard/individual');
        } else {
          router.push('/dashboard/individual'); // Default to individual dashboard
        }
      } else {
        setError(result.error || 'Invalid email or password. Please try again.');
      }
    } catch (err) {
      console.error('Login error:', err);
      setError('Connection error. Please check your internet connection and try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Google Identity Services setup
  useEffect(() => {
    const clientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!clientId) {
      console.warn('NEXT_PUBLIC_GOOGLE_CLIENT_ID not configured');
      return;
    }

    const init = () => {
      try {
        /* global google */
        if (window.google?.accounts?.id) {
          window.google.accounts.id.initialize({
            client_id: clientId,
            callback: async (response) => {
              try {
                setError(''); // Clear any previous errors
                setIsSubmitting(true);
                const result = await loginWithGoogle(response.credential);
                if (result.success) {
                  const user = result.user;
                  if (user?.role === 'admin') {
                    router.push('/dashboard/admin');
                  } else if (user?.role === 'individual') {
                    router.push('/dashboard/individual');
                  } else {
                    router.push('/dashboard/individual');
                  }
                } else {
                  setError(result.error || 'Google sign-in failed');
                }
              } catch (e) {
                console.error('Google sign-in error:', e);
                setError(e.message || 'Google sign-in failed. Please try again.');
              } finally {
                setIsSubmitting(false);
              }
            },
          });

          if (googleBtnRef.current) {
            try {
              window.google.accounts.id.renderButton(googleBtnRef.current, {
                theme: 'outline',
                size: 'large',
                width: 360,
                shape: 'rectangular',
                logo_alignment: 'left',
              });
              setGoogleReady(true);
            } catch (renderError) {
              console.error('Google button render error:', renderError);
            }
          }
        }
      } catch (initError) {
        console.error('Google Identity Services initialization error:', initError);
      }
    };

    // Inject script if needed
    if (!window.google) {
      const script = document.createElement('script');
      script.src = 'https://accounts.google.com/gsi/client';
      script.async = true;
      script.defer = true;
      script.onload = init;
      document.body.appendChild(script);
      return () => {
        // No cleanup required for script
      };
    } else {
      init();
    }
  }, [loginWithGoogle, router]);

  // Handle Enter key press
  const handleKeyPress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit();
    }
  };

  return (
    <div className="min-h-screen relative bg-beige flex items-center justify-center p-4" style={{ fontFamily: '"Mier A", sans-serif' }}>
      {/* Soft background blobs (match landing palette) */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-20 left-10 w-48 h-48 bg-gradient-to-r from-[#E6D3E7] to-[#F6D9D5] mix-blend-multiply filter blur-2xl opacity-15 animate-pulse"></div>
        <div className="absolute top-40 right-10 w-56 h-56 bg-gradient-to-r from-[#F6D9D5] to-[#D6E3EC] mix-blend-multiply filter blur-2xl opacity-15 animate-pulse animation-delay-2000"></div>
        <div className="absolute bottom-20 left-1/2 -translate-x-1/2 w-52 h-52 bg-gradient-to-r from-[#D6E3EC] to-[#E6D3E7] mix-blend-multiply filter blur-2xl opacity-15 animate-pulse animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-6xl">
        <div className="grid lg:grid-cols-2 gap-8 items-center">
          {/* Left Column - Welcome Section */}
          <div className="text-center lg:text-left space-y-6">
            <div>
              <h1 className="text-3xl md:text-5xl text-gray-900 mb-4 leading-tight">
                Welcome back to Noyco
              </h1>
              <p className="text-lg text-gray-600 mb-6">
                Sign in to continue your mental wellness journey with our AI-powered platform
              </p>
            </div>

            <div className="space-y-4">
              <div className="flex items-center space-x-3 text-gray-700">
                <div className="w-8 h-8   flex items-center justify-center">
                  <Shield className="w-5 h-5 " />
                </div>
                <span>Private and secure conversations</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700">
                <div className="w-8 h-8  flex items-center justify-center">
                  <Clock className="w-5 h-5 " />
                </div>
                <span>Available 24/7 for support</span>
              </div>
              <div className="flex items-center space-x-3 text-gray-700">
                <div className="w-8 h-8 flex items-center justify-center">
                  <Brain className="w-5 h-5" />
                </div>
                <span>Personalized wellness insights</span>
              </div>
            </div>
          </div>

          {/* Right Column - Sign In Form */}
          <div className="bg-beige p-6 md:p-8  border-accent border-accent-top border-accent-left border-accent-right">
            <div className="text-center mb-6">
              <h2 className="text-2xl  text-gray-900 mb-2">Sign in to your account</h2>
              <p className="text-gray-600">Enter your credentials to continue</p>
            </div>

            {/* Error message */}
            {error && (
              <div className="mb-4 p-3 bg-red-50 border border-red-200 text-red-700 rounded-xl text-sm flex items-center space-x-2">
                <svg className="w-4 h-4 text-red-500 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span>{error}</span>
              </div>
            )}

            {/* Login Form */}
            <div className="space-y-4">
              {/* Email Field */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-3 py-2 bg-beige text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:shadow-none focus:border-blue-500 transition-all duration-200 text-sm rounded-none border-accent border-accent-top border-accent-left border-accent-right"
                  placeholder="Enter your email"
                  required
                />
              </div>

              {/* Password Field */}
              <div className="relative">
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Password<span className="text-red-500 ml-1">*</span>
                </label>
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  onKeyPress={handleKeyPress}
                  className="w-full px-3 py-2 bg-beige text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-0 focus:shadow-none focus:border-blue-500 transition-all duration-200 text-sm rounded-none border-accent border-accent-top border-accent-left border-accent-right"
                  placeholder="Enter your password"
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>

              {/* Sign In Button */}
              <button
                type="button"
                onClick={handleSubmit}
                disabled={loading || isSubmitting}
                className="w-full bg-gray-900 hover:bg-gray-800 disabled:bg-gray-400 text-white font-medium py-3 px-4 rounded-none transition-colors disabled:cursor-not-allowed border-accent border-accent-bottom"
              >
                {loading || isSubmitting ? (
                  <div className="flex items-center justify-center">
                    <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                    </svg>
                    Signing In...
                  </div>
                ) : (
                  'Sign In'
                )}
              </button>
            </div>

            {/* Additional Options */}
            <div className="mt-6 space-y-4">
              {/* Divider (disabled with Google Sign-In)
              <div className="relative">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-gray-200"></div>
                </div>
                <div className="relative flex justify-center text-sm">
                  <span className="px-4 bg-white/40 text-gray-500">or</span>
                </div>
              </div>

              Google Sign-In (temporarily disabled)
              <div className="w-full">
                <div ref={googleBtnRef} className="flex justify-center" />
                {!googleReady && (
                  <button
                    type="button"
                    onClick={() => {
                      try { window.google?.accounts?.id?.prompt(); } catch {}
                    }}
                    disabled={isSubmitting}
                    className="w-full border border-gray-300 hover:bg-gray-50 text-gray-900 font-medium py-3 px-4 rounded-none transition-colors flex items-center justify-center gap-2 bg-white"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 48 48" className="w-5 h-5">
                      <path fill="#FFC107" d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12 c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C32.769,6.053,28.576,4,24,4C12.955,4,4,12.955,4,24 s8.955,20,20,20s20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"/>
                      <path fill="#FF3D00" d="M6.306,14.691l6.571,4.819C14.655,16.108,18.961,14,24,14c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657 C32.769,6.053,28.576,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"/>
                      <path fill="#4CAF50" d="M24,44c4.522,0,8.646-1.732,11.77-4.565l-5.424-4.594C28.313,35.584,26.262,36,24,36 c-5.202,0-9.615-3.317-11.271-7.946l-6.5,5.017C9.551,39.556,16.227,44,24,44z"/>
                      <path fill="#1976D2" d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.027,5.557 c0.001-0.001,0.002-0.001,0.003-0.002l5.424,4.594C35.995,38.252,44,32,44,24C44,22.659,43.862,21.35,43.611,20.083z"/>
                    </svg>
                    Continue with Google
                  </button>
                )}
              </div>
              */}

              {/* Footer Links */}
              <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4">
                <button
                  onClick={() => router.push('/auth/forgot')}
                  className="text-gray-600 hover:text-gray-800 text-sm font-medium underline underline-offset-2"
                >
                  Forgot password?
                </button>
                <button
                  onClick={() => router.push('/marketing-funnel')}
                  className="text-gray-600 hover:text-gray-800 text-sm font-medium underline underline-offset-2"
                >
                  Create Your Account
                </button>
              </div>
            </div>

            {/* Footer */}
            <div className="mt-8 pt-6 border-t border-gray-200/50 text-center space-y-2">
              <div className="flex justify-center space-x-6 text-xs text-gray-500">
                <button className="hover:text-gray-700">Privacy Policy</button>
                <button className="hover:text-gray-700">Terms of Use</button>
              </div>
              <div className="text-xs text-gray-400">
                Copyright © 2025 Noyco Inc. All rights reserved.
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
