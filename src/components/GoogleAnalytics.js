'use client';

import Script from 'next/script';

export default function GoogleAnalytics({ measurementId }) {
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
export const trackPageView = (url) => {
  if (typeof window !== 'undefined' && window.gtag) {
    window.gtag('config', process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID, {
      page_path: url,
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
