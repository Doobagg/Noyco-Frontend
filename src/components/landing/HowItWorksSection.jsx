import React from 'react';
import { 
  MessageCircle,
  UserPlus,
  Settings,
  Heart,
  CheckCircle,
  ArrowRight,
  Sparkles,
  Clock,
  Shield
} from 'lucide-react';

const HowItWorksSection = () => {
  const steps = [
    {
      icon: <UserPlus className="w-8 h-8 text-gray-700" />,
      title: "Create Your Profile",
      description: "Share your mental health goals, preferences, and comfort level. Our AI learns about your unique needs to provide personalized support.",
      delay: "0ms",
      features: ["Secure onboarding", "Privacy-first approach", "Personalized assessment"]
    },
    {
      icon: <Settings className="w-8 h-8 text-gray-700" />,
      title: "AI Agent Matching",
      description: "Get matched with specialized AI agents trained in your specific areas - anxiety, depression, loneliness, or general wellness support.",
      delay: "100ms",
      features: ["Specialized agents", "Smart matching", "Multiple expertise areas"]
    },
    {
      icon: <MessageCircle className="w-8 h-8 text-gray-700" />,
      title: "Start Your Sessions",
      description: "Begin meaningful conversations through text or voice. Your AI companion provides empathetic support, coping strategies, and personalized guidance.",
      delay: "200ms", 
      features: ["Text & voice support", "24/7 availability", "Empathetic responses"]
    },
    {
      icon: <Heart className="w-8 h-8 text-gray-700" />,
      title: "Track Your Growth",
      description: "Monitor your progress with detailed insights, mood tracking, and goal achievement. Celebrate milestones on your wellness journey.",
      delay: "300ms",
      features: ["Progress tracking", "Mood insights", "Goal achievements"]
    }
  ];

  const benefits = [
    {
      icon: <Clock className="w-6 h-6 text-gray-700" />,
      title: "Available 24/7",
      description: "Support whenever you need it, no appointments required"
    },
    {
      icon: <Shield className="w-6 h-6 text-gray-700" />,
      title: "Completely Private",
      description: "Your conversations are encrypted and confidential"
    },
    {
      icon: <Sparkles className="w-6 h-6 text-gray-700" />,
      title: "Continuously Learning",
      description: "AI adapts and improves based on your preferences"
    }
  ];

  return (
    <section className="relative py-20 bg-beige" style={{ fontFamily: '"Mier A", sans-serif' }}>
      {/* Removed blurred animated background blobs */}

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
          
          
          <h2 className="text-3xl md:text-5xl  text-gray-900 mb-6 leading-tight">
            How <span className="bg-clip-text text-[#5d83b8]">Noyco Works</span>
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Start your personalized mental wellness journey in just a few simple steps. Our AI-powered platform makes getting support easier than ever.
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8 mb-20">
          {steps.map((step, index) => (
            <div
              key={index}
              className="group relative"
              style={{ animationDelay: step.delay }}
            >
              {/* Removed decorative connection line */}

              {/* Card */}
              <div className="relative bg-beige p-6 border-accent border-accent-top border-accent-left border-accent-right hover:border-gray-300 transition-all duration-700 group-hover:shadow-xl group-hover:-translate-y-2 h-full">

                {/* Floating Icon */}
                <div className="relative mb-6 flex justify-center">
                  <div className="group-hover:scale-105 group-hover:rotate-3 transition-all duration-500">
                    {step.icon}
                  </div>
                </div>

                {/* Content */}
                <h3 className="text-lg  text-gray-900 mb-3 group-hover:text-gray-700 transition-colors duration-300">
                  {step.title}
                </h3>
                <p className="text-gray-600 leading-relaxed text-sm mb-4">
                  {step.description}
                </p>

                {/* Features List */}
                <div className="space-y-2">
                  {step.features.map((feature, idx) => (
                    <div key={idx} className="flex items-center text-xs text-gray-600">
                      <CheckCircle className="w-4 h-4 text-gray-700 mr-2 flex-shrink-0" />
                      {feature}
                    </div>
                  ))}
                </div>

                {/* Subtle Hover Gradient */}
                <div className={`absolute inset-0 rounded-2xl bg-gradient-to-br ${step.gradient} opacity-0 group-hover:opacity-[0.02] transition-all duration-500`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Benefits Section */}
        <div className="text-center mb-16">
          <h3 className="text-3xl md:text-5xl text-gray-900 mb-6 leading-tight">
            Why choose
            <span className=" bg-clip-text text-[#5d83b8]"> Noyco?</span>
          </h3>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {benefits.map((benefit, index) => (
              <div key={index} className="bg-beige p-6 border-accent border-accent-top border-accent-left border-accent-right hover:bg-gray-50 transition-all duration-300">
                <div className="flex justify-center mb-4">
                  {benefit.icon}
                </div>
                <h4 className="text-lg  text-gray-900 mb-2">{benefit.title}</h4>
                <p className="text-gray-600 text-sm leading-relaxed">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>

       
      </div>
    </section>
  );
};

export default HowItWorksSection;