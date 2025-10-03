import HeroSection from '@/components/landing/HeroSection';
import FeaturesSection from '@/components/landing/FeaturesSection';
import HowItWorksSection from '@/components/landing/HowItWorksSection';
import TestimonialsSection from '@/components/landing/TestimonialsSection';

const HomePage = () => {
  return (
    <div className="min-h-screen bg-white">
      {/* Hero Section */}
      <section id="hero">
        <HeroSection />
      </section>
      
      {/* Section Separator */}
      <div className="border-accent border-accent-top"></div>

      {/* Features Section */}
      <section id="features">
        <FeaturesSection />
      </section>
      
      {/* Section Separator */}
      <div className="border-accent border-accent-top"></div>

      {/* How It Works Section */}
      <section id="how-it-works">
        <HowItWorksSection />
      </section>
      
      {/* Section Separator */}
      <div className="border-accent border-accent-top"></div>

      {/* Testimonials Section */}
      <section id="testimonials">
        <TestimonialsSection />
      </section>
    </div>
  );
}

export default HomePage;