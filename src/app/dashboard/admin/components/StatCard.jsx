export default function StatCard({ title, value, icon, trend, subtitle, details }) {
  const trendColors = {
    up: 'text-green-600',
    down: 'text-red-600',
    neutral: 'text-gray-600',
  };

  const trendIcons = {
    up: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M5.293 9.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 7.414V15a1 1 0 11-2 0V7.414L6.707 9.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
      </svg>
    ),
    down: (
      <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
        <path fillRule="evenodd" d="M14.707 10.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 12.586V5a1 1 0 012 0v7.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
      </svg>
    ),
    neutral: null,
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 hover:shadow-md transition-shadow">
      <div className="flex items-start justify-between mb-4">
        <div>
          <p className="text-sm font-medium text-gray-600">{title}</p>
          <p className="text-3xl font-bold text-gray-900 mt-2">{value}</p>
        </div>
        <div className="text-3xl">{icon}</div>
      </div>

      {subtitle && (
        <div className={`flex items-center gap-1 text-sm ${trendColors[trend || 'neutral']}`}>
          {trendIcons[trend]}
          <span className="font-medium">{subtitle}</span>
        </div>
      )}

      {details && details.length > 0 && (
        <div className="mt-4 pt-4 border-t border-gray-100 space-y-2">
          {details.map((detail, index) => (
            <div key={index} className="flex items-center justify-between text-sm">
              <span className="text-gray-600">{detail.label}</span>
              <span className="font-semibold text-gray-900">{detail.value}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
