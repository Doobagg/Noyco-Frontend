export default function AgentUsageChart({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="text-center py-8 text-gray-500">
        No agent usage data available
      </div>
    );
  }

  const maxCount = Math.max(...data.map(agent => agent.conversation_count));

  return (
    <div className="space-y-4">
      {data.map((agent, index) => (
        <div key={index} className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center gap-2">
              <span className="font-medium text-gray-900">{agent.agent_name}</span>
              <span className="text-xs text-gray-500">({agent.conversation_count} conversations)</span>
            </div>
            <span className="text-sm font-semibold text-indigo-600">{agent.percentage}%</span>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex-1 bg-gray-200 rounded-full h-3 overflow-hidden">
              <div
                className="bg-gradient-to-r from-indigo-500 to-purple-600 h-full rounded-full transition-all duration-500"
                style={{ width: `${(agent.conversation_count / maxCount) * 100}%` }}
              />
            </div>
          </div>

          <div className="flex items-center gap-4 text-xs text-gray-600">
            <span>Active Goals: <span className="font-semibold text-gray-900">{agent.active_goals}</span></span>
            <span>Total Goals: <span className="font-semibold text-gray-900">{agent.total_goals}</span></span>
          </div>
        </div>
      ))}
    </div>
  );
}
