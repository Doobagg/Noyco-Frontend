export default function RecentActivityFeed({ activities }) {
  if (!activities || activities.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
        <div className="text-center py-8 text-gray-500">
          No recent activity
        </div>
      </div>
    );
  }

  const activityIcons = {
    signup: '👤',
    goal_created: '🎯',
    subscription_cancelled: '⚠️',
    payment_failed: '❌',
    payment_success: '✅',
  };

  const activityColors = {
    signup: 'bg-green-100 text-green-700',
    goal_created: 'bg-blue-100 text-blue-700',
    subscription_cancelled: 'bg-yellow-100 text-yellow-700',
    payment_failed: 'bg-red-100 text-red-700',
    payment_success: 'bg-green-100 text-green-700',
  };

  const formatTime = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins}m ago`;
    if (diffHours < 24) return `${diffHours}h ago`;
    if (diffDays < 7) return `${diffDays}d ago`;
    return date.toLocaleDateString();
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Recent Activity</h2>
      
      <div className="space-y-3 max-h-96 overflow-y-auto">
        {activities.map((activity, index) => (
          <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
            <div className={`flex-shrink-0 w-8 h-8 rounded-full ${activityColors[activity.type] || 'bg-gray-200'} flex items-center justify-center text-lg`}>
              {activityIcons[activity.type] || '📋'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-sm font-semibold text-gray-900 truncate">{activity.title}</p>
              <p className="text-xs text-gray-600 mt-1">{activity.description}</p>
              {activity.user_email && (
                <p className="text-xs text-gray-500 mt-1">{activity.user_email}</p>
              )}
            </div>
            <span className="flex-shrink-0 text-xs text-gray-500">{formatTime(activity.timestamp)}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
