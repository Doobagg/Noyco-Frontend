"use client";
import Link from 'next/link';
import { useState, useEffect, useRef } from 'react';
import { useAuth } from '../store/hooks';
import { useRouter, usePathname } from 'next/navigation';

export default function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { user, isAuthenticated, loading, logout, refreshAuthToken } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const refreshIntervalRef = useRef(null);
  // Read loggedOut flag after mount to keep SSR/CSR markup consistent
  const [loggedOutFlag, setLoggedOutFlag] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // This runs only on client; initial render keeps false to match SSR
    try {
      if (typeof window !== 'undefined') {
        setLoggedOutFlag(localStorage.getItem('loggedOut') === 'true');
      }
    } catch {}
    setMounted(true);
  }, []);

  useEffect(() => {
    const checkAndRefreshAuth = async () => {
      const isAuthPage = pathname?.startsWith('/auth');
      if (!mounted || isAuthPage) return;

      if (!isAuthenticated && !loading && (typeof localStorage === 'undefined' || localStorage.getItem('loggedOut') !== 'true')) {
        try {
          await refreshAuthToken();
        } catch {
          console.log("Token refresh failed in navbar");
        }
      }
    };
    checkAndRefreshAuth();
  }, [isAuthenticated, loading, refreshAuthToken, mounted, pathname]);

  const handleLogout = async () => {
    if (refreshIntervalRef.current) {
      clearInterval(refreshIntervalRef.current);
      refreshIntervalRef.current = null;
    }
    await logout();
    router.push('/');
  };

  const getDashboardLink = () => {
    if (loggedOutFlag) {
      return '/auth/login';
    }
    if (!user) return '/auth/login';
    if (user.role === 'admin') return '/dashboard/admin';
    if (user.role === 'individual') return '/dashboard/individual';
    return '/dashboard/individual'; // Default to individual dashboard
  };

  return (
    <nav className="bg-beige border-accent border-accent-bottom sticky top-0 z-50" style={{ fontFamily: '"Mier A", sans-serif' }}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          
          {/* Logo Section */}
          <div className="flex items-center">
            <Link
              href="/"
              className="flex items-center space-x-2 group"
            >
              
              <span className="text-3xl  text-gray-900 group-hover:text-gray-700 transition-colors duration-200">
                Noyco
              </span>
            </Link>
          </div>

          {/* Center Navigation Links (Desktop) */}
          <div className="hidden lg:flex items-center justify-center flex-1">
            <div className="flex items-center space-x-8">
              <Link
                href="/#features"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200 relative group py-2"
              >
                Features
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"></span>
              </Link>
              <Link
                href="/#how-it-works"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200 relative group py-2"
              >
                How It Works
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"></span>
              </Link>
              <Link
                href="/contact-us"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200 relative group py-2"
              >
                Contact
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"></span>
              </Link>
              {/* <Link
                href="/docs"
                className="text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200 relative group py-2"
              >
                Docs
                <span className="absolute inset-x-0 -bottom-1 h-0.5 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] scale-x-0 group-hover:scale-x-100 transition-transform duration-200 origin-left"></span>
              </Link> */}
            </div>
          </div>

          {/* Right Section - Auth Buttons */}
          <div className="flex items-center space-x-3">
            {mounted && isAuthenticated && !loading && !pathname?.startsWith('/auth') ? (
              <div className="hidden lg:flex items-center space-x-4">
                <div className="flex items-center space-x-3 px-3 py-2 bg-white/50 border border-gray-200 hover:bg-white/70 transition-colors duration-200">
                  <div className="w-8 h-8 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] rounded-full flex items-center justify-center">
                    <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                  </div>
                  <span className="text-sm font-medium text-gray-700 max-w-32 truncate">{user?.name || user?.email}</span>
                </div>
                <Link
                  href={getDashboardLink()}
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium border border-gray-300 text-gray-700 bg-white hover:bg-gray-50 hover:border-gray-400 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Dashboard
                </Link>
                <button
                  onClick={handleLogout}
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-800 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Sign Out
                </button>
              </div>
            ) : (mounted && loading && !loggedOutFlag) ? (
              <div className="hidden lg:flex items-center space-x-2">
                <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                <span className="text-sm font-medium text-gray-500">Loading...</span>
              </div>
            ) : (
              <div className="hidden lg:flex items-center space-x-3">
                <Link
                  href="/auth/login"
                  className="inline-flex items-center justify-center px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Sign In
                </Link>
                <Link
                  href="/marketing-funnel"
                  className="inline-flex items-center justify-center px-6 py-2 text-sm  bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-900 border-accent border-accent-top border-accent-left border-accent-right hover:shadow-lg hover:scale-105 transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  Get Started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="lg:hidden">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="inline-flex items-center justify-center p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
              aria-expanded={mobileMenuOpen}
              aria-label="Toggle mobile menu"
            >
              <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                {mobileMenuOpen ? (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                ) : (
                  <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
                )}
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-beige border-accent border-accent-top shadow-lg">
          <div className="px-4 py-6 space-y-6">
            
            {/* Mobile Navigation Links */}
            <div className="space-y-1">
              <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-wider mb-3">Navigation</h3>
              <Link
                href="/#features"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Features
              </Link>
              <Link
                href="/#how-it-works"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                How It Works
              </Link>
              <Link
                href="/contact-us"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Contact
              </Link>
              <Link
                href="/docs"
                className="block px-3 py-2 text-base font-medium text-gray-700 hover:text-gray-900 hover:bg-gray-50 transition-colors duration-200"
                onClick={() => setMobileMenuOpen(false)}
              >
                Documentation
              </Link>
            </div>

            {/* Mobile Auth Section */}
            <div className="pt-4 border-t border-gray-200">
              {isAuthenticated && !loading && !pathname?.startsWith('/auth') ? (
                <div className="space-y-3">
                  <div className="flex items-center space-x-3 py-2">
                    <div className="w-8 h-8 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] rounded-full flex items-center justify-center">
                      <svg className="w-4 h-4 text-gray-800" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                      </svg>
                    </div>
                    <div>
                      <p className="text-xs font-medium text-gray-500">Signed in as</p>
                      <p className="text-sm font-medium text-gray-800">{user?.name || user?.email}</p>
                    </div>
                  </div>
                  <Link
                    href={getDashboardLink()}
                    className="block w-full text-center text-sm font-semibold border border-gray-300 text-gray-700 px-4 py-3 hover:bg-gray-50 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Dashboard
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setMobileMenuOpen(false);
                    }}
                    className="block w-full text-center text-sm font-semibold text-gray-600 hover:text-gray-800 px-4 py-3 transition-colors"
                  >
                    Sign Out
                  </button>
                </div>
              ) : loading && !loggedOutFlag ? (
                <div className="flex items-center justify-center space-x-2 py-4">
                  <div className="w-4 h-4 border-2 border-gray-300 border-t-gray-600 rounded-full animate-spin"></div>
                  <span className="text-sm font-medium text-gray-500">Loading...</span>
                </div>
              ) : (
                <div className="space-y-3">
                  <Link
                    href="/auth/login"
                    className="block w-full text-center text-sm font-semibold border border-gray-300 text-gray-700 px-4 py-3 hover:bg-gray-50 transition-colors"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/marketing-funnel"
                    className="block w-full text-center text-sm font-semibold bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-900 px-4 py-3 hover:shadow-md transition-all duration-300"
                    onClick={() => setMobileMenuOpen(false)}
                  >
                    Get Started
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </nav>
  );
}