// "use client";

// import { useState, useEffect } from 'react';
// import { useMarketingFunnel } from '../../context/MarketingFunnelContext';

// const MeetAgentsStep = () => {
//   const { actions } = useMarketingFunnel();
//   const [currentAgentIndex, setCurrentAgentIndex] = useState(0);
//   const [isAnimating, setIsAnimating] = useState(true);
//   const [isFlipping, setIsFlipping] = useState(false);
//   const [nextAgentIndex, setNextAgentIndex] = useState(1);

//   const agents = [
//     {
//       id: 'loneliness',
//       name: 'Loneliness Agent',
//       tagline: 'Your Companion',
//       description: 'Always here when you need someone to talk to. I provide emotional support and companionship whenever you feel alone.',
//       image: './loneliness-agent.jpg',
//       accent: 'from-purple-500 to-pink-500',
//       bgColor: 'from-purple-50 to-pink-50'
//     },
//     {
//       id: 'emotional',
//       name: 'Emotional Agent',
//       tagline: 'Your Calm Coach',
//       description: 'Helps you find peace in chaotic moments. I guide you through emotional turbulence with proven techniques.',
//       image: './emotional-agent.jpg',
//       accent: 'from-blue-500 to-purple-500',
//       bgColor: 'from-blue-50 to-purple-50'
//     },
//     {
//       id: 'therapy',
//       name: 'Mental Therapy Agent',
//       tagline: 'Your Guide',
//       description: 'Professional support for deeper healing. I offer structured therapeutic approaches for complex challenges.',
//       image: './therapy-agent.jpg',
//       accent: 'from-emerald-500 to-blue-500',
//       bgColor: 'from-emerald-50 to-blue-50'
//     },
//     {
//       id: 'anxiety',
//       name: 'Anxiety Agent',
//       tagline: 'Your Anchor',
//       description: 'Steady support when storms feel overwhelming. I provide grounding techniques and coping strategies.',
//       image: './anxiety-agent.jpg',
//       accent: 'from-orange-500 to-pink-500',
//       bgColor: 'from-orange-50 to-pink-50'
//     },
//     {
//       id: 'accountability',
//       name: 'Accountability Agent',
//       tagline: 'Your Consistency Partner',
//       description: 'Gentle nudges to keep you on track. I help you build sustainable habits and maintain progress.',
//       image: './accountability-agent.jpg',
//       accent: 'from-indigo-500 to-purple-500',
//       bgColor: 'from-indigo-50 to-purple-50'
//     }
//   ];

//   const handleNext = () => {
//     actions.nextStep();
//   };

//   // 3D Flip transition function
//   const flipToNext = (targetIndex) => {
//     setIsFlipping(true);
//     setNextAgentIndex(targetIndex);
    
//     // Complete the flip after animation
//     setTimeout(() => {
//       setCurrentAgentIndex(targetIndex);
//       setIsFlipping(false);
//     }, 400); // Half of the 800ms animation duration
//   };

//   // Auto-advance carousel with 3D flip
//   useEffect(() => {
//     if (!isAnimating || isFlipping) return;

//     const interval = setInterval(() => {
//       const nextIndex = (currentAgentIndex + 1) % agents.length;
//       flipToNext(nextIndex);
//     }, 4000); // 4 seconds per card

//     return () => clearInterval(interval);
//   }, [agents.length, isAnimating, currentAgentIndex, isFlipping]);

//   const goToAgent = (index) => {
//     if (index === currentAgentIndex || isFlipping) return;
    
//     setIsAnimating(false);
//     flipToNext(index);
    
//     setTimeout(() => setIsAnimating(true), 2000);
//   };

//   const currentAgent = agents[currentAgentIndex];
//   const nextAgent = agents[nextAgentIndex];

//   return (
//     <div className="min-h-screen bg-gradient-to-br from-gray-50 via-white to-gray-50 flex flex-col">
      
//       {/* Header */}
//       <div className="text-center pt-6 pb-6">
       
        
//         <h1 className="text-xl md:text-4xl text-gray-900 mb-4 leading-tight">
//           Meet Your Support Agents
//         </h1>
        
//         <p className="text-lg text-gray-600 max-w-2xl mx-auto leading-relaxed">
//           Each one is designed to help you in different ways on your journey
//         </p>
//       </div>

//       {/* Main Content Area - 3D Flip Container */}
//       <div className="flex-1 flex items-center justify-center px-8 py-6">
//         <div className="max-w-6xl w-full">
          
//           {/* 3D Flip Card Container */}
//           <div className="relative h-80 flex items-center justify-center perspective-1000">
            
//             {/* Card Flipper */}
//             <div 
//               className={`relative w-full max-w-5xl h-full preserve-3d transition-transform duration-800 ease-in-out ${
//                 isFlipping ? 'rotate-y-180' : 'rotate-y-0'
//               }`}
//             >
              
//               {/* Front Card - Current Agent */}
//               <div className="absolute inset-0 w-full h-full backface-hidden">
//                 <div className="w-full h-full bg-white rounded-2xl shadow-2xl overflow-hidden">
                  
//                   {/* Gradient Header */}
//                   <div className={`h-2 bg-gradient-to-r ${currentAgent.accent}`}></div>
                  
//                   <div className="grid grid-cols-4 gap-0 h-[316px]">
                    
//                     {/* Image Section */}
//                     <div className={`p-8 bg-gradient-to-br ${currentAgent.bgColor} flex items-center justify-center relative`}>
//                       {/* Background Effects */}
//                       <div className={`absolute inset-0 bg-gradient-to-br ${currentAgent.accent} opacity-5 rounded-bl-2xl`}></div>
                      
//                       <div className="relative">
//                         {/* Status Indicator */}
//                         <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse z-10"></div>
                        
//                         {/* Agent Image */}
//                         <div className="w-28 h-28 rounded-full overflow-hidden ring-6 ring-white shadow-2xl relative">
//                           <img 
//                             src={currentAgent.image} 
//                             alt={currentAgent.name}
//                             className="w-full h-full object-cover"
//                           />
//                         </div>
                        
//                         {/* Glow Effect */}
//                         <div className={`absolute -inset-4 bg-gradient-to-br ${currentAgent.accent} opacity-20 rounded-full blur-xl`}></div>
//                       </div>
//                     </div>

//                     {/* Content Section */}
//                     <div className="col-span-3 p-8 flex items-center">
//                       <div className="space-y-4 w-full">
                        
//                         <div>
//                           <h2 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
//                             {currentAgent.name}
//                           </h2>
//                           <p className={`text-base font-semibold bg-gradient-to-r ${currentAgent.accent} bg-clip-text text-transparent mb-4`}>
//                             {currentAgent.tagline}
//                           </p>
//                         </div>

//                         <p className="text-gray-600 text-base leading-relaxed">
//                           {currentAgent.description}
//                         </p>

                       
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>

//               {/* Back Card - Next Agent */}
//               <div className="absolute inset-0 w-full h-full backface-hidden rotate-y-180">
//                 <div className="w-full h-full bg-white rounded-2xl shadow-2xl overflow-hidden">
                  
//                   {/* Gradient Header */}
//                   <div className={`h-2 bg-gradient-to-r ${nextAgent.accent}`}></div>
                  
//                   <div className="grid grid-cols-4 gap-0 h-[316px]">
                    
//                     {/* Image Section */}
//                     <div className={`p-8 bg-gradient-to-br ${nextAgent.bgColor} flex items-center justify-center relative`}>
//                       {/* Background Effects */}
//                       <div className={`absolute inset-0 bg-gradient-to-br ${nextAgent.accent} opacity-5 rounded-bl-2xl`}></div>
                      
//                       <div className="relative">
//                         {/* Status Indicator */}
//                         <div className="absolute -top-2 -right-2 w-4 h-4 bg-green-500 rounded-full border-2 border-white animate-pulse z-10"></div>
                        
//                         {/* Agent Image */}
//                         <div className="w-28 h-28 rounded-full overflow-hidden ring-6 ring-white shadow-2xl relative">
//                           <img 
//                             src={nextAgent.image} 
//                             alt={nextAgent.name}
//                             className="w-full h-full object-cover"
//                           />
//                         </div>
                        
//                         {/* Glow Effect */}
//                         <div className={`absolute -inset-4 bg-gradient-to-br ${nextAgent.accent} opacity-20 rounded-full blur-xl`}></div>
//                       </div>
//                     </div>

//                     {/* Content Section */}
//                     <div className="col-span-3 p-8 flex items-center">
//                       <div className="space-y-4 w-full">
                        
//                         <div>
//                           <h2 className="text-2xl font-bold text-gray-900 mb-2 leading-tight">
//                             {nextAgent.name}
//                           </h2>
//                           <p className={`text-base font-semibold bg-gradient-to-r ${nextAgent.accent} bg-clip-text text-transparent mb-4`}>
//                             {nextAgent.tagline}
//                           </p>
//                         </div>

//                         <p className="text-gray-600 text-base leading-relaxed">
//                           {nextAgent.description}
//                         </p>

//                         {/* Agent Features */}
//                         <div className="flex items-center space-x-6 pt-2">
//                           <div className="flex items-center space-x-2">
//                             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
//                             <span className="text-sm text-gray-600">24/7 Available</span>
//                           </div>
//                           <div className="flex items-center space-x-2">
//                             <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
//                             <span className="text-sm text-gray-600">AI Powered</span>
//                           </div>
//                           <div className="flex items-center space-x-2">
//                             <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
//                             <span className="text-sm text-gray-600">Personalized</span>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   </div>
//                 </div>
//               </div>
//             </div>
//           </div>

//           {/* Agent Navigation Dots */}
//           <div className="flex justify-center items-center space-x-3 mt-8">
//             {agents.map((agent, index) => (
//               <button
//                 key={agent.id}
//                 onClick={() => goToAgent(index)}
//                 disabled={isFlipping}
//                 className={`relative transition-all duration-300 ${
//                   index === currentAgentIndex 
//                     ? 'w-4 h-4' 
//                     : 'w-3 h-3 hover:w-4 hover:h-4'
//                 } ${isFlipping ? 'cursor-wait' : 'cursor-pointer'}`}
//               >
//                 <div className={`w-full h-full rounded-full transition-all duration-300 ${
//                   index === currentAgentIndex 
//                     ? `bg-gradient-to-r ${agents[index].accent} shadow-lg` 
//                     : 'bg-gray-300 hover:bg-gray-400'
//                 }`}></div>
                
//                 {index === currentAgentIndex && !isFlipping && (
//                   <div className={`absolute inset-0 rounded-full bg-gradient-to-r ${agents[index].accent} animate-ping opacity-75`}></div>
//                 )}
//               </button>
//             ))}
//           </div>

//           {/* Progress Indicator */}
//           <div className="flex justify-center mt-4">
//             <div className="text-sm text-gray-500">
//               {currentAgentIndex + 1} of {agents.length} agents
//             </div>
//           </div>
//         </div>
//       </div>

//       {/* Bottom Section */}
//       <div className="text-center pb-12 pt-4">
        
//         {/* Team Preview */}
//         <div className="inline-flex items-center space-x-4 bg-white rounded-full px-8 py-4 shadow mb-8">
//           <div className="flex -space-x-2">
//             {agents.slice(0, 3).map((agent) => (
//               <div
//                 key={agent.id}
//                 className="w-8 h-8 rounded-full overflow-hidden border-2 border-white shadow-md"
//               >
//                 <img 
//                   src={agent.image} 
//                   alt={agent.name}
//                   className="w-full h-full object-cover"
//                 />
//               </div>
//             ))}
//             <div className="w-8 h-8 rounded-full border-2 border-white flex items-center justify-center text-xs text-gray-600">
//               +2
//             </div>
//           </div>
//           <span className="text-sm text-gray-600 font-medium">
//             Your complete support team is ready
//           </span>
//         </div>

//         {/* CTA Button */}
//         <button
//           onClick={handleNext}
//           className="inline-flex items-center px-12 py-4 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 rounded-full font-bold text-lg hover:shadow"
//         >
//           Continue
//         </button>
//       </div>

//       {/* Custom CSS for 3D Flip Animation */}
//       <style jsx>{`
//         .perspective-1000 {
//           perspective: 1000px;
//         }
        
//         .preserve-3d {
//           transform-style: preserve-3d;
//         }
        
//         .backface-hidden {
//           backface-visibility: hidden;
//           -webkit-backface-visibility: hidden;
//         }
        
//         .rotate-y-0 {
//           transform: rotateY(0deg);
//         }
        
//         .rotate-y-180 {
//           transform: rotateY(180deg);
//         }
//       `}</style>
//     </div>
//   );
// };

// export default MeetAgentsStep;















"use client";

import { useState } from 'react';
import { useMarketingFunnel } from '../../context/MarketingFunnelContext';
import { Heart, Brain, UserCheck, Shield, Target } from 'lucide-react';

const MeetAgentsStep = () => {
  // Re-add the useMarketingFunnel hook
  const { actions } = useMarketingFunnel();
  const [selectedAgent, setSelectedAgent] = useState(null);

  const agents = [
    {
      id: 'loneliness',
      name: 'Loneliness Agent',
      description: 'Always here when you need someone to talk to.',
      icon: Heart,
      accent: 'from-purple-500 to-pink-500',
    
      
    },
    {
      id: 'emotional',
      name: 'Emotional Agent',
      description: 'Helps you find peace in chaotic moments.',
      icon: Brain,
      accent: 'from-blue-500 to-purple-500',
      
    },
    {
      id: 'therapy',
      name: 'Mental Therapy Agent',
      description: 'Professional support for deeper healing.',
      icon: UserCheck,
      accent: 'from-emerald-500 to-blue-500',
     
    },
    {
      id: 'anxiety',
      name: 'Anxiety Agent',
      description: 'Steady support when storms feel overwhelming.',
      icon: Shield,
      accent: 'from-orange-500 to-pink-500',
    
    },
    {
      id: 'accountability',
      name: 'Accountability Agent',
      description: 'Gentle nudges to keep you on track.',
      icon: Target,
      accent: 'from-indigo-500 to-purple-500',
    
    }
  ];

  const handleNext = () => {
    actions.nextStep();
  };

  return (
    <div className="h-screen bg-gray-50 flex flex-col py-6">
      <div className="max-w-5xl mx-auto px-6 flex-1 flex flex-col">
        
        {/* Header */}
        <div className="text-center mb-6">
          <h1 className="text-2xl  text-gray-900 mb-2">
            Meet Your Support Agents
          </h1>
          <p className="text-gray-600 text-base">
            Each one is designed to help you in different ways on your journey
          </p>
        </div>

        {/* Agents List - One per row */}
        <div className="space-y-3 mb-4">
          {agents.map((agent) => (
            <div
              key={agent.id}
              className="bg-white  border border-gray-200 p-4 hover:shadow-md transition-shadow"
            >
              <div className="flex items-center space-x-4">
                {/* Agent Icon */}
                <div className="flex-shrink-0">
                  <div className={`w-12 h-12 rounded-full ${agent.bgColor} border-2 border-gray-100 flex items-center justify-center`}>
                    <agent.icon 
                      className={`w-6 h-6 ${agent.iconColor}`}
                    />
                  </div>
                </div>

                {/* Agent Info */}
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1 truncate">
                    {agent.name}
                  </h3>
                  <p className="text-gray-600 text-sm leading-relaxed">
                    {agent.description}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Bottom Section */}
        <div className="text-center">
          <div className="mb-4">
            <div className="inline-flex items-center space-x-3 bg-white rounded-lg px-4 py-2 border border-gray-200">
              <div className="flex -space-x-1">
                {agents.slice(0, 3).map((agent) => (
                  <div
                    key={agent.id}
                    className={`w-5 h-5 rounded-full ${agent.bgColor} border-2 border-white flex items-center justify-center`}
                  >
                    <agent.icon 
                      className={`w-3 h-3 ${agent.iconColor}`}
                    />
                  </div>
                ))}
                <div className="w-5 h-5 rounded-full bg-gray-100 border-2 border-white flex items-center justify-center">
                  <span className="text-xs text-gray-600">+2</span>
                </div>
              </div>
              <span className="text-sm text-gray-600">
                {agents.length} agents ready to help
              </span>
            </div>
          </div>

          <button
            onClick={handleNext}
            className="px-8 py-3 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 rounded-lg font-semibold hover:shadow-md transition-shadow"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeetAgentsStep;