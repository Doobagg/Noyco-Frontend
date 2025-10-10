"use client";

import { useState } from 'react';
import { useMarketingFunnel } from '../../context/MarketingFunnelContext';

const options = [
  'Quick nudges', 'Deep talks', 'Guided audios', 'Journaling prompts', 'Mix'
];

const SupportStyleStep = () => {
  const { data, actions } = useMarketingFunnel();
  const [selected, setSelected] = useState(data.supportStyle || '');

  const onContinue = () => {
    if (!selected) return;
    actions.updateData({ supportStyle: selected });
    actions.nextStep();
  };

  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl font-medium text-gray-900">How should the AI show up for you?</h2>
        <p className="text-gray-500 leading-relaxed">Avoid mismatch disappointment - this sets your default agent</p>
      </div>

      

      <div className=" p-6">
        <div className="space-y-3">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => setSelected(opt)}
              className={`w-full border border-gray-300 px-4 py-3 text-sm font-medium transition-all duration-200  text-left ${
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

export default SupportStyleStep;


