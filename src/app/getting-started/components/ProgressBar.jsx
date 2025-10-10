"use client";

import { motion } from 'framer-motion';
import { useMarketingFunnel } from '../context/MarketingFunnelContext';

const ProgressBar = () => {
  const { currentStep, totalSteps } = useMarketingFunnel();
  
  // Calculate progress percentage based on current step out of total steps
  const getProgress = () => {
    if (currentStep <= 1) return 0;
    return ((currentStep - 1) / (totalSteps - 1)) * 100;
  };

  const progress = getProgress();

  return (
    <div className="w-full">
      <div className="bg-gray-200 rounded-full h-1 overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] rounded-full"
          initial={{ width: "0%" }}
          animate={{ width: `${progress}%` }}
          transition={{
            duration: 0.3,
            ease: [0.4, 0, 0.2, 1]
          }}
        />
      </div>
      
      {/* Progress text */}
      <div className="text-center mt-2">
        <span className="text-gray-500 text-xs font-medium">
          Step {currentStep > 1 ? currentStep - 1 : 1} of {totalSteps - 1}
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;
