"use client";

import { useRef, useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useMarketingFunnel } from "../../context/MarketingFunnelContext";

const PersonalizedPlanCreationStep = () => {
  const { data, actions } = useMarketingFunnel();
  const [currentPhase, setCurrentPhase] = useState('analyzing');
  const [progress, setProgress] = useState(0);
  const [currentReview, setCurrentReview] = useState(0);
  const reviewContainerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);
  const [startX, setStartX] = useState(0);
  const [scrollLeft, setScrollLeft] = useState(0);

  // Sample reviews data (similar to Leaply's style)
  const reviews = [
    {
      id: 1,
      name: "Sarah M.",
      age: 28,
      rating: 5,
      text: "This personalized approach completely changed my anxiety management. The daily check-ins keep me grounded.",
      avatar: "👩‍💼"
    },
    {
      id: 2,
      name: "James R.",
      age: 35,
      rating: 5,
      text: "I was skeptical at first, but the tailored plan really works. My stress levels dropped significantly in just 3 weeks.",
      avatar: "👨‍💻"
    },
    {
      id: 3,
      name: "Maria L.",
      age: 42,
      rating: 5,
      text: "The agents understand exactly what I need. It's like having a personal therapist available 24/7.",
      avatar: "👩‍🎨"
    },
    {
      id: 4,
      name: "David K.",
      age: 31,
      rating: 5,
      text: "Amazing results! The personalized techniques are so much better than generic advice I found elsewhere.",
      avatar: "👨‍🔬"
    },
    {
      id: 5,
      name: "Emily C.",
      age: 26,
      rating: 5,
      text: "Finally found something that works for my specific triggers. The customization is incredible.",
      avatar: "👩‍🎓"
    }
  ];

  const phases = [
    { id: 'analyzing', text: 'Analyzing your responses...', duration: 4000 },
    { id: 'matching', text: 'Matching with specialized agents...', duration: 3600 },
    { id: 'customizing', text: 'Customizing your intervention plan...', duration: 4400 },
    { id: 'finalizing', text: 'Finalizing your personalized approach...', duration: 3000 },
    { id: 'complete', text: 'Your plan is ready!', duration: 2000 }
  ];

  // Animation sequence for plan creation
  useEffect(() => {
    let phaseIndex = 0;
    let progressInterval;
    let phaseTimeout;

    const runPhase = () => {
      const phase = phases[phaseIndex];
      setCurrentPhase(phase.id);
      setProgress(0);

      // Animate progress bar
      progressInterval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + (100 / (phase.duration / 100));
          return newProgress >= 100 ? 100 : newProgress;
        });
      }, 100);

      // Move to next phase
      phaseTimeout = setTimeout(() => {
        clearInterval(progressInterval);
        phaseIndex++;
        
        if (phaseIndex < phases.length) {
          runPhase();
        } else {
          // Animation complete, move to next step after a brief pause
          setTimeout(() => {
            actions.nextStep();
          }, 3000);
        }
      }, phase.duration);
    };

    // Start the sequence after a brief delay
    const initialDelay = setTimeout(runPhase, 500);

    return () => {
      clearTimeout(initialDelay);
      clearTimeout(phaseTimeout);
      clearInterval(progressInterval);
    };
  }, [actions]);

  // Horizontal review scrolling
  useEffect(() => {
    if (isDragging) return; // Don't auto-scroll when user is dragging
    
    const interval = setInterval(() => {
      setCurrentReview(prev => (prev + 1) % reviews.length);
    }, 4000);

    return () => clearInterval(interval);
  }, [reviews.length, isDragging]);

  // Auto-scroll reviews horizontally
  useEffect(() => {
    if (reviewContainerRef.current && !isDragging) {
      const container = reviewContainerRef.current;
      const reviewWidth = container.children[0]?.offsetWidth || 0;
      const gap = 16; // gap between reviews
      container.scrollTo({
        left: currentReview * (reviewWidth + gap),
        behavior: 'smooth'
      });
    }
  }, [currentReview, isDragging]);

  // Drag scrolling handlers
  const handleMouseDown = (e) => {
    setIsDragging(true);
    setStartX(e.pageX - reviewContainerRef.current.offsetLeft);
    setScrollLeft(reviewContainerRef.current.scrollLeft);
    reviewContainerRef.current.style.cursor = 'grabbing';
  };

  const handleMouseMove = (e) => {
    if (!isDragging) return;
    e.preventDefault();
    const x = e.pageX - reviewContainerRef.current.offsetLeft;
    const walk = (x - startX) * 2; // Scroll speed multiplier
    reviewContainerRef.current.scrollLeft = scrollLeft - walk;
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    reviewContainerRef.current.style.cursor = 'grab';
    
    // Update current review based on scroll position
    setTimeout(() => {
      if (reviewContainerRef.current) {
        const container = reviewContainerRef.current;
        const reviewWidth = container.children[0]?.offsetWidth || 0;
        const gap = 16;
        const scrollPosition = container.scrollLeft;
        const newIndex = Math.round(scrollPosition / (reviewWidth + gap));
        setCurrentReview(Math.min(newIndex, reviews.length - 1));
      }
    }, 100);
  };

  const handleMouseLeave = () => {
    if (isDragging) {
      setIsDragging(false);
      reviewContainerRef.current.style.cursor = 'grab';
    }
  };

  const getCurrentPhaseText = () => {
    const phase = phases.find(p => p.id === currentPhase);
    return phase?.text || 'Processing...';
  };

  return (
    <div className="text-center space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <motion.h2 
          className="text-xl font-medium text-gray-900"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Creating Your Personalized Plan
        </motion.h2>
        <motion.p 
          className="text-gray-500 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          We're crafting a unique approach based on your specific needs and goals
        </motion.p>
      </div>

      {/* Main creation animation */}
      <motion.div 
        className="bg-white border border-gray-200 rounded-lg p-8 shadow-sm"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {/* Animated icon */}
        <div className="mb-6">
          <motion.div 
            className="mx-auto w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center"
            animate={{ 
              rotate: currentPhase === 'complete' ? 0 : 360,
              scale: currentPhase === 'complete' ? 1.1 : 1
            }}
            transition={{ 
              rotate: { duration: 2, repeat: currentPhase === 'complete' ? 0 : Infinity, ease: "linear" },
              scale: { duration: 0.3 }
            }}
          >
            {currentPhase === 'complete' ? (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5 }}
                className="text-green-600 text-2xl"
              >
                ✓
              </motion.div>
            ) : (
              <div className="w-8 h-8 border-3 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
            )}
          </motion.div>
        </div>

        {/* Phase text */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentPhase}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="mb-4"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              {getCurrentPhaseText()}
            </h3>
          </motion.div>
        </AnimatePresence>

        {/* Progress bar */}
        <div className="w-full bg-gray-200 rounded-full h-2 mb-4">
          <motion.div 
            className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full"
            style={{ width: `${progress}%` }}
            transition={{ duration: 0.1 }}
          />
        </div>

        {/* Dynamic stats based on user data */}
        <div className="grid grid-cols-3 gap-4 text-center mb-2">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3">
            <div className="text-xs  text-blue-700 mb-1">Intensity Level</div>
            <div className="text-xl  text-blue-600">
              {data.currentIntensity || data.intensity || '1'}/10
            </div>
          </div>
          <div className="bg-purple-50 border border-purple-200 rounded-lg p-3">
            <div className="text-xs  text-purple-700 mb-1">Focus Areas</div>
            <div className="text-xl  text-purple-600">
              {data.symptomPatterns?.length || data.focusAreas?.length || '2'}
            </div>
          </div>
          <div className="bg-green-50 border border-green-200 rounded-lg p-3">
            <div className="text-xs  text-green-700 mb-1">Time Budget</div>
            <div className="text-xl  text-green-600">
              {data.timeBudget || '5 min'}
            </div>
          </div>
        </div>
        
        {/* Additional user preferences */}
        <div className="text-xs text-gray-500 mb-4">
          Personalizing based on your responses from {Object.keys(data || {}).length} assessment questions
        </div>
      </motion.div>

      {/* Horizontal scrolling reviews */}
      <motion.div 
        className="bg-gray-50 border border-gray-200 rounded-lg p-6 overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <h3 className="text-lg font-semibold text-gray-900 mb-4 text-center">
          What others are saying
        </h3>
        
        <div 
          ref={reviewContainerRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide pb-2 cursor-grab select-none"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseLeave}
        >
          {reviews.map((review) => (
            <motion.div
              key={review.id}
              className="flex-shrink-0 w-72 bg-white p-4 rounded-lg shadow-sm border border-gray-100"
              whileHover={{ y: -2, transition: { duration: 0.2 } }}
            >
              {/* Stars */}
              <div className="flex mb-2">
                {[...Array(review.rating)].map((_, i) => (
                  <span key={i} className="text-yellow-400 text-sm">⭐</span>
                ))}
              </div>
              
              {/* Review text */}
              <p className="text-gray-700 text-sm leading-relaxed mb-3">
                "{review.text}"
              </p>
              
              {/* Author */}
              <div className="flex items-center gap-3">
                <div className="text-2xl">{review.avatar}</div>
                <div>
                  <div className="font-medium text-gray-900 text-sm">{review.name}</div>
                  <div className="text-gray-500 text-xs">Age {review.age}</div>
                </div>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Scroll indicators */}
        <div className="flex justify-center mt-4 gap-2">
          {reviews.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentReview(index)}
              className={`w-2 h-2 rounded-full transition-all duration-300 ${
                index === currentReview 
                  ? 'bg-blue-500 w-4' 
                  : 'bg-gray-300 hover:bg-gray-400'
              }`}
              aria-label={`Go to review ${index + 1}`}
            />
          ))}
        </div>
      </motion.div>

      {/* Additional loading indicators */}
      {currentPhase !== 'complete' && (
        <motion.div 
          className="text-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1 }}
        >
          <p className="text-sm text-gray-500">
            This usually takes 10-15 seconds...
          </p>
        </motion.div>
      )}
    </div>
  );
};

export default PersonalizedPlanCreationStep;