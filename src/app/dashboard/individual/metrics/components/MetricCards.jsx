'use client';
import { ArrowUp, ArrowDown } from 'lucide-react';

export function MetricCard({ title, value, subtitle, trend, icon, color = 'blue' }) {
  // const colorClasses = {
  //   blue: 'bg-blue-50 text-blue-600 border-blue-100',
  //   green: 'bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 border-accent',
  //   orange: 'bg-orange-50 text-orange-600 border-orange-100',
  //   red: 'bg-red-50 text-red-600 border-red-100',
  //   purple: 'bg-purple-50 text-purple-600 border-purple-100'
  // };

  void color; // to avoid unused variable warning

  return (
    <div className="bg-beige p-6 border-accent border-accent-top border-accent-left border-accent-right">
      <div className="flex items-start justify-between">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-600 mb-1">{title}</p>
          <p className="text-3xl  text-gray-900 mb-2">{value}</p>
          {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
          
          {trend && (
            <div className="flex items-center mt-3">
              <div className={`flex items-center px-2 py-1 rounded-full text-xs font-medium ${
                trend.direction === 'up' ? 'bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800' : 'bg-red-100 text-red-700'
              }`}>
                {trend.direction === 'up' ? 
                  <ArrowUp className="w-3 h-3 mr-1" /> : 
                  <ArrowDown className="w-3 h-3 mr-1" />
                }
                {trend.value}
              </div>
              <span className="text-xs text-gray-500 ml-2">{trend.period}</span>
            </div>
          )}
        </div>
        
        {icon && (
          <div className="flex items-center justify-center text-current">
            {icon}
          </div>
        )}
      </div>
    </div>
  );
}

export function SystemHealthCard({ health }) {
  const statusColors = {
    healthy: 'text-gray-800 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC]',
    warning: 'text-orange-600 bg-orange-100',
    critical: 'text-red-600 bg-red-100'
  };

  return (
    <div className="bg-beige p-6 border-accent border-accent-top border-accent-left border-accent-right">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">System Health</h3>
        <div className={`px-3 py-1 rounded-full text-sm font-medium ${statusColors[health?.status] || statusColors.healthy}`}>
          {health?.status || 'healthy'}
        </div>
      </div>
      
      <div className="space-y-4">
        <div className="flex justify-between">
          <span className="text-gray-600">Uptime</span>
          <span className="font-semibold">{health?.uptime || '99.9%'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Response Time</span>
          <span className="font-semibold">{health?.response_time || '1.2s'}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-gray-600">Error Rate</span>
          <span className="font-semibold">{health?.error_rate || '0.1%'}</span>
        </div>
      </div>
    </div>
  );
}

export function PatientEngagementCard({ engagement }) {
  return (
    <div className="bg-beige p-6 border-accent border-accent-top border-accent-left border-accent-right">
      <h3 className="text-lg font-semibold text-gray-900 mb-4">Patient Engagement</h3>
      
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-900">{engagement?.engagement_score || 78.5}</p>
            <p className="text-sm text-gray-600">Engagement Score</p>
          </div>
          <div className="text-right">
            <p className="text-lg font-semibold text-gray-900">{engagement?.total_patients || 1247}</p>
            <p className="text-sm text-gray-600">Total Patients</p>
          </div>
        </div>
        
        <div className="pt-4 border-t border-gray-100">
          <p className="text-sm font-medium text-gray-700 mb-3">Top Channels</p>
          <div className="space-y-2">
            {(engagement?.top_engagement_channels || []).map((channel, idx) => (
              <div key={idx} className="flex items-center justify-between">
                <span className="text-sm text-gray-600">{channel.channel}</span>
                <span className="text-sm font-medium">{channel.percentage}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
