"use client";

import { motion } from "framer-motion";

const WelcomeStep = ({ onNext}) => {
  const benefits = [
    {
      icon: "🎯",
      title: "Personalized Wellness",
      description: "AI that adapts to your unique health goals and lifestyle"
    },
    {
      icon: "💝",
      title: "Emotional Support",
      description: "A companion that understands and responds to your emotional needs"
    },
    {
      icon: "📈",
      title: "Track Progress",
      description: "Monitor your wellness journey with meaningful insights"
    },
    {
      icon: "🔐",
      title: "100% Private",
      description: "Your data is encrypted and never shared without permission"
    }
  ];

  return (
    <div className="text-center max-w-lg mx-auto">
      {/* Compact Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8"
      >
        {/* Simple Welcome Icon */}
        <motion.div
          className="text-5xl mb-4"
          animate={{ 
            scale: [1, 1.1, 1],
          }}
          transition={{ 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
        >
          👋
        </motion.div>
        
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mb-3 leading-tight">
          Welcome to{" "}
          <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent">
            Noyco
          </span>
        </h1>
        
        <p className="text-gray-600 mb-6 leading-relaxed">
          Let's create your personalized AI wellness companion in just a few quick steps.
        </p>

        {/* Compact Stats */}
        <div className="flex justify-center gap-4 mb-8">
          <div className="flex items-center gap-1 bg-green-50 text-green-700 px-3 py-1 rounded-full text-xs font-medium">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
            </svg>
            3-5 minutes
          </div>
          <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-3 py-1 rounded-full text-xs font-medium">
            <div className="w-2 h-2 bg-blue-500 rounded-full" />
            Skip optional steps
          </div>
          <div className="flex items-center gap-1 bg-purple-50 text-purple-700 px-3 py-1 rounded-full text-xs font-medium">
            <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M5 9V7a5 5 0 0110 0v2a2 2 0 012 2v5a2 2 0 01-2 2H5a2 2 0 01-2-2v-5a2 2 0 012-2zm8-2v2H7V7a3 3 0 016 0z" clipRule="evenodd" />
            </svg>
            Secure
          </div>
        </div>
      </motion.div>

      {/* Compact Benefits */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3, duration: 0.5 }}
        className="grid grid-cols-2 gap-4 mb-8"
      >
        {benefits.map((benefit, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 + index * 0.1 }}
            className="bg-gray-50 rounded-xl p-4 hover:bg-gray-100 transition-colors duration-200"
          >
            <div className="text-2xl mb-2">{benefit.icon}</div>
            <h3 className="text-sm font-semibold text-gray-900 mb-1">
              {benefit.title}
            </h3>
            <p className="text-xs text-gray-600 leading-relaxed">
              {benefit.description}
            </p>
          </motion.div>
        ))}
      </motion.div>

      {/* Call to Action */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.6 }}
        className="text-center"
      >
        <motion.button
          onClick={onNext}
          className="w-full bg-gradient-to-r from-blue-500 to-purple-600 text-white px-8 py-3 rounded-xl font-semibold hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2"
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
        >
          <span>Get Started</span>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
          </svg>
        </motion.button>
        
        <p className="text-gray-400 mt-3 text-sm">
          Your wellness journey starts here ✨
        </p>
      </motion.div>
    </div>
  );
};

export default WelcomeStep;
