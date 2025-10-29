"use client";

import { useMarketingFunnel } from '../../context/MarketingFunnelContext';
import { Heart, Brain, UserCheck, Shield, Target } from 'lucide-react';

const MeetAgentsStep = () => {
  // Re-add the useMarketingFunnel hook
  const { actions } = useMarketingFunnel();

  const agents = [
    {
      id: 'loneliness',
      name: 'Loneliness Agent',
      description: 'Always here when you need someone to talk to.',
      icon: Heart,
      accent: 'from-purple-500 to-pink-500',
      bgColor: 'bg-gradient-to-br from-purple-100 to-pink-100',
      iconColor: 'text-purple-600',
    },
    {
      id: 'emotional',
      name: 'Emotional Agent',
      description: 'Helps you find peace in chaotic moments.',
      icon: Brain,
      accent: 'from-blue-500 to-purple-500',
      bgColor: 'bg-gradient-to-br from-blue-100 to-purple-100',
      iconColor: 'text-blue-600',
    },
    {
      id: 'therapy',
      name: 'Mental Therapy Agent',
      description: 'Professional support for deeper healing.',
      icon: UserCheck,
      accent: 'from-emerald-500 to-blue-500',
      bgColor: 'bg-gradient-to-br from-emerald-100 to-blue-100',
      iconColor: 'text-emerald-600',
    },
    {
      id: 'anxiety',
      name: 'Anxiety Agent',
      description: 'Steady support when storms feel overwhelming.',
      icon: Shield,
      accent: 'from-orange-500 to-pink-500',
      bgColor: 'bg-gradient-to-br from-orange-100 to-pink-100',
      iconColor: 'text-orange-600',
    },
    {
      id: 'accountability',
      name: 'Accountability Agent',
      description: 'Gentle nudges to keep you on track.',
      icon: Target,
      accent: 'from-indigo-500 to-purple-500',
      bgColor: 'bg-gradient-to-br from-indigo-100 to-purple-100',
      iconColor: 'text-indigo-600',
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
              className="bg-white  border border-gray-200 p-4"
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
            <div className="inline-flex items-center space-x-3 bg-white  px-4 py-2 border border-gray-200">
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
            className="px-8 py-3 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800  font-semibold hover:shadow-md transition-shadow"
          >
            Continue
          </button>
        </div>
      </div>
    </div>
  );
};

export default MeetAgentsStep;