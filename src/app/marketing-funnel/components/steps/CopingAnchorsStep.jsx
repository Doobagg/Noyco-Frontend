"use client";

import { useState } from 'react';
import { useMarketingFunnel } from '../../context/MarketingFunnelContext';

const options = [
  'Music', 'Walk', 'Shower', 'Pet time', 'Call someone', 'Tea/water', 'Journaling', 'Prayer', 'Breathwork'
];

const CopingAnchorsStep = () => {
  const { data, actions } = useMarketingFunnel();
  const [selected, setSelected] = useState(Array.isArray(data.copingAnchors) ? data.copingAnchors : []);

  const toggle = (opt) => {
    let next = selected.includes(opt) ? selected.filter(o => o !== opt) : [...selected, opt];
    if (next.length > 3) next = next.slice(1); // keep only last three
    setSelected(next);
  };

  const onContinue = () => {
    actions.updateData({ copingAnchors: selected });
    actions.nextStep();
  };

  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl font-medium text-gray-900">What actually helps you reset IRL?</h2>
        <p className="text-gray-500 leading-relaxed">We weave these into prompts - select up to three</p>
      </div>

      {/* Image placeholder */}
      <div className="flex justify-center my-8">
        <div className="w-80 h-80 flex items-center justify-center">
        <img src="./interests.jpg" alt="" />
        </div>
      </div>

      <div className="p-6">
        <div className="grid grid-cols-3 gap-3">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => toggle(opt)}
              className={`border border-gray-300 px-3 py-2 text-sm font-medium transition-all duration-200  ${
                selected.includes(opt) 
                  ? 'bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 border-transparent shadow-sm' 
                  : 'bg-white text-gray-700 hover:bg-gray-50 hover:shadow-sm'
              }`}
            >
              {opt}
            </button>
          ))}
        </div>
        
        {selected.length > 0 && (
          <div className="mt-4 text-sm text-green-700">
            Selected: {selected.length}/3
          </div>
        )}
      </div>

      {/* Navigation positioned at bottom */}
      <div className="flex items-center justify-between mt-2 pt-1">
        <div></div> {/* Empty space for alignment */}
        
        <button
          onClick={onContinue}
          className="bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 px-8 py-3 rounded-none hover:shadow-lg transition-all duration-200 text-sm font-semibold"
        >
          Continue
        </button>
      </div>
    </div>
  );
};

export default CopingAnchorsStep;


