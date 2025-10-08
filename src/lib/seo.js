// SEO Keywords and Metadata Configuration
export const seoConfig = {
  siteName: 'Noyco',
  siteUrl: process.env.NEXT_PUBLIC_SITE_URL || 'https://noyco.com',
  defaultTitle: 'Noyco - AI Mental Health Support & Online Therapy 24/7',
  defaultDescription: 'Get instant mental health support with Noyco\'s AI therapy platform. Access 24/7 online counseling for anxiety, depression, and loneliness. Private, secure, and always available.',
  keywords: [
    // Primary Keywords
    'AI mental health support',
    'online therapy',
    'AI therapy',
    'mental health app',
    'emotional support AI',
    'virtual therapy',
    'digital mental health',
    
    // Specific Conditions
    'anxiety support',
    'depression therapy',
    'loneliness counseling',
    'mental wellness',
    'emotional wellness',
    'stress management',
    'mental health care',
    
    // Service-specific
    '24/7 therapy',
    'instant counseling',
    'AI counselor',
    'virtual therapist',
    'online mental health support',
    'confidential therapy',
    'private counseling',
    
    // Technology
    'AI chatbot therapy',
    'voice therapy AI',
    'mental health chatbot',
    'therapy app',
    'wellness app',
    
    // Benefits
    'affordable therapy',
    'accessible mental health',
    'anonymous therapy',
    'no appointment therapy',
    'unlimited therapy sessions',
    
    // Long-tail keywords
    'AI therapist for anxiety',
    'online depression support',
    'virtual mental health counseling',
    'instant mental health help',
    'AI-powered emotional support',
    'text therapy online',
    'voice therapy sessions',
    'mental health AI assistant',
  ],
  
  // Structured Data
  organization: {
    '@type': 'Organization',
    name: 'Noyco',
    description: 'AI-powered mental health and wellness platform providing 24/7 emotional support and therapy',
    url: process.env.NEXT_PUBLIC_SITE_URL || 'https://noyco.com',
  },
  
  // Open Graph defaults
  ogImage: '/og-image.jpg',
  twitterCard: 'summary_large_image',
};

// Generate metadata for Next.js pages
export function generatePageMetadata({
  title,
  description,
  keywords = [],
  ogImage,
  noindex = false,
  canonical,
  alternates,
}) {
  const fullTitle = title 
    ? `${title} | ${seoConfig.siteName}` 
    : seoConfig.defaultTitle;
  
  const fullDescription = description || seoConfig.defaultDescription;
  
  const allKeywords = [
    ...seoConfig.keywords,
    ...keywords,
  ].join(', ');
  
  const metadata = {
    title: fullTitle,
    description: fullDescription,
    keywords: allKeywords,
    authors: [{ name: seoConfig.siteName }],
    creator: seoConfig.siteName,
    publisher: seoConfig.siteName,
    formatDetection: {
      email: false,
      address: false,
      telephone: false,
    },
    metadataBase: new URL(seoConfig.siteUrl),
    alternates: alternates || {
      canonical: canonical || seoConfig.siteUrl,
    },
    openGraph: {
      title: fullTitle,
      description: fullDescription,
      url: canonical || seoConfig.siteUrl,
      siteName: seoConfig.siteName,
      images: [
        {
          url: ogImage || seoConfig.ogImage,
          width: 1200,
          height: 630,
          alt: fullTitle,
        },
      ],
      locale: 'en_US',
      type: 'website',
    },
    twitter: {
      card: seoConfig.twitterCard,
      title: fullTitle,
      description: fullDescription,
      images: [ogImage || seoConfig.ogImage],
    },
    robots: {
      index: !noindex,
      follow: !noindex,
      googleBot: {
        index: !noindex,
        follow: !noindex,
        'max-video-preview': -1,
        'max-image-preview': 'large',
        'max-snippet': -1,
      },
    },
    verification: {
      google: process.env.NEXT_PUBLIC_GOOGLE_SITE_VERIFICATION,
      yandex: process.env.NEXT_PUBLIC_YANDEX_VERIFICATION,
      bing: process.env.NEXT_PUBLIC_BING_VERIFICATION,
    },
  };
  
  return metadata;
}

// Generate JSON-LD structured data
export function generateStructuredData(type, data) {
  const baseData = {
    '@context': 'https://schema.org',
  };
  
  switch (type) {
    case 'organization':
      return {
        ...baseData,
        '@type': 'Organization',
        name: seoConfig.siteName,
        url: seoConfig.siteUrl,
        logo: `${seoConfig.siteUrl}/logo.png`,
        description: seoConfig.defaultDescription,
        ...data,
      };
      
    case 'website':
      return {
        ...baseData,
        '@type': 'WebSite',
        name: seoConfig.siteName,
        url: seoConfig.siteUrl,
        description: seoConfig.defaultDescription,
        ...data,
      };
      
    case 'service':
      return {
        ...baseData,
        '@type': 'Service',
        serviceType: 'Mental Health Services',
        provider: {
          '@type': 'Organization',
          name: seoConfig.siteName,
          url: seoConfig.siteUrl,
        },
        areaServed: 'Worldwide',
        availableChannel: {
          '@type': 'ServiceChannel',
          serviceUrl: seoConfig.siteUrl,
          servicePhone: data.phone,
          availableLanguage: ['English'],
        },
        ...data,
      };
      
    case 'faq':
      return {
        ...baseData,
        '@type': 'FAQPage',
        mainEntity: data.questions.map(q => ({
          '@type': 'Question',
          name: q.question,
          acceptedAnswer: {
            '@type': 'Answer',
            text: q.answer,
          },
        })),
      };
      
    case 'breadcrumb':
      return {
        ...baseData,
        '@type': 'BreadcrumbList',
        itemListElement: data.items.map((item, index) => ({
          '@type': 'ListItem',
          position: index + 1,
          name: item.name,
          item: item.url,
        })),
      };
      
    default:
      return baseData;
  }
}

// Page-specific SEO configurations
export const pageMetadata = {
  home: {
    title: 'AI Mental Health Support & Online Therapy 24/7',
    description: 'Get instant mental health support with Noyco\'s AI therapy platform. Access 24/7 online counseling for anxiety, depression, and loneliness. Private, secure, and always available.',
    keywords: [
      'AI therapy platform',
      'instant mental health support',
      '24/7 online therapy',
      'AI mental health app',
      'virtual counseling',
      'emotional support online',
    ],
  },
  
  login: {
    title: 'Login to Your Account - Secure Mental Health Support',
    description: 'Access your Noyco account for personalized AI therapy and mental health support. Secure login with privacy protection.',
    keywords: [
      'mental health login',
      'therapy app login',
      'secure therapy access',
    ],
    noindex: true,
  },
  
  signup: {
    title: 'Sign Up for Free - Start Your Mental Wellness Journey',
    description: 'Create your free Noyco account and get instant access to AI-powered mental health support. No credit card required to start.',
    keywords: [
      'free mental health app',
      'sign up therapy',
      'create therapy account',
      'free AI counseling',
    ],
  },
  
  dashboard: {
    title: 'Your Mental Health Dashboard',
    description: 'Track your mental wellness journey, access AI therapy sessions, and monitor your progress with personalized insights.',
    keywords: [
      'mental health dashboard',
      'therapy tracking',
      'wellness progress',
    ],
    noindex: true,
  },
  
  contact: {
    title: 'Contact Us - Get Help with Your Mental Health Journey',
    description: 'Have questions about Noyco\'s AI therapy platform? Contact our support team for help with your mental health and wellness needs.',
    keywords: [
      'mental health support',
      'therapy help',
      'contact counseling service',
      'customer support',
    ],
  },
  
  marketingFunnel: {
    title: 'Discover Personalized Mental Health Support',
    description: 'Find the right AI therapy solution for your mental health needs. Take our assessment and get matched with specialized support.',
    keywords: [
      'mental health assessment',
      'therapy matching',
      'personalized counseling',
      'mental wellness quiz',
    ],
  },
};
