'use client';
import { useState, useEffect } from 'react';
import { MessageCircle} from 'lucide-react';
import { useMetrics } from '../../../../../store/hooks';
import ConversationList from './ConversationList';
import ConversationDetail from './ConversationDetail';

export default function ConversationInsights({ onConversationSelect }) {
  const { agentTypes, fetchAgentTypes } = useMetrics();
  const [selectedTimeframe, setSelectedTimeframe] = useState('7d');
  const [selectedAgentType, setSelectedAgentType] = useState('');
  const [selectedConversation, setSelectedConversation] = useState(null);

  const timeframes = [
    { value: '24h', label: '24 Hours' },
    { value: '7d', label: '7 Days' },
    { value: '30d', label: '30 Days' },
    { value: '90d', label: '3 Months' }
  ];

  useEffect(() => {
    fetchAgentTypes();
  }, []);

  const handleAgentTypeChange = (e) => {
    const agentType = e.target.value;
    setSelectedAgentType(agentType);
    setSelectedConversation(null); // Clear selected conversation when switching agent types
  };

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation);
    if (onConversationSelect) {
      onConversationSelect(conversation);
    }
  };

  const handleCloseConversation = () => {
    setSelectedConversation(null);
  };

  const getAgentTypeDisplayName = (agentType) => {
    const names = {
      'loneliness': 'Loneliness Agent',
      'accountability': 'Accountability Agent', 
      'mental_therapist': 'Mental Therapist',
      'nutrition': 'Nutrition Agent',
      'medication': 'Medication Agent'
    };
    return names[agentType] || agentType;
  };

  return (
    <div className="space-y-1 md:space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-1 md:gap-3">
        <h2 className="text-xl font-semibold text-gray-900">Conversation Insights</h2>

        {/* Right side wrapper */}
        <div className="flex items-center gap-4 md:gap-3 flex-wrap sm:flex-nowrap">
          <select 
            className="px-2 md:px-3 py-1 text-sm bg-beige font-medium  transition-colors text-gray-600 hover:text-gray-900 border-accent border-accent-top border-accent-left border-accent-right focus:bg-gradient-to-r focus:from-[#E6D3E7] focus:via-[#F6D9D5] focus:to-[#D6E3EC] focus:text-gray-800"
            value={selectedAgentType}
            onChange={handleAgentTypeChange}
          >
            <option value="">All Agents</option>
            {agentTypes.map((agentType) => (
              <option key={agentType.agent_type} value={agentType.agent_type}>
                {getAgentTypeDisplayName(agentType.agent_type)} ({agentType.count})
              </option>
            ))}
          </select>

          <div className="flex bg-beige border-accent border-accent-top border-accent-left border-accent-right p-1 overflow-x-auto no-scrollbar rounded">
            {timeframes.map((timeframe) => (
              <button
                key={timeframe.value}
                onClick={() => setSelectedTimeframe(timeframe.value)}
                className={`px-1.5 md:px-3 py-1 text-sm font-medium whitespace-nowrap transition-colors ${
                  selectedTimeframe === timeframe.value
                    ? 'bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-900 shadow-sm'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
              >
                {timeframe.label}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 md:gap-6 sm:h-[calc(100vh-200px)]">
        {/* Left: Conversation List */}
        <div className="overflow-hidden min-w-0">
          <ConversationList 
            selectedAgentType={selectedAgentType}
            onConversationSelect={handleConversationSelect}
          />
        </div>

        {/* Right: Conversation Detail */}
        <div className="bg-beige border-accent border-accent-top border-accent-left border-accent-right overflow-hidden min-w-0">
          {selectedConversation ? (
            <ConversationDetail 
              conversation={selectedConversation}
              onClose={handleCloseConversation}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-gray-500">
              <div className="text-center">
                <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <h3 className="text-lg font-medium mb-2">No conversation selected</h3>
                <p>Select a conversation from the left panel to view details</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
