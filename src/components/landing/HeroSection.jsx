"use client";

import React from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Star, Users, Award, Mic, ShieldCheck, Lock, Heart } from 'lucide-react';
import AnimatedBlob from './AnimatedBlob';

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
        willChange: 'transform, border-radius',
        WebkitBackfaceVisibility: 'hidden',
        backfaceVisibility: 'hidden',
        WebkitTransform: 'translateZ(0)',
        transform: 'translateZ(0)',
        WebkitPerspective: 1000,
        perspective: 1000,
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

  const avatars = [
    {
      name: 'Sydney',
      label: 'Sydney - Early Member',
      img: "/w1.jpg", 
      gradient: 'linear-gradient(135deg,#d8e2ef 0%,#f5d9e3 100%)'
    },
    {
      name: 'Cassie',
      label: 'Cassie - Beta Tester',
      img: "/w2.jpg",
      gradient: 'linear-gradient(135deg,#e7d9f3 0%,#d8e8f5 100%)'
    },
    {
      name: 'Lucy',
      label: 'Lucy - Wellness Coach',
      img: "/w3.jpg",
      gradient: 'linear-gradient(135deg,#f6e4d4 0%,#e2e9f4 100%)'
    }
  ];

  return (
  <div className="hero-wrapper relative min-h-screen bg-beige flex items-center justify-center overflow-hidden" style={{ fontFamily: '"Mier A", sans-serif' }}>


      <div className="container mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="flex flex-col lg:flex-row items-center justify-between max-w-7xl mx-auto gap-10 lg:gap-12">
          {/* Amoeba column first on mobile/tablet, second on large screens */}
          <div className="order-1 lg:order-2 w-full lg:w-1/2 flex justify-center lg:justify-end mb-4 md:mb-6 lg:mb-0">
            <motion.div
              className="relative w-full max-w-[300px] sm:max-w-[360px] md:max-w-[420px] lg:max-w-[520px] aspect-square mx-auto lg:mx-0"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2, ease: 'easeOut' }}
            >
              <Amoeba
                gradient="linear-gradient(135deg, #facc15 0%, #f97316 100%)"
                duration={24}
                delay={0}
                sizeClass="w-[clamp(160px,60%,440px)] aspect-square"
                isActive
                isPlaying={false}
              />
              <Amoeba
                gradient="linear-gradient(135deg, #a855f7 0%, #ef4444 100%)"
                duration={32}
                delay={2}
                sizeClass="w-[clamp(180px,68%,480px)] aspect-square"
                isActive
                isPlaying={false}
              />
              <Amoeba
                gradient="linear-gradient(135deg, #3b82f6 0%, #06b6d4 100%)"
                duration={28}
                delay={1}
                sizeClass="w-[clamp(150px,55%,400px)] aspect-square"
                isActive
                isPlaying={false}
              />
              <Amoeba
                gradient="linear-gradient(135deg, #ec4899 0%, #f43f5e 100%)"
                duration={36}
                delay={3}
                sizeClass="w-[clamp(170px,63%,460px)] aspect-square"
                isActive
                isPlaying={false}
              />
            </motion.div>
          </div>

          {/* Text column second on mobile/tablet, first on large screens */}
          <div className="order-2 lg:order-1 w-full lg:w-1/2 text-left px-2 sm:px-0">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, ease: "easeOut" }}
            >
              <div className="inline-flex items-center bg-beige text-gray-800 px-4 py-2  text-sm font-medium mb-4   ml-[-12px]">
                AI-Powered Mental Health Platform
              </div>
              
              <h1 className="text-3xl md:text-5xl text-gray-900 mb-4 leading-tight">
                Your Personal 
                <span className="text-[#5d83b8]"> Emotional Coach</span> 
              </h1>
              
              <p className="text-lg md:text-xl text-gray-600 mb-6 leading-relaxed max-w-xl">
                Experience personalized mental health support with our advanced AI agents. Get instant guidance, track your progress, and build lasting wellness habits.
              </p>
              
              <div className="flex flex-col sm:flex-row gap-3 sm:gap-4 justify-start">
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
                  onClick={() => router.push('/auth/login')}
                >
                  Sign in
                </motion.button>
              </div>
              <div className="mt-6 space-y-4">
                <div className="flex flex-wrap items-center justify-start gap-x-5 gap-y-2 text-[12px] sm:text-sm text-gray-600">
                  <span className="inline-flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-[#5d83b8]" /> Privacy-first
                  </span>
                  <span className="hidden sm:inline text-gray-300">•</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Lock className="w-3.5 h-3.5 text-[#5d83b8]" /> Encrypted sessions
                  </span>
                  <span className="hidden sm:inline text-gray-300">•</span>
                  <span className="inline-flex items-center gap-1.5">
                    <Heart className="w-3.5 h-3.5 text-[#5d83b8]" /> Designed with clinicians
                  </span>
                </div>
                <div className="flex flex-col sm:flex-row items-center sm:items-start justify-start sm:justify-start gap-3 sm:gap-5">
                  {/* Avatar stack driven by data */}
                  <div className="flex -space-x-3">
                    {avatars.map((a, i) => (
                      <div
                        key={i}
                        className="w-8 h-8 rounded-full border border-white ring-1 ring-black/5 flex items-center justify-center text-[10px] font-medium text-gray-700 overflow-hidden shadow-sm"
                        style={{ background: a.gradient }}
                        aria-label={a.label}
                        title={a.label}
                      >
                        {a.img ? (
                          <img src={a.img} alt={a.label} className="w-full h-full object-cover" />
                        ) : (
                          <span className="uppercase tracking-wide opacity-75">
                            {a.name.slice(0,1)}
                          </span>
                        )}
                      </div>
                    ))}
                    <div className="w-8 h-8 rounded-full bg-white/70 border border-white ring-1 ring-black/5 flex items-center justify-center text-[11px] font-medium text-gray-600 backdrop-blur-sm" aria-label="More members" title="More members">+12</div>
                  </div>
                  <div className="text-center sm:text-left">
                    <p className="text-sm sm:text-sm font-medium text-gray-700 tracking-tight">
                      Early members shaping calmer mental health routines
                    </p>
                    <p className="text-[12px] sm:text-[12px] text-gray-500 mb-8 sm:mb-0">
                      Join a private beta focused on meaningful, sustainable change.
                    </p>
                  </div>
                </div>
              </div>


            </motion.div>
          </div>
        </div>

      </div>
    </div>
  );
};

export default App;
 