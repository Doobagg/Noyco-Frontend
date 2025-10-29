'use client';

import { useMemo, useState } from 'react';
import { useMetrics } from '../../../../store/hooks';
import {  
  MessageCircle, 
  TrendingUp,
  Target,
  CheckCircle,
  XCircle,
} from 'lucide-react';

import { MetricCard, } from './components/MetricCards';
import { CallStatusDistribution, ConversationDurationChart, CombinedTrendChart, AgentDistributionChart, CallsByHourPolarChart } from './components/AppleStyleCharts';
import ConversationInsights from './components/ConversationInsights';
import AgentMetrics from './components/AgentMetrics';


export default function MetricsDashboardPage() {
  const { dashboard, analytics, conversations, agentTypes, loading, error} = useMetrics();
  const [selectedConversation, setSelectedConversation] = useState(null);
  void selectedConversation; // to avoid unused variable warning
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
                analytics={analytics}
                conversations={conversations}
                agentTypes={agentTypes}
                onConversationSelect={setSelectedConversation}
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

function OverviewTab({ dashboard, analytics: analyticsFromHook, conversations, agentTypes }) {
  // Base analytics from backend
  const baseAnalytics = analyticsFromHook || dashboard?.conversation_analytics || {};

  // Local timeframe state (no new APIs; purely client-side filtering)
  const [timeframe, setTimeframe] = useState('7d'); // '24h' | '7d' | '30d' | '90d'
  const [agentFilter, setAgentFilter] = useState('');

  // Flatten conversation instances for client-side aggregations
  const flatConversations = useMemo(() => {
    if (!conversations?.conversation_groups) return [];
    return conversations.conversation_groups.flatMap(g =>
      (g.conversations || []).map(c => ({
        conversation_id: c.conversation_id,
        updated_at: c.updated_at || c.created_at,
        is_active: c.is_active,
        message_count: c.message_count || 0,
        detected_agent: c.detected_agent,
      }))
    );
  }, [conversations]);

  // Apply agent type filter (client-side only)
  const filteredConversations = useMemo(() => {
    if (!agentFilter) return flatConversations;
    return flatConversations.filter(c => c.detected_agent === agentFilter);
  }, [flatConversations, agentFilter]);

  // Time window filter
  const timeWindow = useMemo(() => {
    const now = new Date();
    const map = {
      '24h': 1,
      '7d': 7,
      '30d': 30,
      '90d': 90,
    };
    const days = map[timeframe] || 7;
    return {
      start: new Date(now.getTime() - days * 24 * 60 * 60 * 1000),
      end: now,
      days,
    };
  }, [timeframe]);

  const inWindow = (d) => {
    const dt = new Date(d);
    return dt >= timeWindow.start && dt <= timeWindow.end;
  };

  // Derived KPI trends
  const windowConversations = useMemo(
    () => filteredConversations.filter(c => inWindow(c.updated_at)),
    [filteredConversations, timeWindow]
  );

  const kpis = useMemo(() => {
    const total = windowConversations.length;
    const active = windowConversations.filter(c => c.is_active).length;
    const avgMsgs = total
      ? (
          windowConversations.reduce((sum, c) => sum + (c.message_count || 0), 0) /
          total
        ).toFixed(1)
      : (baseAnalytics.average_messages_per_conversation || 0).toFixed?.(1) || baseAnalytics.average_messages_per_conversation || '0.0';
    const totalMsgs = windowConversations.reduce((sum, c) => sum + (c.message_count || 0), 0);
    return { total, active, avgMsgs, totalMsgs };
  }, [windowConversations, baseAnalytics]);

  // Agent distribution within window
  const agentDistribution = useMemo(() => {
    const map = {};
    windowConversations.forEach(c => {
      map[c.detected_agent] = (map[c.detected_agent] || 0) + 1;
    });
    return map;
  }, [windowConversations]);

  // Build daily series for the selected timeframe
  const dailySeries = useMemo(() => {
    const days = [];
    const date = new Date(timeWindow.end);
    // Build inclusive list of days backwards
    for (let i = 0; i < timeWindow.days; i++) {
      const d = new Date(date.getFullYear(), date.getMonth(), date.getDate());
      d.setDate(d.getDate() - (timeWindow.days - 1 - i));
      days.push(d);
    }

    // Count per day and compute active rate per day
    const byDay = days.map(d => {
      const start = new Date(d.getFullYear(), d.getMonth(), d.getDate());
      const end = new Date(start);
      end.setDate(end.getDate() + 1);
      const items = flatConversations.filter(c => {
        const t = new Date(c.updated_at);
        return t >= start && t < end;
      });
      const total = items.length;
      const active = items.filter(c => c.is_active).length;
      const rate = total ? Math.round((active * 100) / total) : 0;
      return {
        date: start.toISOString(),
        total,
        activeRate: rate,
      };
    });

    return byDay;
  }, [flatConversations, timeWindow]);

  // Conversations by hour (0-23) within window
  const byHour = useMemo(() => {
    const hours = {};
    for (let h = 0; h < 24; h++) {
      const key = `${h.toString().padStart(2, '0')}:00`;
      hours[key] = 0;
    }
    windowConversations.forEach(c => {
      const t = new Date(c.updated_at);
      const key = `${t.getHours().toString().padStart(2, '0')}:00`;
      hours[key] = (hours[key] || 0) + 1;
    });
    return hours;
  }, [windowConversations]);

  // Status distribution
  const statusDistribution = useMemo(() => {
    const active = windowConversations.filter(c => c.is_active).length;
    const inactive = windowConversations.length - active;
    // Use keys that AppleStyleCharts recognizes plus our custom ones (we added mapping)
    return { active, inactive };
  }, [windowConversations]);

  // Duration buckets by message_count
  const durationBuckets = useMemo(() => {
    const counts = { 'Short (<10)': 0, 'Medium (10-30)': 0, 'Long (31-60)': 0, 'Very Long (60+)': 0 };
    if (windowConversations.length === 0) return counts;
    windowConversations.forEach(c => {
      const m = c.message_count || 0;
      if (m < 10) counts['Short (<10)'] += 1;
      else if (m <= 30) counts['Medium (10-30)'] += 1;
      else if (m <= 60) counts['Long (31-60)'] += 1;
      else counts['Very Long (60+)'] += 1;
    });
    // convert to percentage for nicer display
    const total = windowConversations.length;
    return Object.fromEntries(
      Object.entries(counts).map(([k, v]) => [k, Math.round((v * 100) / total)])
    );
  }, [windowConversations]);

  // Compose datasets for charts
  const conversationTrend = useMemo(
    () => dailySeries.map(d => ({ date: d.date, value: d.total })),
    [dailySeries]
  );
  const activeRateTrend = useMemo(
    () => dailySeries.map(d => ({ date: d.date, value: d.activeRate })),
    [dailySeries]
  );

  return (
    <div className="space-y-1 md:space-y-6">
      {/* Controls */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <h2 className="text-xl font-semibold text-gray-900">Overview</h2>
          <p className="text-sm text-gray-600">High-level conversation activity and patterns</p>
        </div>
        <div className="flex items-center gap-3 flex-wrap">
          {/* Agent Filter */}
          <div className="min-w-[200px]">
            <select
              aria-label="Filter by agent type"
              className="px-3 py-2 text-sm bg-beige border-accent border-accent-top border-accent-left border-accent-right"
              value={agentFilter}
              onChange={(e) => setAgentFilter(e.target.value)}
            >
              <option value="">All Agents</option>
              {(agentTypes || []).map((a) => (
                <option key={a.agent_type} value={a.agent_type}>
                  {a.agent_type} ({a.count})
                </option>
              ))}
            </select>
          </div>
          {/* Timeframe selector */}
          <div className="flex bg-beige border-accent border-accent-top border-accent-left border-accent-right p-1 overflow-x-auto no-scrollbar rounded">
            {['24h','7d','30d','90d'].map(tf => (
              <button
                key={tf}
                onClick={() => setTimeframe(tf)}
                className={`px-2 md:px-3 py-1 text-xs md:text-sm font-medium whitespace-nowrap transition-colors ${
                  timeframe === tf
                    ? 'bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-900'
                    : 'text-gray-600 hover:text-gray-900'
                }`}
                aria-pressed={timeframe === tf}
              >
                {tf}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 ">
        <MetricCard
          title="Total Conversations"
          value={kpis.total || baseAnalytics.total_conversations || 0}
          subtitle={`Last ${timeframe}`}
          trend={{ direction: 'up', value: '+12%', period: 'vs prior period' }}
          icon={<MessageCircle className="w-6 h-6" />}
          color="blue"
        />
        <MetricCard
          title="Active Conversations"
          value={kpis.active || baseAnalytics.active_conversations || 0}
          subtitle="Currently active"
          trend={{ direction: 'up', value: '+2.3%', period: 'vs last week' }}
          icon={<CheckCircle className="w-6 h-6" />}
          color="green"
        />
        <MetricCard
          title="Avg Messages"
          value={kpis.avgMsgs}
          subtitle="Per conversation"
          icon={<TrendingUp className="w-6 h-6" />}
          color="purple"
        />
        <MetricCard
          title="Total Messages"
          value={kpis.totalMsgs || baseAnalytics.total_messages || 0}
          subtitle="All conversations"
          trend={{ direction: 'up', value: '+15%', period: 'vs last week' }}
          icon={<MessageCircle className="w-6 h-6" />}
          color="orange"
        />
      </div>

      {/* Empty state when no data in window */}
      {windowConversations.length === 0 ? (
        <div className="bg-beige border-accent border-accent-top border-accent-left border-accent-right p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Not enough activity</h3>
          <p className="text-gray-600 mb-4">Try expanding the timeframe or switching agent type.</p>
          <button
            onClick={() => {
              const setTab = window.__setMetricsActiveTab;
              if (typeof setTab === 'function') setTab('conversations');
            }}
            className="px-4 py-2 text-sm bg-beige hover:bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC]"
          >
            Go to Conversations
          </button>
        </div>
      ) : null}

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-beige p-6 border-accent border-accent-top border-accent-left border-accent-right">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">Trend: Conversations & Active %</h3>
            <span className="text-xs text-gray-500">Last {timeframe}</span>
          </div>
          <CombinedTrendChart 
            countsData={conversationTrend.map(d => ({ ...d, label: new Date(d.date).toLocaleDateString('en-US', timeWindow.days <= 7 ? { weekday: 'short' } : { month: 'short', day: 'numeric' }) }))}
            rateData={activeRateTrend.map(d => ({ ...d, label: new Date(d.date).toLocaleDateString('en-US', timeWindow.days <= 7 ? { weekday: 'short' } : { month: 'short', day: 'numeric' }) }))}
          />
        </div>

        <div className="bg-beige p-6 border-accent border-accent-top border-accent-left border-accent-right">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">Top Agent Types</h3>
            <span className="text-xs text-gray-500">by conversations</span>
          </div>
          <AgentDistributionChart data={agentDistribution} />
        </div>

        <div className="bg-beige p-6 border-accent border-accent-top border-accent-left border-accent-right">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">Conversations by Hour</h3>
            <span className="text-xs text-gray-500">Radial distribution</span>
          </div>
          <CallsByHourPolarChart data={byHour} />
        </div>

        <div className="bg-beige p-6 border-accent border-accent-top border-accent-left border-accent-right">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">Conversation Status</h3>
            <span className="text-xs text-gray-500">Active vs inactive</span>
          </div>
          <CallStatusDistribution data={statusDistribution} />
          <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600">
            <div className="flex items-center justify-between"><span>Active</span><span className="font-medium">{statusDistribution.active}</span></div>
            <div className="flex items-center justify-between"><span>Inactive</span><span className="font-medium">{statusDistribution.inactive}</span></div>
          </div>
        </div>
      </div>

      {/* Duration distribution */}
      <div className="grid grid-cols-1 gap-6">
        <div className="bg-beige p-6 border-accent border-accent-top border-accent-left border-accent-right">
          <div className="flex items-center justify-between mb-2">
            <h3 className="text-lg font-semibold text-gray-900">Conversation Length Mix</h3>
            <span className="text-xs text-gray-500">by messages per conversation</span>
          </div>
          <ConversationDurationChart data={durationBuckets} />
        </div>
      </div>

      {/* Quick Links / Export */}
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
              <span className="text-xs text-gray-600">{baseAnalytics.total_conversations || 0} total</span>
            </button>
            <button
              onClick={() => exportOverviewCSV({ conversationTrend, activeRateTrend, byHour, statusDistribution, durationBuckets, timeframe, agentFilter })}
              className="w-full flex items-center justify-between p-3 hover:bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] transition-colors"
            >
              <div className="flex items-center space-x-3">
                <TrendingUp className="w-5 h-5 text-gray-600" />
                <span className="text-sm font-medium text-gray-600">Export Overview (CSV)</span>
              </div>
              <span className="text-xs text-gray-600">{timeframe}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

// Client-side CSV export for current overview datasets
function exportOverviewCSV({ conversationTrend, activeRateTrend, byHour, statusDistribution, durationBuckets, timeframe, agentFilter }) {
  const esc = (v) => `"${String(v).replace(/"/g, '""')}"`;
  const sections = [];

  // Conversations Trend
  sections.push(['Conversations Trend']);
  sections.push(['Date', 'Count']);
  conversationTrend.forEach(d => {
    sections.push([new Date(d.date).toISOString().slice(0,10), d.value]);
  });
  sections.push([]);

  // Active Rate
  sections.push(['Active Rate']);
  sections.push(['Date', 'Active %']);
  activeRateTrend.forEach(d => {
    sections.push([new Date(d.date).toISOString().slice(0,10), d.value]);
  });
  sections.push([]);

  // By Hour
  sections.push(['Conversations by Hour']);
  sections.push(['Hour', 'Count']);
  Object.entries(byHour).forEach(([h, v]) => sections.push([h, v]));
  sections.push([]);

  // Status
  sections.push(['Status Distribution']);
  sections.push(['Status', 'Count']);
  Object.entries(statusDistribution).forEach(([k, v]) => sections.push([k, v]));
  sections.push([]);

  // Length Mix
  sections.push(['Conversation Length Mix']);
  sections.push(['Bucket', 'Percent']);
  Object.entries(durationBuckets).forEach(([k, v]) => sections.push([k, v]));

  const csv = sections.map(row => row.map(esc).join(',')).join('\n');
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  const stamp = new Date().toISOString().replace(/[:T]/g, '-').slice(0,19);
  a.download = `metrics-overview_${timeframe}${agentFilter ? '_' + agentFilter : ''}_${stamp}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}
