"use client";

import { useMarketingFunnel } from '../../context/MarketingFunnelContext';

const PersonalizationStep = () => {
  const { actions } = useMarketingFunnel();

  const handlePersonalize = () => {
    actions.updateData({ wantsPersonalization: true });
    setTimeout(() => {
      actions.nextStep();
    }, 300);
  };

  const handleSkip = () => {
    actions.updateData({ wantsPersonalization: false });
    actions.nextStep();
  };

  return (
    <div className="text-center">
      <div className="space-y-4">
        <h2 className="text-xl font-medium text-gray-900">
          Would you like us to personalize your journey based on your answers?
        </h2>
        <p className="text-gray-500 leading-relaxed">
          We'll create a tailored experience just for you, using everything you've shared to make your support agents more helpful and understanding.
        </p>
      </div>

      {/* Image placeholder */}
      <div className="flex justify-center my-8">
          <img src="./personalization.png" alt="Personalization Illustration" />
      </div>

      {/* Personalization preview */}
      <div className="bg-blue-50 border border-blue-200 rounded-lg p-6">
        <div className="flex justify-center space-x-4 mb-3">
          <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
            <span className="text-lg">🤖</span>
          </div>
          <div className="w-8 h-8 bg-purple-200 rounded-full flex items-center justify-center">
            <span className="text-lg">👩‍💻</span>
          </div>
          <div className="w-8 h-8 bg-pink-200 rounded-full flex items-center justify-center">
            <span className="text-lg">🧠</span>
          </div>
          <div className="w-8 h-8 bg-blue-200 rounded-full flex items-center justify-center">
            <span className="text-lg">⚡</span>
          </div>
          <div className="w-8 h-8 bg-pink-200 rounded-full flex items-center justify-center">
            <span className="text-lg">💡</span>
          </div>
        </div>
        <p className="text-gray-700 text-sm">
          Your personalized support team is being prepared...
        </p>
      </div>

      {/* Navigation positioned at bottom */}
      <div className="flex items-center justify-between mt-12 pt-8">
        <button 
          onClick={handleSkip}
          className="text-gray-400 hover:text-gray-600 transition-colors text-sm font-medium"
        >
          Skip for now
        </button>
        
        <button
          onClick={handlePersonalize}
          className="bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 px-8 py-3 rounded-none hover:shadow-lg transition-all duration-200 text-sm font-semibold"
        >
          Yes, personalize for me
        </button>
      </div>

      <p className="text-gray-400 text-xs mt-4">
        This will make your experience uniquely yours
      </p>
    </div>
  );
};

export default PersonalizationStep;