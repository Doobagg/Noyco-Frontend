"use client";

import { useState } from 'react';
import { useMarketingFunnel } from '../../context/MarketingFunnelContext';

const options = [
  'Anxiety', 'Panic', 'Work stress', 'Relationships', 'Sleep', 'Low mood', 'Focus', 'Other'
];

const PrimaryTopicStep = () => {
  const { data, actions, currentStep } = useMarketingFunnel();
  const [selected, setSelected] = useState(data.primaryTopic || '');
  
  console.log('PrimaryTopicStep rendered, current step:', currentStep);

  const onContinue = () => {
    if (!selected) return;
    actions.updateData({ primaryTopic: selected });
    actions.nextStep(); // Always go to next step sequentially
  };

  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl font-medium text-gray-900">What do you want help with first?</h2>
        <p className="text-gray-500 leading-relaxed">Pick one to set your baseline protocol</p>
      </div>

      {/* Image placeholder */}
      {/* <div className="flex justify-center my-8">
        <div className="w-80 h-80 flex items-center justify-center">
        </div>
      </div> */}

      <div className="p-6">
        <div className="grid grid-cols-2 gap-4">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => setSelected(opt)}
              className={`border border-gray-300 px-4 py-3 text-sm font-medium transition-all duration-200  ${
                selected === opt 
                  ? 'bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 border-transparent shadow-sm' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-sm'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
        
        
      </div>

      {/* Navigation positioned at bottom */}
      <div className="flex items-center justify-between mt-8 pt-4">
        <div></div> {/* Empty space for alignment */}
        
        <button
          onClick={onContinue}
          disabled={!selected}
          className={`px-8 py-3 text-sm font-semibold transition-all duration-200 rounded-none ${
            selected 
              ? 'bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 hover:shadow-lg' 
              : 'bg-gray-200 text-gray-500 cursor-not-allowed'
          }`}
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default PrimaryTopicStep;


