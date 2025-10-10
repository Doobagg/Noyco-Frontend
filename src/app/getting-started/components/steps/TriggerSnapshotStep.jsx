"use client";

import { useState, useEffect } from 'react';
import { useMarketingFunnel } from '../../context/MarketingFunnelContext';

const options = [
  'Deadlines', 'Conflict', 'Crowds', 'Social media', 'Health worries', 'Nighttime', 'Unknown'
];

const TriggerSnapshotStep = () => {
  const { data, actions } = useMarketingFunnel();
  const [selected, setSelected] = useState(Array.isArray(data.triggers) ? data.triggers : []);

  // Typewriter effect for the fact
  const factText = "Identifying your triggers reduces anxiety episodes by 68% according to clinical research.";
  const [displayedText, setDisplayedText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (currentIndex < factText.length) {
      const timer = setTimeout(() => {
        setDisplayedText(prev => prev + factText[currentIndex]);
        setCurrentIndex(prev => prev + 1);
      }, 50); // Adjust speed here (lower = faster)
      
      return () => clearTimeout(timer);
    }
  }, [currentIndex, factText]);

  const toggle = (opt) => {
    setSelected((prev) => prev.includes(opt) ? prev.filter(o => o !== opt) : [...prev, opt]);
  };

  const onContinue = () => {
    actions.updateData({ triggers: selected });
    actions.nextStep();
  };

  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl font-medium text-gray-900">What tends to trigger it?</h2>
        
        {/* Animated fact box */}
        <div className="mx-auto max-w-md">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4 shadow-sm">
            <p className="text-sm text-yellow-800 leading-relaxed">
              {displayedText}
              {currentIndex < factText.length && (
                <span className="animate-pulse">|</span>
              )}
            </p>
          </div>
        </div>
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
              className={`border border-gray-300 px-4 py-3 text-sm font-medium transition-all duration-20 ${
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
          <div className="mt-4 text-sm text-orange-700">
            {selected.length} triggers selected
          </div>
        )}
      </div>

      {/* Navigation positioned at bottom */}
      <div className="flex items-center justify-between mt-8 pt-4">
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

export default TriggerSnapshotStep;


