"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Users, Award, Mic } from 'lucide-react';
import AnimatedBlob from './AnimatedBlob';

// Amoeba animation copied from VoiceDemo with isActive/isPlaying controls
const Amoeba = ({ gradient, duration, delay, sizeClass, isActive = false, isPlaying = false }) => {
  const getAnimationProps = () => {
    if (isPlaying) {
      return {
        borderRadius: [
          '40% 60% 60% 40% / 50% 40% 60% 50%',
          '70% 30% 30% 70% / 30% 70% 30% 70%',
          '30% 70% 70% 30% / 70% 30% 70% 30%',
          '60% 40% 40% 60% / 40% 60% 40% 60%',
          '40% 60% 60% 40% / 50% 40% 60% 50%',
        ],
        scale: [1, 1.2, 0.7, 1.3, 0.85, 1],
        x: [0, 60, -40, 80, -60, 0],
        y: [0, -80, 60, -40, 70, 0],
        transition: {
          duration: duration * 0.25,
          delay: delay * 0.3,
          repeat: Infinity,
          ease: 'easeInOut',
        }
      };
    } else if (isActive) {
      return {
        borderRadius: [
          '40% 60% 60% 40% / 50% 40% 60% 50%',
          '65% 35% 35% 65% / 35% 65% 35% 65%',
          '45% 55% 75% 25% / 25% 75% 25% 75%',
          '75% 25% 25% 75% / 65% 35% 65% 35%',
          '40% 60% 60% 40% / 50% 40% 60% 50%',
        ],
        scale: [1, 1.15, 0.8, 1.2, 0.9, 1],
        x: [0, 45, -30, 60, -45, 0],
        y: [0, -60, 45, -30, 50, 0],
        transition: {
          duration: duration * 0.5,
          delay: delay * 0.6,
          repeat: Infinity,
          ease: 'easeInOut',
        }
      };
    } else {
      return {
        borderRadius: [
          '40% 60% 60% 40% / 50% 40% 60% 50%',
          '60% 40% 40% 60% / 40% 60% 40% 60%',
          '50% 50% 70% 30% / 30% 70% 30% 70%',
          '70% 30% 30% 70% / 60% 40% 60% 40%',
          '40% 60% 60% 40% / 50% 40% 60% 50%',
        ],
        scale: [1, 1.1, 0.9, 1.05, 1],
        x: [0, 25, -25, 20, 0],
        y: [0, -20, 25, -15, 0],
        transition: {
          duration,
          repeat: Infinity,
          ease: 'easeInOut',
          delay,
        }
      };
    }
  };

  const animationProps = getAnimationProps();

  return (
    <motion.div
      className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 ${sizeClass}`}
      style={{
        background: gradient,
        filter: isPlaying ? 'blur(35px)' : isActive ? 'blur(42px)' : 'blur(50px)',
        opacity: isPlaying ? 0.8 : isActive ? 0.7 : 0.55,
      }}
      animate={{
        borderRadius: animationProps.borderRadius,
        scale: animationProps.scale,
        x: animationProps.x,
        y: animationProps.y,
      }}
      transition={animationProps.transition}
    />
  );
};


const App = () => {
  const router = useRouter();

  return (
    <div className="relative min-h-screen bg-beige flex items-center justify-center overflow-hidden" style={{ fontFamily: '"Mier A", sans-serif' }}>


      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto gap-8 lg:gap-12">
          {/* Left Column - Text Content */}
          <div className="w-full lg:w-1/2 text-center lg:text-left mb-8 lg:mb-0 px-2 sm:px-0">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center bg-beige text-gray-800 px-4 py-2 b text-sm font-medium mb-4">
                AI-Powered Mental Health Platform
              </div>
              
              <h1 className="text-3xl md:text-5xl text-gray-900 mb-4 leading-tight">
                Your Personal 
                <span className="text-[#5d83b8]"> AI Wellness</span> Companion
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 mb-6 leading-relaxed max-w-xl">
                Experience personalized mental health support with our advanced AI agents. Get instant guidance, track your progress, and build lasting wellness habits.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-center lg:justify-start">
                <motion.button
                  className="bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 px-4 sm:px-6 py-2.5 sm:py-3 text-base sm:text-lg border-accent border-accent-top border-accent-left border-accent-right hover:shadow-lg transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => router.push('/marketing-funnel')}
                >
                  Get Started
                </motion.button>
                <motion.button
                  className="bg-beige text-gray-800 px-4 sm:px-6 py-2.5 sm:py-3 text-base sm:text-lg border-accent border-accent-top border-accent-left border-accent-right hover:bg-gray-100 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Sign in
                </motion.button>
              </div>
              
              
            </motion.div>
          </div>

          {/* Right Column - Amoeba with VoiceDemo colors/behavior + centered mic */}
          <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
            <motion.div
              className="relative w-full max-w-[280px] sm:max-w-[350px] md:max-w-[400px] lg:max-w-[520px] aspect-square mx-auto lg:mx-0"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            >
              {/* VoiceDemo gradients and timings */}
              <Amoeba
                gradient="linear-gradient(135deg, #facc15 0%, #f97316 100%)"
                duration={24}
                delay={0}
                sizeClass="w-[clamp(120px,55%,420px)] aspect-square"
                isActive
                isPlaying={false}
              />
              <Amoeba
                gradient="linear-gradient(135deg, #a855f7 0%, #ef4444 100%)"
                duration={32}
                delay={2}
                sizeClass="w-[clamp(140px,62%,460px)] aspect-square"
                isActive
                isPlaying={false}
              />
              <Amoeba
                gradient="linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)"
                duration={28}
                delay={1}
                sizeClass="w-[clamp(100px,48%,380px)] aspect-square"
                isActive
                isPlaying={false}
              />
              <Amoeba
                gradient="linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)"
                duration={36}
                delay={3}
                sizeClass="w-[clamp(120px,58%,440px)] aspect-square"
                isActive
                isPlaying={false}
              />

              {/* Center mic button (visual only) */}
             
            </motion.div>
          </div>
        </div>

        {/* Trust indicators */}
        <motion.div
          className="mt-12 sm:mt-16 text-center px-4 sm:px-0"
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.6 }}
        >
          <div className="bg-beige border-accent border-accent-top border-accent-left border-accent-right p-4 sm:p-6">
            <p className="text-xs sm:text-sm text-gray-600 mb-3 sm:mb-4">Trusted by leading healthcare organizations</p>
            <div className="flex flex-wrap justify-center items-center gap-4 sm:gap-6 lg:gap-8 opacity-60">
              <div className="text-sm sm:text-base lg:text-lg font-semibold text-gray-600">Mayo Clinic</div>
              <div className="text-sm sm:text-base lg:text-lg font-semibold text-gray-600">Johns Hopkins</div>
              <div className="text-sm sm:text-base lg:text-lg font-semibold text-gray-600">Stanford Health</div>
              <div className="text-sm sm:text-base lg:text-lg font-semibold text-gray-600">Cleveland Clinic</div>
            </div>
          </div>

        </motion.div>
      </div>
    </div>
  );
};

export default App;
 