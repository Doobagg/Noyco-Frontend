export default function SystemHealthPanel({ data }) {
  if (!data) return null;

  const statusColors = {
    healthy: 'bg-green-500',
    degraded: 'bg-yellow-500',
    down: 'bg-red-500',
  };

  const statusTextColors = {
    healthy: 'text-green-700',
    degraded: 'text-yellow-700',
    down: 'text-red-700',
  };

  const statusBgColors = {
    healthy: 'bg-green-50',
    degraded: 'bg-yellow-50',
    down: 'bg-red-50',
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-xl font-bold text-gray-900">System Health</h2>
        <div className={`px-3 py-1 rounded-full ${statusBgColors[data.overall_status]} flex items-center gap-2`}>
          <div className={`w-2 h-2 rounded-full ${statusColors[data.overall_status]}`} />
          <span className={`text-xs font-semibold ${statusTextColors[data.overall_status]} capitalize`}>
            {data.overall_status}
          </span>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-3 gap-4 mb-6">
        <div className="text-center">
          <p className="text-xs text-gray-600">Uptime</p>
          <p className="text-lg font-bold text-gray-900">{data.uptime_percentage}%</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-600">Error Rate</p>
          <p className="text-lg font-bold text-gray-900">{data.error_rate_24h}%</p>
        </div>
        <div className="text-center">
          <p className="text-xs text-gray-600">Avg Response</p>
          <p className="text-lg font-bold text-gray-900">{data.avg_response_time_ms}ms</p>
        </div>
      </div>

      {/* Services List */}
      <div className="space-y-2">
        <p className="text-sm font-semibold text-gray-700 mb-3">Services</p>
        {data.services.map((service, index) => (
          <div key={index} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${statusColors[service.status]}`} />
              <span className="text-sm font-medium text-gray-900">{service.service_name}</span>
            </div>
            {service.response_time_ms && (
              <span className="text-xs text-gray-600">{service.response_time_ms.toFixed(0)}ms</span>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
