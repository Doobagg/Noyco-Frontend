"use client";

import { useMarketingFunnel } from '../../context/MarketingFunnelContext';

const AnxietyFactStep = () => {
  const { actions } = useMarketingFunnel();

  const handleNext = () => {
    actions.nextStep();
  };

  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl font-medium text-gray-900">Did you know?</h2>
      </div>

      {/* Image placeholder */}
      <div className="flex justify-center my-8">
        <div className="w-80 h-80 flex items-center justify-center">
          <img src="./anxiety.jpg" alt="Anxiety Illustration" />
        </div>
      </div>

      {/* Fact highlight */}
      <div className="bg-purple-50 border-l-4 border-purple-400 p-6 text-left">
        <h3 className="text-2xl  text-gray-900 mb-4">
          Over <span className="text-purple-600">280 million people</span> worldwide struggle with anxiety
        </h3>
        <p className="text-gray-600 leading-relaxed">
          Our <span className="text-purple-600 font-semibold">Anxiety Agent</span> helps you breathe, calm down, and take back control.
        </p>
      </div>

      {/* Breathing guide visual */}
      <div className="flex justify-center">
        <div className="w-16 h-16 bg-purple-100  flex items-center justify-center">
          <span className="text-purple-600 text-xs font-medium">BREATHE</span>
        </div>
      </div>

      {/* Navigation positioned at bottom */}
      <div className="flex items-center justify-between mt-1 pt-2">
        <div></div> {/* Empty space for alignment */}
        
        <button
          onClick={handleNext}
          className="bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 px-8 py-3 rounded-none hover:shadow-lg transition-all duration-200 text-sm font-semibold"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default AnxietyFactStep;