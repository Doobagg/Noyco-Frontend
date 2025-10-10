'use client';

import Script from 'next/script';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect } from 'react';

// Helper function to determine content group based on path
export const getContentGroup = (pathname) => {
  if (!pathname) return 'Home';
  
  if (pathname === '/') return 'Home';
  if (pathname.startsWith('/dashboard')) return 'Dashboard';
  if (pathname.startsWith('/auth')) return 'Authentication';
  if (pathname.startsWith('/getting-started')) return 'Getting Started';
  if (pathname.startsWith('/docs')) return 'Documentation';
  if (pathname.startsWith('/legal')) return 'Legal';
  if (pathname.startsWith('/contact-us')) return 'Contact';
  if (pathname.startsWith('/stripe')) return 'Stripe';
  
  return 'Other';
};

export default function GoogleAnalytics({ measurementId }) {
  const pathname = usePathname();
  const searchParams = useSearchParams();

  useEffect(() => {
    if (!measurementId || typeof window.gtag === 'undefined') return;

    const url = pathname + (searchParams.toString() ? `?${searchParams.toString()}` : '');
    const contentGroup = getContentGroup(pathname);
    
    window.gtag('config', measurementId, {
      page_path: url,
      content_group: contentGroup,
    });
  }, [pathname, searchParams, measurementId]);

  if (!measurementId) return null;
  
  return (
    <>
      <Script
        strategy="afterInteractive"
        src={`https://www.googletagmanager.com/gtag/js?id=${measurementId}`}
      />
      <Script
        id="google-analytics"
        strategy="afterInteractive"
        dangerouslySetInnerHTML={{
          __html: `
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            gtag('js', new Date());
            gtag('config', '${measurementId}', {
              page_path: window.location.pathname,
              content_group: '${getContentGroup(typeof window !== 'undefined' ? window.location.pathname : '/')}',
            });
          `,
        }}
      />
    </>
  );
}

// Helper function to track custom events
export const trackEvent = (eventName, eventParams = {}) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('event', eventName, eventParams);
  }
};

// Common event trackers
export const trackPageView = (url, contentGroup = null) => {
  if (typeof window !== 'undefined' && window.gtag) {
    const pathname = url.split('?')[0];
    const group = contentGroup || getContentGroup(pathname);
    
    window.gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID, {
      page_path: url,
      content_group: group,
    });
  }
};

export const trackSignUp = (method = 'email') => {
  trackEvent('sign_up', { method });
};

export const trackLogin = (method = 'email') => {
  trackEvent('login', { method });
};

export const trackCTAClick = (ctaName) => {
  trackEvent('cta_click', { cta_name: ctaName });
};

export const trackSessionStart = () => {
  trackEvent('session_start');
};

export const trackConversion = (conversionType, value = 0) => {
  trackEvent('conversion', {
    conversion_type: conversionType,
    value: value,
  });
};
