"use client";

import React, { useState } from 'react';
import { useIntegratedFlow } from '../../context/IntegratedFlowContext';
import { agentSchemas } from '../../utils/agentSchemas';
import { Check, ChevronRight } from 'lucide-react';

const AgentSelector = () => {
  const { selectedAgent, actions } = useIntegratedFlow();
  const [hoveredAgent, setHoveredAgent] = useState(null);

  // Define disabled agents (temporarily disabled for future integration)
  const disabledAgents = [];

  const handleAgentSelect = (agentKey) => {
    // Prevent selection of disabled agents
    if (disabledAgents.includes(agentKey)) {
      return;
    }
    
    const agent = {
      key: agentKey,
      schema: agentSchemas[agentKey],
      ...agentSchemas[agentKey]
    };
    actions.selectAgent(agent);
  };

  const agentKeys = Object.keys(agentSchemas);

  return (
    <div className="p-4 sm:p-6 lg:p-8 flex items-center justify-center">
      <div className="w-full max-w-7xl mx-auto space-y-6">
        {/* Compact Header */}
        <div className="text-center">
   
          <h2 className="text-xl sm:text-2xl lg:text-2xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>
            Choose Your AI Companion
          </h2>
          <p className="text-sm sm:text-base max-w-xl mx-auto" style={{ color: 'var(--foreground)', opacity: 0.7 }}>
            Select the AI agent that best matches your needs
          </p>
        </div>

        {/* Responsive Agent Grid */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3 sm:gap-4">
          {agentKeys.map((agentKey) => {
            const agent = agentSchemas[agentKey];
            const isSelected = selectedAgent?.key === agentKey;
            const isHovered = hoveredAgent === agentKey;
            const isDisabled = disabledAgents.includes(agentKey);

            return (
              <div
                key={agentKey}
                className={`relative p-3 sm:p-4 bg-beige backdrop-blur-xl border-accent-right border-accent-left border-accent-top border-accent transition-all duration-300 transform cursor-pointer ${
                  isSelected && !isDisabled ? 'border-blue-500 shadow-xl ring-1 ring-blue-500/20' : 'border-white/20 shadow-lg hover:border-gray-200'
                }`}
                style={{
                 
                  backgroundColor: isDisabled 
                    ? 'rgba(255, 255, 255, 0.7)'
                    : isSelected 
                      ? 'var(--beige)'
                      : '',
                  opacity: isDisabled ? 0.6 : 1,
                  cursor: isDisabled ? 'not-allowed' : 'pointer'
                }}
                onClick={() => handleAgentSelect(agentKey)}
                onMouseEnter={() => !isDisabled && setHoveredAgent(agentKey)}
                onMouseLeave={() => setHoveredAgent(null)}
              >
                {/* Selection Indicator */}
                {isSelected && !isDisabled && (
                  <div 
                    className="absolute top-2 right-2 w-5 h-5 flex items-center justify-center"
                    style={{ backgroundColor: 'var(--border-accent)' }}
                  >
                    <Check className="w-3 h-3 text-white" />
                  </div>
                )}

                {/* Agent Icon */}
                <div className="text-xl sm:text-2xl lg:text-3xl mb-2 sm:mb-3 flex justify-center">
                  {agent.icon}
                </div>

                {/* Agent Info */}
                <div className="text-center">
                  <h3 
                    className="text-xs sm:text-sm lg:text-base font-semibold mb-1 sm:mb-2 transition-colors duration-200 line-clamp-1"
                    style={{ 
                      color: isSelected ? 'var(--border-accent)' : 'var(--foreground)'
                    }}
                  >
                    {agent.name}
                  </h3>
                  <p 
                    className="text-xs leading-relaxed transition-colors duration-200 line-clamp-2 hidden sm:block"
                    style={{ 
                      color: isSelected ? 'var(--border-accent)' : 'var(--foreground)',
                      opacity: 0.7
                    }}
                  >
                    {agent.description}
                  </p>
                </div>

                {/* Feature Count */}
                <div 
                  className="mt-2 sm:mt-3 pt-2 sm:pt-3 border-t"
                  style={{ borderTopColor: '#f3f4f6' }}
                >
                  <div className="flex items-center justify-center gap-1 text-xs" style={{ color: 'var(--foreground)', opacity: 0.6 }}>
                    <span className="hidden sm:inline">{Object.keys(agent.fields).length} options</span>
                    <span className="sm:hidden">{Object.keys(agent.fields).length}</span>
                    <ChevronRight className="w-3 h-3" />
                  </div>
                </div>

                {/* Hover Effect Overlay */}
                {isHovered && !isSelected && !isDisabled && (
                  <div 
                    className="absolute inset-0 pointer-events-none"
                    style={{ 
                      background: `linear-gradient(135deg, rgba(250, 204, 21, 0.05), rgba(31, 77, 143, 0.05))`
                    }}
                  ></div>
                )}
              </div>
            );
          })}
        </div>

        {/* {selectedAgent && (
          <div 
            className="border p-4"
            style={{ 
              background: `linear-gradient(90deg, var(--beige), var(--beige))`,
              borderColor: 'var(--border-accent)'
            }}
          >
            <div className="flex flex-col sm:flex-row items-start gap-3">
              <div className="text-2xl flex-shrink-0">{selectedAgent.icon}</div>
              <div className="flex-1 min-w-0">
                <h3 className="text-base font-bold mb-1" style={{ color: 'var(--border-accent)' }}>
                  Selected: {selectedAgent.name}
                </h3>
                <p className="text-sm mb-3 line-clamp-1" style={{ color: 'var(--border-accent)', opacity: 0.8 }}>
                  {selectedAgent.description}
                </p>
      
                <div 
                  className="p-3 border"
                  style={{ 
                    backgroundColor: 'white',
                    borderColor: 'var(--border-accent)'
                  }}
                >
                  <h4 className="text-sm font-semibold mb-2" style={{ color: 'var(--foreground)' }}>
                    {Object.entries(selectedAgent.fields).length} Configuration Options
                  </h4>
                  <div className="flex flex-wrap gap-2">
                    {Object.entries(selectedAgent.fields).slice(0, 4).map(([fieldKey, field]) => (
                      <div 
                        key={fieldKey} 
                        className="inline-flex items-center px-2 py-1 text-xs"
                        style={{ 
                          backgroundColor: 'var(--beige)',
                          border: '1px solid var(--border-accent)'
                        }}
                      >
                        <span className="font-medium" style={{ color: 'var(--border-accent)' }}>{field.label}</span>
                        {field.required && (
                          <span className="text-red-500 ml-1">*</span>
                        )}
                      </div>
                    ))}
                    {Object.entries(selectedAgent.fields).length > 4 && (
                      <div 
                        className="inline-flex items-center px-2 py-1 text-xs font-medium"
                        style={{ 
                          backgroundColor: '#f3f4f6',
                          color: 'var(--foreground)'
                        }}
                      >
                        +{Object.entries(selectedAgent.fields).length - 4} more
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

  
        {!selectedAgent && (
          <div className="text-center">
            <div 
              className="border border-dashed p-6 max-w-md mx-auto"
              style={{ 
                backgroundColor: 'rgba(255, 255, 255, 0.6)',
                borderColor: '#d1d5db'
              }}
            >
              <div className="mb-2" style={{ color: '#9ca3af' }}>
                <Sparkles className="w-8 h-8 mx-auto opacity-50" />
              </div>
              <p className="text-sm font-medium" style={{ color: '#6b7280' }}>Please select an AI agent to continue</p>
            </div>
          </div>
        )} */}
      </div>
    </div>
  );
};

export default AgentSelector;
