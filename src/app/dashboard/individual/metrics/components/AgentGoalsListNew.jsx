'use client';
import { useState } from 'react';
import { Calendar, CheckCircle, Clock, TrendingUp, AlertTriangle, Heart, ChevronDown, ChevronRight } from 'lucide-react';
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

  const getMoodIcon = (mood) => {
    const moodEmojis = {
      'very_happy': '😊',
      'happy': '🙂',
      'neutral': '😐',
      'sad': '😔',
      'very_sad': '😢',
      'anxious': '😰',
      'worried': '😟',
      'calm': '😌',
      'excited': '🤩',
      'stressed': '😫'
    };
    
    return moodEmojis[mood?.toLowerCase()] || '😐';
  };

  const formatLastCheckIn = (timestamp) => {
    if (!timestamp) return 'Never';
    try {
      return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } catch {
      return 'Invalid date';
    }
  };

  const formatDueDate = (dueDate) => {
    if (!dueDate) return null;
    try {
      const date = new Date(dueDate);
      const now = new Date();
      const diffDays = Math.ceil((date - now) / (1000 * 60 * 60 * 24));
      
      if (diffDays < 0) return { text: 'Overdue', color: 'text-red-600', urgent: true };
      if (diffDays === 0) return { text: 'Due today', color: 'text-orange-600', urgent: true };
      if (diffDays <= 3) return { text: `${diffDays} days left`, color: 'text-orange-500', urgent: true };
      if (diffDays <= 7) return { text: `${diffDays} days left`, color: 'text-yellow-600', urgent: false };
      return { text: `${diffDays} days left`, color: 'text-gray-600', urgent: false };
    } catch {
      return null;
    }
  };

  return (
    <div className="bg-beige border-accent border-accent-top border-accent-left border-accent-right overflow-hidden">
      <div className="p-6 border-b border-gray-200 bg-gradient-to-r from-gray-50 to-white">
        <h3 className="text-lg font-semibold text-gray-900">Goals Overview</h3>
        <p className="text-sm text-gray-600 mt-1">
          {agentMetrics.summary.total_goals} total goals across {agentMetrics.agents.length} agent instances
        </p>
        <div className="flex items-center gap-4 mt-3 text-xs">
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-gray-600">{agentMetrics.summary.active_goals} Active</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-gray-600">{agentMetrics.summary.completed_goals} Completed</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            <span className="text-gray-600">{agentMetrics.summary.completion_rate.toFixed(1)}% Success Rate</span>
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
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <h4 className="font-medium text-gray-900">
                      Agent Instance {agent.agent_id.slice(-8)}
                    </h4>
                    <p className="text-sm text-gray-600">
                      {agent.total_goals} goals • {agent.active_goals} active • {agent.completed_goals} completed
                    </p>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <div className="text-right">
                    <div className="flex items-center space-x-2">
                      <div className="w-8 h-2 bg-gray-200 rounded-full">
                        <div 
                          className="h-2 bg-green-500 rounded-full transition-all"
                          style={{ width: `${(agent.active_goals / agent.total_goals) * 100}%` }}
                        ></div>
                      </div>
                      <span className="text-sm font-medium text-gray-900">
                        {agent.active_goals}/{agent.total_goals}
                      </span>
                    </div>
                  </div>
                  {expandedAgent === agent.agent_id ? (
                    <ChevronDown className="w-5 h-5 text-gray-400" />
                  ) : (
                    <ChevronRight className="w-5 h-5 text-gray-400" />
                  )}
                </div>
              </div>
            </div>

            {/* Goals List */}
            {expandedAgent === agent.agent_id && (
              <div className="bg-gray-50 border-t border-gray-200">
                {agent.goals.map((goal) => {
                  const dueInfo = formatDueDate(goal.due_date);
                  const hasData = goal.check_ins_count > 0 || goal.progress_percentage > 0 || goal.streak > 0;
                  
                  return (
                    <div
                      key={goal.goal_id}
                      className={`p-4 border-b border-gray-200 last:border-b-0 cursor-pointer transition-all duration-200 ${
                        selectedGoal?.goal_id === goal.goal_id 
                          ? 'bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] border-l-4 border-l-blue-500 shadow-sm' 
                          : 'hover:bg-beige hover:shadow-sm border-l-4 border-l-transparent'
                      }`}
                      onClick={() => onGoalSelect(goal)}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1 min-w-0">
                          {/* Goal Header */}
                          <div className="flex items-center space-x-2 mb-3">
                            <h5 className="font-semibold text-gray-900 truncate">
                              {goal.title || 'Untitled Goal'}
                            </h5>
                            <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium border ${getStatusColor(goal.status)}`}>
                              {getStatusIcon(goal.status)}
                              <span className="ml-1 capitalize">{goal.status}</span>
                            </span>
                            {selectedGoal?.goal_id === goal.goal_id && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800 border border-blue-200">
                                📊 Viewing Charts
                              </span>
                            )}
                            {dueInfo?.urgent && (
                              <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-red-100 text-red-800 border border-red-200">
                                ⚠️ {dueInfo.text}
                              </span>
                            )}
                          </div>
                          
                          {goal.description && (
                            <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                              {goal.description}
                            </p>
                          )}

                          {/* Key Metrics Cards */}
                          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 mb-3">
                            {/* Check-ins */}
                            <div className="bg-beige p-3 border-accent border-accent-top border-accent-left border-accent-right hover:border-blue-200 transition-colors">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-gray-500">Check-ins ({timeframe})</span>
                                <CheckCircle className="w-3 h-3 text-gray-400" />
                              </div>
                              <div className="flex items-center">
                                <span className="text-xl font-bold text-gray-900">
                                  {goal.check_ins_count || 0}
                                </span>
                                {goal.check_ins_count > 0 && (
                                  <span className="ml-1 text-green-500">✓</span>
                                )}
                              </div>
                            </div>
                            
                            {/* Progress */}
                            <div className="bg-beige p-3 border-accent border-accent-top border-accent-left border-accent-right hover:border-green-200 transition-colors">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-gray-500">Progress</span>
                                <TrendingUp className="w-3 h-3 text-gray-400" />
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-xl font-bold text-gray-900">
                                  {goal.progress_percentage?.toFixed(0) || 0}%
                                </span>
                                <div className="flex-1 bg-gray-200 rounded-full h-1.5">
                                  <div 
                                    className="bg-green-500 h-1.5 rounded-full transition-all"
                                    style={{ width: `${goal.progress_percentage || 0}%` }}
                                  ></div>
                                </div>
                              </div>
                            </div>
                            
                            {/* Streak */}
                            <div className="bg-beige p-3 border-accent border-accent-top border-accent-left border-accent-right hover:border-orange-200 transition-colors">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-gray-500">Streak</span>
                                <span className="text-orange-500">🔥</span>
                              </div>
                              <div className="flex items-center space-x-1">
                                <span className="text-xl font-bold text-gray-900">
                                  {goal.streak || 0}
                                </span>
                                <span className="text-xs text-gray-500">
                                  (max: {goal.max_streak || 0})
                                </span>
                              </div>
                            </div>
                            
                            {/* Mood/Status */}
                            <div className="bg-beige p-3 border-accent border-accent-top border-accent-left border-accent-right hover:border-purple-200 transition-colors">
                              <div className="flex items-center justify-between mb-1">
                                <span className="text-xs text-gray-500">Latest Mood</span>
                                <Heart className="w-3 h-3 text-gray-400" />
                              </div>
                              <div className="flex items-center space-x-2">
                                <span className="text-lg">
                                  {getMoodIcon(goal.latest_mood)}
                                </span>
                                <span className="text-sm font-medium text-gray-700 capitalize">
                                  {goal.latest_mood || 'Not recorded'}
                                </span>
                              </div>
                            </div>
                          </div>

                          {/* Activity Summary */}
                          <div className="flex items-center justify-between pt-3 border-t border-gray-100">
                            <div className="flex items-center space-x-4 text-xs text-gray-500">
                              {goal.last_check_in && (
                                <span>Last activity: {formatLastCheckIn(goal.last_check_in)}</span>
                              )}
                              {dueInfo && !dueInfo.urgent && (
                                <span className={dueInfo.color}>{dueInfo.text}</span>
                              )}
                            </div>
                            
                            {/* Action Indicator */}
                            <div className="flex items-center space-x-2">
                              {hasData ? (
                                <div className="flex items-center space-x-1 text-blue-600">
                                  <span className="text-xs">
                                    {selectedGoal?.goal_id === goal.goal_id ? 'Viewing charts' : 'Click for charts'}
                                  </span>
                                  {selectedGoal?.goal_id !== goal.goal_id && (
                                    <svg className="w-3 h-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                                    </svg>
                                  )}
                                </div>
                              ) : (
                                <span className="text-xs text-gray-400 italic">
                                  No data to chart yet
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}

                {agent.goals.length === 0 && (
                  <div className="p-6 text-center text-gray-500">
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
