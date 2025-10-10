"use client";

import { useMarketingFunnel } from '../../context/MarketingFunnelContext';

const ConsistencyFactStep = () => {
  const { actions, currentStep } = useMarketingFunnel();
  
  console.log('ConsistencyFactStep rendered, current step:', currentStep);

  const handleNext = () => {
    actions.nextStep();
  };

  const handleTrySample = (e) => {
    e.preventDefault();
    e.stopPropagation();
    console.log('Try sample clicked - current step:', currentStep, 'jumping to step 9');
    
    // Use the direct setStep method without timeout
    actions.setStep(9);
    actions.updateData({ wantsVoiceDemo: true });
  };

  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl font-medium text-gray-900">Did you know?</h2>
      </div>

      {/* Image placeholder */}
      <div className="flex justify-center my-8">
          <img src="./consistency.png" alt="Consistency Illustration" />
      </div>

      {/* Fact highlight */}
      <div className="bg-green-50 border-l-4 border-green-400 p-6 text-left">
        <h3 className="text-2xl font-bold text-gray-900 mb-4">
          Tracking your mental health daily improves recovery by <span className="text-green-600">60%</span>
        </h3>
        <p className="text-gray-600 leading-relaxed">
          That's why our <span className="text-green-600 font-semibold">Accountability Agent</span> gives gentle nudges every day.
        </p>
      </div>

      {/* Visual progress indicator */}
      <div className="flex justify-center space-x-2">
        {[...Array(7)].map((_, i) => (
          <div
            key={i}
            className="w-6 h-6 bg-green-100 rounded-full flex items-center justify-center border border-green-200"
          >
            <div className="w-2 h-2 bg-green-500 rounded-full" />
          </div>
        ))}
      </div>

      <div className="text-gray-500 text-sm">
        Small daily steps → Big improvements
      </div>

      {/* Navigation positioned at bottom */}
      <div className="flex items-center justify-between mt-2 pt-3">
        <div></div> {/* Empty space for alignment */}
        
        <div className="flex gap-4">
          <button
            onClick={handleNext}
            className="bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 px-8 py-3 rounded-none hover:shadow-lg transition-all duration-200 text-sm font-semibold"
          >
            Continue
          </button>
          
        
        </div>
      </div>
    </div>
  );
};

export default ConsistencyFactStep;