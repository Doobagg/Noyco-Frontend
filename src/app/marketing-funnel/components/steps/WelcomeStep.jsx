"use client";

import { motion } from 'framer-motion';
import { useMarketingFunnel } from '../../context/MarketingFunnelContext';

const WelcomeStep = () => {
  const { actions } = useMarketingFunnel();

  const handleStart = () => {
    actions.nextStep();
  };

  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <h1 className="text-3xl font-light text-gray-900">Your Mind Deserves Care</h1>
        <p className="text-gray-500 text-lg leading-relaxed">Take our 2-minute wellness check and meet your 5 support agents.</p>
      </div>
      
      {/* SVG/Image Placeholder */}
      <div className="flex justify-center my-8">
          <img src="./mentaltherapy.jpg" width={300} height={300} alt="" />
      </div>

      {/* Navigation positioned at bottom */}
      <div className="flex items-center justify-center mt-12 pt-8">
        <div></div> {/* Empty space for alignment */}
        
        <button
          onClick={handleStart}
          className="bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 px-8 py-3 rounded-none hover:shadow-lg transition-all duration-200 text-sm font-semibold"
        >
          Start My Journey
        </button>
      </div>

      {/* Trust indicator */}
      <p className="text-gray-400 text-sm mt-6">
        Trusted by thousands seeking better mental wellness
      </p>
    </div>
  );
};

export default WelcomeStep;
