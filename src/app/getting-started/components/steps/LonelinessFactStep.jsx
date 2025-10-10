"use client";

import { motion } from 'framer-motion';
import { useMarketingFunnel } from '../../context/MarketingFunnelContext';

const LonelinessFactStep = () => {
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
        <div className="w-70 h-70 bg-gray-100 rounded-lg flex items-center justify-center">
          {/* <span className="text-gray-400 text-sm">Loneliness Illustration</span> */}
          <img src="./lonely.jpg" alt="" />
        </div>
      </div>

      <div className="bg-gradient-to-br from-red-50 via-orange-50 to-amber-50 border border-red-100 rounded-xl p-6 text-left shadow-sm">
  {/* Main headline with impact */}
  <div className="mb-5">
    <h3 className="text-2xl font-medium text-gray-900 mb-2 leading-tight">
      Loneliness is as harmful as smoking <span className="text-red-600 font-semibold">15 cigarettes daily</span>
    </h3>
    <p className="text-gray-600 text-base">
      A critical public health issue affecting millions worldwide
    </p>
  </div>

  {/* Health risks grid */}
  <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-5">
    <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 text-center">
      <div className="text-lg font-semibold text-red-600 mb-1">+29%</div>
      <div className="text-xs text-gray-600">heart disease risk</div>
    </div>
    <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 text-center">
      <div className="text-lg font-semibold text-orange-600 mb-1">+32%</div>
      <div className="text-xs text-gray-600">stroke risk</div>
    </div>
    <div className="bg-white/60 backdrop-blur-sm rounded-lg p-3 text-center">
      <div className="text-lg font-semibold text-amber-600 mb-1">Higher</div>
      <div className="text-xs text-gray-600">premature death</div>
    </div>
  </div>

  {/* Separator */}
  <div className="w-16 h-px bg-gradient-to-r from-red-200 via-orange-200 to-amber-200 mb-4"></div>

  {/* Solution statement */}
  <div className="space-y-2">
    <p className="text-gray-700 leading-relaxed text-sm">
      <span className="text-red-600 font-medium">1 in 3 people</span> experience chronic loneliness, even when surrounded by others.
    </p>
    <p className="text-gray-600 leading-relaxed text-sm">
      That's why we created a safe space to practice meaningful connections and build genuine social confidence.
    </p>
  </div>

  {/* Warning icon */}
  <div className="absolute top-4 right-4 opacity-20">
    <svg className="w-6 h-6 text-red-500" fill="currentColor" viewBox="0 0 24 24">
      <path d="M12 2L13.09 8.26L22 9L17 14L18.18 22L12 19L5.82 22L7 14L2 9L10.91 8.26L12 2Z"/>
    </svg>
  </div>
</div>
      {/* Navigation positioned at bottom */}
      <div className="flex items-center justify-between mt-8 pt-4">
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

export default LonelinessFactStep;









