"use client";

import { useState, useEffect } from 'react';
import { useMarketingFunnel } from '../../context/MarketingFunnelContext';

const CurrentIntensityStep = () => {
  const { data, actions } = useMarketingFunnel();
  const [value, setValue] = useState(typeof data.intensity === 'number' ? data.intensity : 0);

  useEffect(() => {
    setValue(typeof data.intensity === 'number' ? data.intensity : 0);
  }, [data.intensity]);

  const onContinue = () => {
    const isHigh = value >= 7;
    actions.updateData({ intensity: value, isHighIntensity: isHigh });
    actions.nextStep();
  };

  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <h2 className="text-xl font-medium text-gray-900"> How intense are you feeling?</h2>
        <p className="text-gray-500 leading-relaxed">Move the slider to show how you're feeling</p>
      </div>

      {/* Image placeholder */}
      {/* <div className="flex justify-center my-8">
        <div className="w-80 h-80 flex items-center justify-center">
        </div>
      </div> */}

      {/* Intensity slider with better styling */}
      <div className="bg-gray-50 border border-gray-200 rounded-lg p-8">
        <div className="space-y-6">
          <div className="relative">
            <input
              type="range"
              min={0}
              max={10}
              step={1}
              value={value}
              onChange={(e) => setValue(parseInt(e.target.value))}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer slider"
              style={{
                background: `linear-gradient(to right, #10b981 0%, #f59e0b ${value * 10}%, #e5e7eb ${value * 10}%, #e5e7eb 100%)`
              }}
            />
            <div className="flex justify-between text-xs text-gray-600 mt-3">
              <span className="font-medium">0 • steady</span>
              <span className="font-medium">10 • make it stop</span>
            </div>
          </div>
          
          <div className="text-center">
            <div className="text-2xl text-gray-900 mb-1">Current: {value}</div>
            <div className="text-sm text-gray-600">
              {value <= 3 ? "Feeling manageable" : value <= 6 ? "Getting challenging" : "Needs immediate support"}
            </div>
          </div>
        </div>
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

export default CurrentIntensityStep;


