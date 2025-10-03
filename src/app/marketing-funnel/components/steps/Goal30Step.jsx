"use client";

import { useState, useEffect } from 'react';
import { useMarketingFunnel } from '../../context/MarketingFunnelContext';

const options = [
  'Reduce daily anxiety',
  'Sleep better',
  'Handle conflicts calmer',
  'Stop panic spirals',
  'Feel in control'
];

const Goal30Step = () => {
  const { data, actions } = useMarketingFunnel();
  const [selected, setSelected] = useState(data.goal30 || '');
  
  // Typewriter effect for the fact
  const factText = "Studies show that focusing on one specific goal increases success rates by 73%.";
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

  const onContinue = () => {
    if (!selected) return;
    actions.updateData({ goal30: selected });
    actions.nextStep();
  };

  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl font-medium text-gray-900">If we nailed one outcome in 30 days, what would it be?</h2>
        
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

      <div className=" p-6">
        <div className="space-y-3">
          {options.map((opt) => (
            <button
              key={opt}
              onClick={() => setSelected(opt)}
              className={`w-full border border-gray-300 px-4 py-3 text-sm font-medium transition-all duration-200 rounded-lg text-left ${
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

export default Goal30Step;


