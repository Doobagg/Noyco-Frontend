export default function RevenueChart({ data }) {
  if (!data) return null;

  const metrics = [
    { label: 'MRR', value: data.mrr, color: 'bg-green-500' },
    { label: 'This Month', value: data.revenue_this_month, color: 'bg-blue-500' },
    { label: 'This Week', value: data.revenue_this_week, color: 'bg-purple-500' },
  ];

  const maxValue = Math.max(...metrics.map(m => m.value));

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <h2 className="text-xl font-bold text-gray-900 mb-6">Revenue Overview</h2>
      
      <div className="space-y-6">
        {metrics.map((metric, index) => (
          <div key={index}>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm font-medium text-gray-700">{metric.label}</span>
              <span className="text-lg font-bold text-gray-900">${metric.value.toLocaleString()}</span>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-4 overflow-hidden">
              <div
                className={`${metric.color} h-full rounded-full transition-all duration-500`}
                style={{ width: `${(metric.value / maxValue) * 100}%` }}
              />
            </div>
          </div>
        ))}
      </div>

      <div className="mt-6 pt-6 border-t border-gray-200 grid grid-cols-2 gap-4">
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-600 font-medium">Total Revenue</p>
          <p className="text-lg font-bold text-gray-900 mt-1">${data.total_revenue_all_time.toLocaleString()}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4">
          <p className="text-xs text-gray-600 font-medium">ARPU</p>
          <p className="text-lg font-bold text-gray-900 mt-1">${data.arpu}</p>
        </div>
      </div>

      {data.failed_payments_this_month > 0 && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-lg">
          <p className="text-sm text-red-800">
            <span className="font-semibold">{data.failed_payments_this_month}</span> failed payment{data.failed_payments_this_month !== 1 ? 's' : ''} this month
          </p>
        </div>
      )}
    </div>
  );
}
