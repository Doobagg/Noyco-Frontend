import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';
import { generatePageMetadata, generateStructuredData, pageMetadata } from '@/lib/seo';

// Generate metadata with structured data for the home page
export async function generateMetadata() {
  const baseMetadata = generatePageMetadata(pageMetadata.home);
  
  const structuredData = generateStructuredData('service', {
    name: 'AI Mental Health Support',
    description: 'AI-powered mental health therapy and emotional support available 24/7',
    offers: {
      '@type': 'Offer',
      availability: 'https://schema.org/InStock',
      price: '0',
      priceCurrency: 'USD',
    },
  });

  return {
    ...baseMetadata,
    other: {
      'application-ld+json': JSON.stringify(structuredData),
    },
  };
}

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section id="hero" aria-label="Hero section introducing Noyco AI mental health support">
        <HeroSection />
      </section>
      
      {/* Section Separator */}
      <div className="border-accent border-accent-top"></div>

      {/* Features Section */}
      <section id="features" aria-label="Key features of Noyco AI therapy platform">
        <FeaturesSection />
      </section>
      
      {/* Section Separator */}
      <div className="border-accent border-accent-top"></div>

      {/* How It Works Section */}
      <section id="how-it-works" aria-label="How Noyco mental health support works">
        <HowItWorksSection />
      </section>
      
      {/* Section Separator */}
      <div className="border-accent border-accent-top"></div>

      {/* Testimonials Section */}
      <section id="testimonials" aria-label="User testimonials and reviews">
        <TestimonialsSection />
      </section>
    </div>
  );
}

export default HomePage;