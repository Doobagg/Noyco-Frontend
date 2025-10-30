export default function SubscriptionBreakdown({ data }) {
  if (!data || data.length === 0) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Subscription Breakdown</h2>
        <div className="text-center py-8 text-gray-500">
          No subscription data available
        </div>
      </div>
    );
  }

  const totalCount = data.reduce((sum, plan) => sum + plan.count, 0);
  const totalMRR = data.reduce((sum, plan) => sum + plan.mrr, 0);

  const planColors = {
    'one_month': 'bg-blue-500',
    'three_months': 'bg-purple-500',
    'six_months': 'bg-indigo-500',
  };

  const planLabels = {
    'one_month': '1 Month Plan',
    'three_months': '3 Months Plan',
    'six_months': '6 Months Plan',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Subscription Breakdown</h2>
      
      {/* Pie Chart Visualization */}
      <div className="flex items-center justify-center mb-6">
        <div className="relative w-48 h-48">
          <svg viewBox="0 0 100 100" className="transform -rotate-90">
            {data.map((plan, index) => {
              const percentage = (plan.count / totalCount) * 100;
              const offset = data
                .slice(0, index)
                .reduce((sum, p) => sum + (p.count / totalCount) * 100, 0);
              
              return (
                <circle
                  key={index}
                  cx="50"
                  cy="50"
                  r="40"
                  fill="none"
                  stroke={planColors[plan.plan_type]?.replace('bg-', '') || '#6366f1'}
                  strokeWidth="20"
                  strokeDasharray={`${percentage * 2.51327} ${251.327 - percentage * 2.51327}`}
                  strokeDashoffset={-offset * 2.51327}
                  className="transition-all duration-500"
                />
              );
            })}
          </svg>
          <div className="absolute inset-0 flex items-center justify-center flex-col">
            <p className="text-2xl font-bold text-gray-900">{totalCount}</p>
            <p className="text-xs text-gray-500">Total Subs</p>
          </div>
        </div>
      </div>

      {/* Legend */}
      <div className="space-y-3">
        {data.map((plan, index) => {
          const percentage = ((plan.count / totalCount) * 100).toFixed(1);
          return (
            <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
              <div className="flex items-center gap-3">
                <div className={`w-4 h-4 rounded ${planColors[plan.plan_type] || 'bg-gray-400'}`} />
                <div>
                  <p className="text-sm font-medium text-gray-900">{planLabels[plan.plan_type] || plan.plan_type}</p>
                  <p className="text-xs text-gray-500">{plan.count} subscriptions ({percentage}%)</p>
                </div>
              </div>
              <p className="text-sm font-bold text-gray-900">${plan.mrr.toFixed(2)}</p>
            </div>
          );
        })}
      </div>

      {/* Total MRR */}
      <div className="mt-6 pt-6 border-t border-gray-200">
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-gray-600">Total MRR</span>
          <span className="text-xl font-bold text-indigo-600">${totalMRR.toFixed(2)}</span>
        </div>
      </div>
    </div>
  );
}
