import React from 'react';
import { 
  ChatBubbleLeftRightIcon,
  PhoneIcon, 
  HeartIcon,
  ShieldCheckIcon,
  UserGroupIcon,
  ClockIcon,
  SparklesIcon,
  BeakerIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline';

const FeaturesSection = () => {
  const features = [
    {
      icon: <ChatBubbleLeftRightIcon className="w-7 h-7" />,
      title: "Empathetic AI Conversations",
      description: "Experience truly understanding conversations with AI that recognizes emotions, context, and provides compassionate responses tailored to your mental well-being.",
      gradient: "from-violet-500 via-purple-500 to-purple-600",
      delay: "0ms"
    },
    {
      icon: <ClockIcon className="w-7 h-7" />,
      title: "Instant Response & Support",
      description: "Get immediate emotional support and personalized guidance whenever you need it, with intelligent responses that understand your current state.",
      gradient: "from-emerald-500 via-teal-500 to-cyan-600",
      delay: "100ms"
    },
    {
      icon: <HeartIcon className="w-7 h-7" />,
      title: "Specialized Mental Health Care",
      description: "Access a team of specialized AI agents trained in anxiety management, depression support, loneliness counseling, and therapeutic techniques.",
      gradient: "from-rose-500 via-pink-500 to-fuchsia-600",
      delay: "200ms"
    },
    {
      icon: <UserGroupIcon className="w-7 h-7" />,
      title: "Personal Growth Partner",
      description: "Build lasting positive habits with an AI companion that motivates, tracks your progress, and celebrates your achievements.",
      gradient: "from-orange-500 via-amber-500 to-yellow-600",
      delay: "300ms"
    },
    {
      icon: <BeakerIcon className="w-7 h-7" />,
      title: "Adaptive Learning Experience",
      description: "Watch as your AI companion evolves with you, learning your preferences and adapting its approach to provide increasingly personalized support.",
      gradient: "from-indigo-500 via-blue-500 to-sky-600",
      delay: "400ms"
    },
    {
      icon: <ShieldCheckIcon className="w-7 h-7" />,
      title: "Complete Privacy Protection",
      description: "Your deepest thoughts remain completely confidential with military-grade encryption and healthcare compliance standards.",
      gradient: "from-slate-600 via-gray-600 to-zinc-700",
      delay: "500ms"
    }
  ];

  const stats = [
    {
      value: "24/7",
      label: "Always Available",
      description: "Round-the-clock emotional support"
    },
    {
      value: "∞", 
      label: "Unlimited Sessions",
      description: "No restrictions on your healing journey"
    },
    {
      value: "5+",
      label: "Specialized Agents",
      description: "Expert AI for different mental health areas"
    },
    {
      value: "100%",
      label: "Private & Secure",
      description: "Your conversations stay completely confidential"
    }
  ];


  return (
    <section className="relative py-16 bg-beige" style={{ fontFamily: '"Mier A", sans-serif' }}>
      {/* Removed blurred animated background for cleaner, distraction-free look */}

      <div className="relative max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header Section */}
        <div className="text-center mb-16">
         
          
          <h2 className="text-3xl md:text-5xl  text-gray-900 mb-6 leading-tight">
            Your companion for <span className="bg-clip-text text-[#5d83b8]">inner peace</span>
          </h2>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Experience emotional support through advanced AI that understands, adapts, and grows with your mental health journey
          </p>
        </div>

        {/* Stats Section */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-20">
          {stats.map((stat, index) => (
            <div key={index} className="text-center group">
              <div className="relative inline-block">
                <div className="text-3xl md:text-4xl text-gray-900 mb-2 group-hover:scale-105 transition-transform duration-500">
                  {stat.value}
                </div>
                <div className="absolute -inset-3  group-hover:opacity-8 transition-opacity duration-500"></div>
              </div>
              <h3 className="text-base text-gray-900 mb-1">{stat.label}</h3>
              <p className="text-sm text-gray-500">{stat.description}</p>
            </div>
          ))}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-20">
          {features.map((feature, index) => (
            <div
              key={index}
              className="group relative h-full"
              style={{ animationDelay: feature.delay }}
            >
              {/* Background Card */}
              <div className="relative bg-beige p-6 border-accent border-accent-top border-accent-left border-accent-right hover:border-gray-300 transition-all duration-700 group-hover:shadow-xl group-hover:-translate-y-1 h-full flex flex-col">
                
                {/* Floating Icon */}
                <div className="relative mb-5">
                  <div className="w-12 h-12 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] p-3 text-gray-700 group-hover:scale-105 group-hover:rotate-3 transition-all duration-500 border border-gray-200">
                    {feature.icon}
                  </div>
                </div>

                {/* Content */}
                <div className="flex-grow">
                  <h3 className="text-lg text-gray-900 mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600 leading-relaxed text-sm">
                    {feature.description}
                  </p>
                </div>

                {/* Subtle Hover Gradient */}
                <div className={`absolute inset-0 rounded-3xl bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-[0.02] transition-all duration-500`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Experience Section */}
        <div className="text-center mb-16">
          <div className="max-w-4xl mx-auto">
            <h3 className="text-3xl md:text-5xl text-gray-900 mb-6 leading-tight">
              Designed for your
              <span className="bg-clip-text text-[#5d83b8]"> wellbeing</span>
            </h3>
            <p className="text-lg md:text-xl text-gray-600 leading-relaxed mb-8">
              Every interaction is crafted to feel natural, supportive, and genuinely helpful for your mental health journey
            </p>
            
            {/* Feature Highlights */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  icon: <CpuChipIcon className="w-5 h-5" />,
                  title: "Advanced AI Psychology",
                  description: "Built on cutting-edge research in cognitive behavioral therapy and positive psychology"
                },
                {
                  icon: <HeartIcon className="w-5 h-5" />,
                  title: "Emotional Intelligence",
                  description: "Recognizes and responds appropriately to your emotional state and communication style"
                },
                {
                  icon: <SparklesIcon className="w-5 h-5" />,
                  title: "Personalized Experience", 
                  description: "Adapts and evolves based on your unique needs, preferences, and progress over time"
                }
              ].map((highlight, index) => (
                <div key={index} className="text-center p-4">
                  <div className="w-10 h-10 bg-gradient-to-r from-[#E6D3E7] to-[#F6D9D5] border border-gray-200 flex items-center justify-center text-gray-700 mx-auto mb-3">
                    {highlight.icon}
                  </div>
                  <h4 className="text-base text-gray-900 mb-2">{highlight.title}</h4>
                  <p className="text-gray-600 text-sm leading-relaxed">{highlight.description}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Trust Section */}
      
      </div>
    </section>
  );
};

export default FeaturesSection;