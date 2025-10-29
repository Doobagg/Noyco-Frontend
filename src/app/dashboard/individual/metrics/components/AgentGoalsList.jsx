'use client';
import { useState } from 'react';
import { Calendar, CheckCircle, Clock, TrendingUp, AlertTriangle } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';

export default function AgentGoalsList({ agentMetrics, selectedGoal, onGoalSelect, timeframe }) {
  const [expandedAgent, setExpandedAgent] = useState(null);

  if (!agentMetrics || !agentMetrics.agents) {
    return (
      <div className="bg-beige border-accent border-accent-top border-accent-left border-accent-right p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Goals Overview</h3>
        <p className="text-gray-500">No agent data available</p>
      </div>
    );
  }

  const toggleAgent = (agentId) => {
    setExpandedAgent(expandedAgent === agentId ? null : agentId);
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'completed':
        return 'bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 border-accent';
      case 'active':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'paused':
        return 'bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 border-accent';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="w-4 h-4" />;
      case 'active':
        return <Clock className="w-4 h-4" />;
      case 'paused':
        return <AlertTriangle className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  // const getMoodIcon = (mood) => {
  //   const moodColors = {
  //     'very_happy': 'text-green-500',
  //     'happy': 'text-green-400',
  //     'neutral': 'text-gray-400',
  //     'sad': 'text-orange-400',
  //     'very_sad': 'text-red-500',
  //     'anxious': 'text-red-400',
  //     'worried': 'text-orange-500',
  //     'calm': 'text-blue-400',
  //     'excited': 'text-purple-500',
  //     'stressed': 'text-red-600'
  //   };
    
  //   return (
  //     <Heart className={`w-4 h-4 ${moodColors[mood?.toLowerCase()] || 'text-gray-400'}`} />
  //   );
  // };

  const formatLastCheckIn = (timestamp) => {
    if (!timestamp) return 'Never';
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return 'Invalid date';
    }
  };

  // const formatDueDate = (dueDate) => {
  //   if (!dueDate) return null;
  //   try {
  //     const date = new Date(dueDate);
  //     const now = new Date();
  //     const diffDays = Math.ceil((date - now) / (1000 * 60 * 60 * 24));
      
  //     if (diffDays < 0) return { text: 'Overdue', color: 'text-red-600' };
  //     if (diffDays === 0) return { text: 'Due today', color: 'text-orange-600' };
  //     if (diffDays <= 3) return { text: `${diffDays} days left`, color: 'text-orange-500' };
  //     if (diffDays <= 7) return { text: `${diffDays} days left`, color: 'text-yellow-600' };
  //     return { text: `${diffDays} days left`, color: 'text-gray-600' };
  //   } catch {
  //     return null;
  //   }
  // };

  return (
    <div className="bg-beige border-accent border-accent-top border-accent-left border-accent-right overflow-hidden">
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-gray-100">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Goals Overview</h3>
            <p className="text-sm text-gray-600 mt-1">
              {agentMetrics.summary.total_goals} total goals across {agentMetrics.agents.length} agent instances
            </p>
          </div>
          <div className="text-xs text-gray-500 bg-beige px-3 py-1 border">
            Click goals for details
          </div>
        </div>
      </div>

      <div className="max-h-[600px] overflow-y-auto">
        {agentMetrics.agents.map((agent) => (
          <div key={agent.agent_id} className="border-b border-gray-100 last:border-b-0">
            {/* Agent Header */}
            <div 
              className="p-4 cursor-pointer hover:bg-gray-50 transition-colors"
              onClick={() => toggleAgent(agent.agent_id)}
            >
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-blue-600" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Agent {agent.agent_id.slice(-8)}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {agent.total_goals} goals • {agent.active_goals} active
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {agent.active_goals}/{agent.total_goals}
                    </p>
                    <p className="text-xs text-gray-500">Active</p>
                  </div>
                  <svg
                    className={`w-5 h-5 text-gray-400 transition-transform ${
                      expandedAgent === agent.agent_id ? 'rotate-180' : ''
                    }`}
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>
            </div>

            {/* Goals List */}
            {expandedAgent === agent.agent_id && (
              <div className="bg-gray-50 border-t border-gray-200">
                {agent.goals.map((goal) => (
                  <div
                    key={goal.goal_id}
                    className={`p-4 border-b border-gray-200 last:border-b-0 cursor-pointer transition-all duration-200 ${
                      selectedGoal?.goal_id === goal.goal_id 
                        ? 'bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] border-blue-200 shadow-sm' 
                        : 'hover:bg-beige hover:shadow-sm'
                    }`}
                    onClick={() => onGoalSelect(goal)}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center space-x-2 mb-2">
                          <h5 className="font-medium text-gray-900 truncate">
                            {goal.title || 'Untitled Goal'}
                          </h5>
                          <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(goal.status)}`}>
                            {getStatusIcon(goal.status)}
                            <span className="ml-1">{goal.status}</span>
                          </span>
                          {selectedGoal?.goal_id === goal.goal_id && (
                            <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                              Selected
                            </span>
                          )}
                        </div>
                        
                        {goal.description && (
                          <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                            {goal.description}
                          </p>
                        )}

                        <div className="grid grid-cols-2 gap-4 text-xs">
                          <div>
                            <span className="text-gray-500">Progress:</span>
                            <div className="flex items-center mt-1">
                              <div className="flex-1 bg-gray-200 rounded-full h-2 mr-2">
                                <div 
                                  className="bg-blue-500 h-2 rounded-full transition-all"
                                  style={{ width: `${goal.progress_percentage}%` }}
                                ></div>
                              </div>
                              <span className="text-gray-700 font-medium">
                                {goal.progress_percentage.toFixed(0)}%
                              </span>
                            </div>
                          </div>
                          
                          <div>
                            <span className="text-gray-500">Streak:</span>
                            <p className="text-gray-700 font-medium mt-1">
                              🔥 {goal.streak} days (max: {goal.max_streak})
                            </p>
                          </div>
                          
                          <div>
                            <span className="text-gray-500">Check-ins ({timeframe}):</span>
                            <div className="flex items-center mt-1">
                              <span className="text-gray-700 font-medium">
                                {goal.check_ins_count}
                              </span>
                              {goal.check_ins_count > 0 && (
                                <span className="ml-1 text-green-500">✓</span>
                              )}
                            </div>
                          </div>
                          
                          <div>
                            <span className="text-gray-500">
                              {goal.days_until_due !== null && goal.days_until_due >= 0 ? 'Due in:' : 'Last check-in:'}
                            </span>
                            <p className="text-gray-700 font-medium mt-1">
                              {goal.days_until_due !== null && goal.days_until_due >= 0 
                                ? `${goal.days_until_due} days`
                                : formatLastCheckIn(goal.last_check_in)
                              }
                            </p>
                          </div>
                        </div>

                        {goal.mood_average && (
                          <div className="mt-3 pt-3 border-t border-gray-200">
                            <span className="text-xs text-gray-500">Average Stress Level:</span>
                            <div className="flex items-center mt-1">
                              <div className="flex space-x-1">
                                {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((i) => (
                                  <div
                                    key={i}
                                    className={`w-2 h-3 rounded-sm ${
                                      i <= goal.mood_average ? 'bg-red-400' : 'bg-gray-300'
                                    }`}
                                  />
                                ))}
                              </div>
                              <span className="ml-2 text-xs text-gray-700 font-medium">
                                {goal.mood_average.toFixed(1)}/10
                              </span>
                            </div>
                          </div>
                        )}

                        {/* Click indicator */}
                        <div className="mt-3 pt-3 border-t border-gray-200">
                          <div className="flex items-center justify-between">
                            <span className="text-xs text-gray-500">
                              View detailed analytics →
                            </span>
                            {selectedGoal?.goal_id === goal.goal_id ? (
                              <span className="text-xs text-blue-600 font-medium">
                                Charts displayed →
                              </span>
                            ) : (
                              <span className="text-xs text-gray-400">
                                Click to select
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ))}

                {agent.goals.length === 0 && (
                  <div className="p-4 text-center text-gray-500">
                    <Calendar className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                    <p className="text-sm">No goals found for this agent</p>
                  </div>
                )}
              </div>
            )}
          </div>
        ))}

        {agentMetrics.agents.length === 0 && (
          <div className="p-8 text-center text-gray-500">
            <TrendingUp className="w-12 h-12 mx-auto mb-4 text-gray-300" />
            <h4 className="font-medium text-gray-900 mb-2">No agents found</h4>
            <p className="text-sm">Create some goals to get started with agent tracking.</p>
          </div>
        )}
      </div>
    </div>
  );
}
