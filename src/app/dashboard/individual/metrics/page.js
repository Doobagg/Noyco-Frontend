'use client';

import { useState } from 'react';
import { useMetrics } from '../../../../store/hooks';
import { 
  Phone, 
  Calendar, 
  MessageCircle, 
  TrendingUp,
  Target,
  Users,
  Clock,
  CheckCircle,
  XCircle,
  AlertTriangle
} from 'lucide-react';

import { MetricCard, PatientEngagementCard } from './components/MetricCards';
import { CallVolumeChart, SuccessRateChart, CallsByHourChart, CallStatusDistribution } from './components/AppleStyleCharts';
import ConversationInsights from './components/ConversationInsights';
import AgentMetrics from './components/AgentMetrics';


export default function MetricsDashboardPage() {
  const { dashboard, loading, error, getTranscript, pauseSchedule, resumeSchedule, cancelSchedule, deleteSchedule } = useMetrics();
  const [selectedConversation, setSelectedConversation] = useState(null);
  const [selectedSchedule, setSelectedSchedule] = useState(null);
  const [activeTab, setActiveTab] = useState('overview');

  // Expose a setter so other components/buttons can switch tabs
  if (typeof window !== 'undefined') {
    window.__setMetricsActiveTab = setActiveTab;
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-beige flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading your metrics...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-beige flex items-center justify-center">
        <div className="text-center">
          <XCircle className="w-16 h-16 text-red-500 mx-auto mb-4" />
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Unable to Load Metrics</h2>
          <p className="text-gray-600">Please try refreshing the page</p>
        </div>
      </div>
    );
  }

  if (!dashboard) return null;

  const tabs = [
    { id: 'overview', name: 'Overview', icon: TrendingUp },
    { id: 'agents', name: 'Agents', icon: Target },
    { id: 'conversations', name: 'Conversations', icon: MessageCircle },
  ];

  return (
    <div className="bg-beige min-h-screen">
      {/* Header */}
      <div className="bg-beige  sticky top-0 z-10">
        <div className="px-4 py-2 md:px-6 md:py-4">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Health Metrics</h1>
              <p className="text-sm text-gray-600 mt-1">
                Real-time insights into your healthcare communications
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <p className="text-sm text-gray-500">Last updated</p>
                <p className="text-sm font-medium text-gray-900">
                  {new Date().toLocaleTimeString()}
                </p>
              </div>
              <div className="w-3 h-3 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] rounded-full animate-pulse"></div>
            </div>
          </div>

          {/* Tab Navigation */}
          <div className="mt-6">
            <nav className="flex space-x-4 sm:space-x-8 overflow-x-auto no-scrollbar whitespace-nowrap">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex items-center px-1 py-2 text-sm font-medium border-b-2 transition-colors ${
                      activeTab === tab.id
                        ? 'border-gray-800 text-gray-800 bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] px-3 py-2 rounded-t-lg'
                        : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    <Icon className="w-4 h-4 mr-2" />
                    {tab.name}
                  </button>
                );
              })}
            </nav>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="p-2 md:p-6">
        <div className="bg-beige border-accent border-accent-top border-accent-left border-accent-right shadow-sm">
          <div className="p-2 md:p-6">
            {activeTab === 'overview' && (
              <OverviewTab 
                dashboard={dashboard} 
                onConversationSelect={setSelectedConversation}
                onScheduleSelect={setSelectedSchedule}
              />
            )}

            {activeTab === 'agents' && (
              <AgentMetrics />
            )}

            {activeTab === 'conversations' && (
              <ConversationInsights 
                onConversationSelect={setSelectedConversation}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

function OverviewTab({ dashboard, onConversationSelect, onScheduleSelect }) {
  // Provide fallback values for the analytics
  const analytics = dashboard?.conversation_analytics || {};
  const callAnalytics = dashboard?.call_analytics || {};
  const systemHealth = dashboard?.system_health || {};

  return (
    <div className="space-y-1 md:space-y-6">
      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ">
        <MetricCard
          title="Total Conversations"
          value={analytics.total_conversations || 0}
          subtitle="All time"
          trend={{ direction: 'up', value: '+12%', period: 'vs last month' }}
          icon={<MessageCircle className="w-6 h-6" />}
          color="blue"
        />
        <MetricCard
          title="Active Conversations"
          value={analytics.active_conversations || 0}
          subtitle="Currently active"
          trend={{ direction: 'up', value: '+2.3%', period: 'vs last week' }}
          icon={<CheckCircle className="w-6 h-6" />}
          color="green"
        />
        <MetricCard
          title="Avg Messages"
          value={analytics.average_messages_per_conversation || '0.0'}
          subtitle="Per conversation"
          icon={<TrendingUp className="w-6 h-6" />}
          color="purple"
        />
        <MetricCard
          title="Total Messages"
          value={analytics.total_messages || 0}
          subtitle="All conversations"
          trend={{ direction: 'up', value: '+15%', period: 'vs last week' }}
          icon={<MessageCircle className="w-6 h-6" />}
          color="orange"
        />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-beige p-6 border-accent border-accent-top border-accent-left border-accent-right">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Conversation Analytics</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Recent Activity (7d)</span>
              <span className="font-semibold text-gray-600">{analytics.recent_activity_7d || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Conversations</span>
              <span className="font-semibold text-gray-600">{analytics.active_conversations || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Messages</span>
              <span className="font-semibold text-gray-600">{analytics.total_messages || 0}</span>
            </div>
          </div>
        </div>
        <div className="bg-beige p-6 border-accent border-accent-top border-accent-left border-accent-right">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h3>
          <div className="space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Recent Activity (7d)</span>
              <span className="font-semibold text-gray-600">{analytics.recent_activity_7d || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Active Conversations</span>
              <span className="font-semibold text-gray-600">{analytics.active_conversations || 0}</span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-gray-600">Total Messages</span>
              <span className="font-semibold text-gray-600">{analytics.total_messages || 0}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-1 gap-6 bg-beige">
        <div className="bg-beige p-6 border-accent border-accent-top border-accent-left border-accent-right">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
          <div className="space-y-3">
            <button 
              onClick={() => {
                const setTab = window.__setMetricsActiveTab;
                if (typeof setTab === 'function') setTab('conversations');
              }}
              className="w-full flex items-center justify-between p-3 bg-beige hover:bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC]   rounded-lg transition-colors"
            >
              <div className="flex items-center space-x-3">
                <MessageCircle className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">View All Conversations</span>
              </div>
              <span className="text-xs text-gray-600">{analytics.total_conversations || 0} total</span>
            </button>
            
            <button 
              onClick={() => console.log('Export data feature coming soon')}
              className="w-full flex items-center justify-between p-3  hover:bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC]  transition-colors"
            >
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Export Analytics</span>
              </div>
              <span className="text-xs text-gray-600">PDF</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
