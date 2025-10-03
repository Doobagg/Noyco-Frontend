'use client';
import { useState, useEffect } from 'react';
import { MessageCircle, Clock, TrendingUp, Users, ChevronDown, ChevronRight } from 'lucide-react';
import { useMetrics } from '../../../../../store/hooks';
import { useGoals } from '../../../../../store/hooks';

export default function ConversationList({ selectedAgentType, onConversationSelect }) {
  const { agentTypes, conversations, analytics, loading, error, fetchConversations, fetchAnalytics } = useMetrics();
  const { goals, fetchGoalsByAgent } = useGoals();
  const [expandedGroups, setExpandedGroups] = useState(new Set());
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [goalTitleMap, setGoalTitleMap] = useState({});

  // Update data when agent type changes
  useEffect(() => {
    if (selectedAgentType) {
      fetchConversations(selectedAgentType);
      fetchAnalytics(selectedAgentType);
      // Fetch goals for this agent type to get title mapping
      fetchGoalsByAgent(selectedAgentType);
    }
  }, [selectedAgentType]);

  // Create mapping from goal_id to goal title when goals change
  useEffect(() => {
    if (selectedAgentType && goals[selectedAgentType]) {
      const mapping = {};
      goals[selectedAgentType].forEach(goal => {
        if (goal.goal_id && goal.title) {
          mapping[goal.goal_id] = goal.title;
        }
      });
      setGoalTitleMap(mapping);
    }
  }, [goals, selectedAgentType]);

  // Helper function to get goal title from agent_instance_id
  const getGoalTitle = (agentInstanceId, group = null) => {
    // First check if group has goal_title directly from backend
    if (group && group.goal_title) {
      return group.goal_title;
    }
    // Fall back to mapping from goals
    return goalTitleMap[agentInstanceId] || agentInstanceId;
  };

  const toggleGroup = (agentInstanceId) => {
    const newExpanded = new Set(expandedGroups);
    if (newExpanded.has(agentInstanceId)) {
      newExpanded.delete(agentInstanceId);
    } else {
      // Close all other groups and open this one
      newExpanded.clear();
      newExpanded.add(agentInstanceId);
    }
    setExpandedGroups(newExpanded);
  };

  const handleConversationSelect = (conversation) => {
    setSelectedConversation(conversation.conversation_id);
    onConversationSelect(conversation);
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 "></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
        <p className="text-red-600">Error loading conversations: {error}</p>
      </div>
    );
  }

  if (!conversations || conversations.conversation_groups.length === 0) {
    return (
      <div className="text-center p-8 text-gray-500">
        <MessageCircle className="w-12 h-12 mx-auto mb-4 text-gray-300" />
        <h3 className="text-lg font-medium mb-2">No conversations found</h3>
        <p>No conversations available for {selectedAgentType || 'this user'}.</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Analytics Stats */}
      {analytics && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="bg-beige p-4 border-accent border-accent-top border-accent-left border-accent-right">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Conversations</p>
                <p className="text-2xl  text-gray-900">{analytics.total_conversations || 0}</p>
              </div>
              <MessageCircle className="w-8 h-8 text-gray-600" />
            </div>
          </div>

          <div className="bg-beige p-4 border-accent border-accent-top border-accent-left border-accent-right">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Now</p>
                <p className="text-2xl  text-gray-900">{analytics.active_conversations || 0}</p>
              </div>
              <Users className="w-8 h-8 text-gray-600" />
            </div>
          </div>

          <div className="bg-beige p-4 border-accent border-accent-top border-accent-left border-accent-right">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Messages</p>
                <p className="text-2xl text-gray-900">{analytics.average_messages_per_conversation || '0.0'}</p>
              </div>
              <TrendingUp className="w-8 h-8 text-gray-600" />
            </div>
          </div>

          <div className="bg-beige p-4 border-accent border-accent-top border-accent-left border-accent-right">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Messages</p>
                <p className="text-2xl  text-gray-900">{analytics.total_messages || 0}</p>
              </div>
              <MessageCircle className="w-8 h-8 text-gray-600" />
            </div>
          </div>
        </div>
      )}

      {/* Conversation Groups */}
      <div className="bg-beige border-accent border-accent-top border-accent-left border-accent-right flex flex-col sm:max-h-[70vh]">
        <div className="p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-lg font-semibold text-gray-900">
                Conversations {selectedAgentType && `- ${selectedAgentType} Agent`}
              </h3>
              <p className="text-sm text-gray-600 mt-1">
                {conversations.total_conversations} conversations grouped by goal/session
                {conversations.conversation_groups.length > 5 && (
                  <span className="text-xs  ml-2">• Scroll to view all</span>
                )}
              </p>
            </div>
          </div>
        </div>

        <div className="divide-y divide-gray-100 overflow-y-auto flex-1 conversation-list-scroll">
          {console.log(conversations)}
          {conversations.conversation_groups.map((group) => (
            <div key={group.agent_instance_id} className="border-b border-gray-100 last:border-b-0">
              {/* Group Header */}
              <button
                onClick={() => toggleGroup(group.agent_instance_id)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') {
                    e.preventDefault();
                    toggleGroup(group.agent_instance_id);
                  }
                }}
                className="w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between hover:bg-gray-50 transition-colors focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-inset"
              >
                <div className="flex items-center space-x-3">
                  {expandedGroups.has(group.agent_instance_id) ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                  <div className="text-left">
                    <h4 className="font-medium text-gray-900">{getGoalTitle(group.agent_instance_id, group)}</h4>
                    <p className="text-sm text-gray-500">
                      {group.conversation_count} conversations • {group.total_messages} messages
                    </p>
                    <p className="text-xs text-gray-400">Goal ID: {group.agent_instance_id}</p>
                  </div>
                </div>
                <div className="text-right">
                  <span className="text-xs text-gray-500">
                    {formatDate(group.last_activity)}
                  </span>
                  <div className="flex items-center mt-1">
                    <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                      group.detected_agent === 'loneliness' ? 'bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800' :
                      group.detected_agent === 'accountability' ? 'bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800' :
                      group.detected_agent === 'mental_therapist' ? 'bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800' :
                      'bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800'
                    }`}>
                      {group.detected_agent}
                    </span>
                  </div>
                </div>
              </button>

              {/* Expanded Conversations */}
              {expandedGroups.has(group.agent_instance_id) && (
                <div className="bg-gray-50 border-t border-gray-100">
                  {group.conversations.length > 8 && (
                    <div className="px-4 sm:px-8 py-2 bg-gray-100 border-b border-gray-200">
                      <p className="text-xs text-gray-600">
                        {group.conversations.length} conversations in this group • Scroll to view all
                      </p>
                    </div>
                  )}
                  <div className="max-h-80 overflow-y-auto conversation-expanded-scroll">
                    {group.conversations.map((conversation) => (
                    <button
                      key={conversation.conversation_id}
                      onClick={() => handleConversationSelect(conversation)}
                      onKeyDown={(e) => {
                        if (e.key === 'Enter' || e.key === ' ') {
                          e.preventDefault();
                          handleConversationSelect(conversation);
                        }
                      }}
                      className={`w-full px-4 sm:px-8 py-3 text-left hover:bg-beige transition-colors border-l-4 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-inset ${
                        selectedConversation === conversation.conversation_id
                          ? 'border-gray-500 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC]'
                          : 'border-transparent'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center space-x-2 mb-1">
                            <h5 className="text-sm font-medium text-gray-900 truncate">
                              Conversation {conversation.conversation_id}
                            </h5>
                            <span className={`inline-flex items-center px-1.5 py-0.5 rounded text-xs font-medium ${
                              conversation.is_active 
                                ? 'bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800' 
                                : 'bg-gray-100 text-gray-800'
                            }`}>
                              {conversation.is_active ? 'Active' : 'Inactive'}
                            </span>
                          </div>
                          <p className="text-xs text-gray-600 truncate">
                            {conversation.last_message_preview}
                          </p>
                          <div className="flex items-center space-x-4 mt-1">
                            <span className="text-xs text-gray-500">
                              {conversation.message_count} messages
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatDate(conversation.created_at)}
                            </span>
                          </div>
                        </div>
                      </div>
                    </button>
                  ))}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
