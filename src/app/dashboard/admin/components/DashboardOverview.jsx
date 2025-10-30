'use client';

import { useState } from 'react';
import StatCard from './StatCard';
import AgentUsageChart from './AgentUsageChart';
import RevenueChart from './RevenueChart';
import SystemHealthPanel from './SystemHealthPanel';
import RecentActivityFeed from './RecentActivityFeed';
import SubscriptionBreakdown from './SubscriptionBreakdown';

export default function DashboardOverview({ data, lastUpdated, onRefresh }) {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = async () => {
    setRefreshing(true);
    await onRefresh();
    setTimeout(() => setRefreshing(false), 500);
  };

  if (!data) return null;

  const {
    user_stats,
    conversation_stats,
    subscription_stats,
    revenue_metrics,
    agent_usage_stats,
    system_health,
    recent_activity,
  } = data;

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900 tracking-tight">Dashboard Overview</h1>
          <p className="text-sm text-gray-500 mt-1">
            Platform health and key performance indicators
          </p>
        </div>
        <div className="flex items-center gap-4">
          {lastUpdated && (
            <p className="text-xs text-gray-500">
              Last updated: {lastUpdated.toLocaleTimeString()}
            </p>
          )}
          <button
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <svg
              className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
              />
            </svg>
            <span className="text-sm font-medium">Refresh</span>
          </button>
        </div>
      </div>

      {/* System Health Alert */}
      {system_health?.overall_status !== 'healthy' && (
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <div className="flex items-start gap-3">
            <svg className="w-5 h-5 text-yellow-600 mt-0.5" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            <div>
              <h3 className="text-sm font-semibold text-yellow-800">System Health Warning</h3>
              <p className="text-sm text-yellow-700 mt-1">Some services are experiencing issues. Check system health panel below.</p>
            </div>
          </div>
        </div>
      )}

      {/* Key Metrics Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {/* User Stats */}
        <StatCard
          title="Total Users"
          value={user_stats.total_users.toLocaleString()}
          icon="👥"
          trend={user_stats.newly_registered_week > 0 ? 'up' : 'neutral'}
          subtitle={`${user_stats.newly_registered_week} new this week`}
          details={[
            { label: 'Active', value: user_stats.active_users },
            { label: 'Inactive', value: user_stats.inactive_users },
            { label: 'New Today', value: user_stats.newly_registered_today },
          ]}
        />

        {/* Conversation Stats */}
        <StatCard
          title="Total Conversations"
          value={conversation_stats.total_conversations.toLocaleString()}
          icon="💬"
          trend="up"
          subtitle={`${conversation_stats.conversations_today} today`}
          details={[
            { label: 'This Week', value: conversation_stats.conversations_week },
            { label: 'This Month', value: conversation_stats.conversations_month },
            { label: 'Avg Messages', value: conversation_stats.avg_messages_per_conversation },
          ]}
        />

        {/* Active Subscriptions */}
        <StatCard
          title="Active Subscriptions"
          value={subscription_stats.total_active_subscriptions.toLocaleString()}
          icon="📊"
          trend={subscription_stats.pending_subscriptions > 0 ? 'up' : 'neutral'}
          subtitle={`${subscription_stats.pending_subscriptions} pending`}
          details={[
            { label: 'Cancelled (Month)', value: subscription_stats.cancelled_this_month },
          ]}
        />

        {/* MRR */}
        <StatCard
          title="Monthly Recurring Revenue"
          value={`$${revenue_metrics.mrr.toLocaleString()}`}
          icon="💰"
          trend="up"
          subtitle={`ARPU: $${revenue_metrics.arpu}`}
          details={[
            { label: 'Total Revenue', value: `$${revenue_metrics.total_revenue_all_time.toLocaleString()}` },
            { label: 'This Month', value: `$${revenue_metrics.revenue_this_month.toLocaleString()}` },
            { label: 'Failed Payments', value: revenue_metrics.failed_payments_this_month },
          ]}
        />
      </div>

      {/* Charts and Detailed Stats */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Subscription Breakdown */}
        <SubscriptionBreakdown data={subscription_stats.subscriptions_by_plan} />

        {/* Revenue Chart */}
        <RevenueChart data={revenue_metrics} />
      </div>

      {/* Agent Usage */}
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Agent Usage Statistics</h2>
        <AgentUsageChart data={agent_usage_stats.agents} />
        <div className="mt-6 grid grid-cols-2 gap-4">
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 font-medium">Most Popular</p>
            <p className="text-lg font-bold text-green-700 mt-1">
              {agent_usage_stats.most_popular_agent || 'N/A'}
            </p>
          </div>
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-sm text-gray-600 font-medium">Least Popular</p>
            <p className="text-lg font-bold text-gray-700 mt-1">
              {agent_usage_stats.least_popular_agent || 'N/A'}
            </p>
          </div>
        </div>
      </div>

      {/* System Health and Recent Activity */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <SystemHealthPanel data={system_health} />
        <RecentActivityFeed activities={recent_activity.activities} />
      </div>
    </div>
  );
}
