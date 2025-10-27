'use client';
import { useState, useEffect } from 'react';
import { useAgentMetrics } from '../../../../../store/hooks';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

// Apple-style color palette
const colors = {
  blue: '#007AFF',
  green: '#34C759',
  orange: '#FF9500',
  red: '#FF3B30',
  purple: '#AF52DE',
  pink: '#FF2D92',
  gray: '#8E8E93',
  lightGray: '#F2F2F7'
};

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false
    },
    tooltip: {
      backgroundColor: 'rgba(0,0,0,0.8)',
      titleColor: '#fff',
      bodyColor: '#fff',
      borderColor: colors.gray,
      borderWidth: 1,
      cornerRadius: 8,
      displayColors: false
    }
  },
  scales: {
    x: {
      grid: {
        display: false
      },
      border: {
        display: false
      },
      ticks: {
        color: colors.gray,
        font: {
          family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          size: 12
        }
      }
    },
    y: {
      grid: {
        color: 'rgba(142, 142, 147, 0.2)',
        drawBorder: false
      },
      border: {
        display: false
      },
      ticks: {
        color: colors.gray,
        font: {
          family: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif',
          size: 12
        }
      }
    }
  }
};

export default function AgentGoalCharts({ agentMetrics, selectedGoal, selectedAgent, timeframe }) {
  const { fetchGoalProgressData } = useAgentMetrics();
  const [goalProgressData, setGoalProgressData] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (selectedGoal && selectedAgent) {
      loadGoalProgressData();
    }
  }, [selectedGoal, selectedAgent, timeframe]);

  const loadGoalProgressData = async () => {
    setLoading(true);
    try {
      const data = await fetchGoalProgressData(selectedAgent, selectedGoal.goal_id, timeframe);
      setGoalProgressData(data);
    } catch (error) {
      console.error('Failed to load goal progress data:', error);
    } finally {
      setLoading(false);
    }
  };

  if (!agentMetrics) {
    return (
      <div className="bg-beige border-accent border-accent-top border-accent-left border-accent-right p-6">
        <h3 className="text-lg font-semibold text-gray-900 mb-4">Goal Analytics</h3>
        <p className="text-gray-500">No data available</p>
      </div>
    );
  }

  // Prepare overview charts data
  const prepareGoalStatusData = () => {
    const statusCounts = { active: 0, completed: 0, paused: 0 };
    
    agentMetrics.agents.forEach(agent => {
      agent.goals.forEach(goal => {
        statusCounts[goal.status] = (statusCounts[goal.status] || 0) + 1;
      });
    });

    return {
      labels: ['Active', 'Completed', 'Paused'],
      datasets: [{
        data: [statusCounts.active, statusCounts.completed, statusCounts.paused || 0],
        backgroundColor: [colors.blue, colors.green, colors.orange],
        borderWidth: 0,
      }]
    };
  };

  const prepareStreakData = () => {
    const streakData = [];
    const labels = [];

    agentMetrics.agents.forEach((agent) => {
      agent.goals.forEach((goal) => {
        labels.push(`${goal.title.substring(0, 15)}...`);
        streakData.push(goal.streak);
      });
    });

    return {
      labels: labels.slice(0, 10), // Show top 10 goals
      datasets: [{
        data: streakData.slice(0, 10),
        backgroundColor: colors.purple,
        borderRadius: 4,
      }]
    };
  };

  const prepareProgressData = () => {
    if (!goalProgressData?.progress_data) return null;

    const sortedData = goalProgressData.progress_data.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    return {
      labels: sortedData.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
      datasets: [{
        label: 'Progress %',
        data: sortedData.map(d => d.progress),
        borderColor: colors.blue,
        backgroundColor: `${colors.blue}20`,
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: colors.blue,
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }]
    };
  };

  const prepareMoodTrendData = () => {
    if (!goalProgressData?.mood_trend) return null;

    const sortedData = goalProgressData.mood_trend.sort((a, b) => new Date(a.date) - new Date(b.date));
    
    return {
      labels: sortedData.map(d => new Date(d.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
      datasets: [{
        label: 'Stress Level',
        data: sortedData.map(d => d.stress_level),
        borderColor: colors.pink,
        backgroundColor: `${colors.pink}20`,
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointRadius: 4,
        pointHoverRadius: 6,
        pointBackgroundColor: colors.pink,
        pointBorderColor: '#fff',
        pointBorderWidth: 2
      }]
    };
  };

  const prepareCheckInFrequencyData = () => {
    if (!goalProgressData?.check_in_frequency) return null;

    const dates = Object.keys(goalProgressData.check_in_frequency).sort();
    const counts = dates.map(date => goalProgressData.check_in_frequency[date]);

    return {
      labels: dates.map(date => new Date(date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })),
      datasets: [{
        label: 'Check-ins',
        data: counts,
        backgroundColor: colors.green,
        borderRadius: 4,
      }]
    };
  };

  return (
    <div className="space-y-6">
      {/* Overview Charts */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Goal Status Distribution */}
        <div className="bg-beige border-accent border-accent-top border-accent-left border-accent-right p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Goal Status Distribution</h4>
          <div className="h-48">
            <Doughnut 
              data={prepareGoalStatusData()} 
              options={{
                ...chartOptions,
                plugins: {
                  ...chartOptions.plugins,
                  legend: {
                    display: true,
                    position: 'bottom'
                  }
                }
              }} 
            />
          </div>
        </div>

        {/* Streak Performance */}
        <div className="bg-beige border-accent border-accent-top border-accent-left border-accent-right p-6">
          <h4 className="text-lg font-semibold text-gray-900 mb-4">Current Streaks</h4>
          <div className="h-48">
            <Bar 
              data={prepareStreakData()} 
              options={{
                ...chartOptions,
                scales: {
                  ...chartOptions.scales,
                  y: {
                    ...chartOptions.scales.y,
                    beginAtZero: true,
                    ticks: {
                      ...chartOptions.scales.y.ticks,
                      callback: function(value) {
                        return value + ' days';
                      }
                    }
                  }
                }
              }} 
            />
          </div>
        </div>
      </div>

      {/* Detailed Goal Analysis */}
      {selectedGoal ? (
        <div className="bg-beige border-accent border-accent-top border-accent-left border-accent-right p-6">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h4 className="text-lg font-semibold text-gray-900">
                {selectedGoal.title} - Detailed Analysis
              </h4>
              <p className="text-sm text-gray-600 mt-1">
                Progress tracking and insights for the selected goal
              </p>
            </div>
            {loading && (
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            )}
          </div>

          {goalProgressData ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Progress Over Time */}
              {goalProgressData.progress_data?.length > 0 && (
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Progress Over Time</h5>
                  <div className="h-48">
                    <Line 
                      data={prepareProgressData()} 
                      options={{
                        ...chartOptions,
                        scales: {
                          ...chartOptions.scales,
                          y: {
                            ...chartOptions.scales.y,
                            min: 0,
                            max: 100,
                            ticks: {
                              ...chartOptions.scales.y.ticks,
                              callback: function(value) {
                                return value + '%';
                              }
                            }
                          }
                        }
                      }} 
                    />
                  </div>
                </div>
              )}

              {/* Mood Trend */}
              {goalProgressData.mood_trend?.length > 0 && (
                <div>
                  <h5 className="font-medium text-gray-900 mb-3">Mood Trend</h5>
                  <div className="h-48">
                    <Line 
                      data={prepareMoodTrendData()} 
                      options={{
                        ...chartOptions,
                        scales: {
                          ...chartOptions.scales,
                          y: {
                            ...chartOptions.scales.y,
                            min: 1,
                            max: 5,
                            ticks: {
                              ...chartOptions.scales.y.ticks,
                              stepSize: 1
                            }
                          }
                        }
                      }} 
                    />
                  </div>
                </div>
              )}

              {/* Check-in Frequency */}
              {Object.keys(goalProgressData.check_in_frequency || {}).length > 0 && (
                <div className="lg:col-span-2">
                  <h5 className="font-medium text-gray-900 mb-3">Check-in Frequency</h5>
                  <div className="h-48">
                    <Bar 
                      data={prepareCheckInFrequencyData()} 
                      options={{
                        ...chartOptions,
                        scales: {
                          ...chartOptions.scales,
                          y: {
                            ...chartOptions.scales.y,
                            beginAtZero: true,
                            ticks: {
                              ...chartOptions.scales.y.ticks,
                              stepSize: 1
                            }
                          }
                        }
                      }} 
                    />
                  </div>
                </div>
              )}
            </div>
          ) : (
            <div className="text-center py-8">
              <p className="text-gray-500">
                {loading ? 'Loading goal analytics...' : 'No detailed data available for this goal'}
              </p>
            </div>
          )}
        </div>
      ) : (
        <div className="bg-beige border-accent border-accent-top border-accent-left border-accent-right p-8">
          <div className="text-center">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-100 to-indigo-200 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-8 h-8 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <h4 className="text-lg font-semibold text-gray-900 mb-2">Ready for Detailed Analysis</h4>
            <p className="text-gray-600 mb-6">
              Select a goal from the list on the left to view:
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-left max-w-md mx-auto">
              <div className="flex items-center space-x-3 p-3 bg-blue-50 rounded-lg">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
                </svg>
                <span className="text-sm font-medium text-blue-800">Progress Tracking</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-green-50 rounded-lg">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
                <span className="text-sm font-medium text-green-800">Check-in Patterns</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-pink-50 rounded-lg">
                <svg className="w-5 h-5 text-pink-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span className="text-sm font-medium text-pink-800">Mood Trends</span>
              </div>
              <div className="flex items-center space-x-3 p-3 bg-orange-50 rounded-lg">
                <svg className="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 18.657A8 8 0 016.343 7.343S7 9 9 10c0-2 .5-5 2.986-7C14 5 16.09 5.777 17.656 7.343A7.975 7.975 0 0120 13a7.975 7.975 0 01-2.343 5.657z" />
                </svg>
                <span className="text-sm font-medium text-orange-800">Streak Analytics</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
