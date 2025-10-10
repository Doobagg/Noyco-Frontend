"use client";

import { useState } from 'react';
import { useMarketingFunnel } from '../../context/MarketingFunnelContext';

const options = [
  'Racing thoughts', 'Tight chest', 'Restlessness', 'Nausea', 'Dread', 'Irritability', "Can't sleep"
];

const SymptomPatternStep = () => {
  const { data, actions } = useMarketingFunnel();
  const [selected, setSelected] = useState(Array.isArray(data.symptomPatterns) ? data.symptomPatterns : []);

  const toggle = (opt) => {
    const exists = selected.includes(opt);
    let next = exists ? selected.filter(o => o !== opt) : [...selected, opt];
    if (next.length > 2) next = next.slice(1); // keep only last two
    setSelected(next);
  };

  const onContinue = () => {
    if (selected.length === 0) return;
    actions.updateData({ symptomPatterns: selected });
    actions.nextStep();
  };

  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl font-medium text-gray-900">What hits you most when it shows up?</h2>
        <p className="text-gray-500 leading-relaxed">Choose up to two patterns that drive scripts and safety checks</p>
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
              onClick={() => toggle(opt)}
              className={`border border-gray-300 px-4 py-3 text-sm font-medium transition-all duration-200  ${
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
          <div className="mt-4 text-sm text-gray-600">
            Selected: {selected.length}/2
          </div>
        )}
      </div>

      {/* Navigation positioned at bottom */}
      <div className="flex items-center justify-between mt-8 pt-4">
        <div></div> {/* Empty space for alignment */}
        
        <button
          onClick={onContinue}
          disabled={selected.length === 0}
          className={`px-8 py-3 text-sm font-semibold transition-all duration-200 rounded-none ${
            selected.length > 0 
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

export default SymptomPatternStep;


