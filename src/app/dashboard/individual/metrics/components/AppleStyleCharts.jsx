'use client';
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  BarElement,
  ArcElement,
  RadialLinearScale,
  Title, 
  Tooltip, 
  Legend,
  Filler 
} from 'chart.js';
import { Line, Bar, Doughnut, PolarArea } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  RadialLinearScale,
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

export function CallVolumeChart({ data }) {
  const chartData = {
    labels: data?.map(d => d.label ?? new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' })) || [],
    datasets: [{
      data: data?.map(d => d.value) || [],
      borderColor: colors.blue,
      backgroundColor: `${colors.blue}20`,
      borderWidth: 3,
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 6,
      pointHoverBackgroundColor: colors.blue,
      pointHoverBorderColor: '#fff',
      pointHoverBorderWidth: 2
    }]
  };

  return (
    <div className="h-48">
      <Line data={chartData} options={chartOptions} />
    </div>
  );
}

export function SuccessRateChart({ data }) {
  const chartData = {
    labels: data?.map(d => d.label ?? new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' })) || [],
    datasets: [{
      data: data?.map(d => d.value) || [],
      borderColor: colors.green,
      backgroundColor: `${colors.green}20`,
      borderWidth: 3,
      fill: true,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 6,
      pointHoverBackgroundColor: colors.green,
      pointHoverBorderColor: '#fff',
      pointHoverBorderWidth: 2
    }]
  };

  const values = chartData.datasets[0].data;
  const minVal = values.length ? Math.min(...values) : 0;
  const maxVal = values.length ? Math.max(...values) : 100;
  const pad = 5;
  const yMin = Math.max(0, Math.floor((minVal - pad))); 
  const yMax = Math.min(100, Math.ceil((maxVal + pad)) || 100);

  return (
    <div className="h-48">
      <Line data={chartData} options={{
        ...chartOptions,
        scales: {
          ...chartOptions.scales,
          y: {
            ...chartOptions.scales.y,
            min: yMin,
            max: yMax,
            ticks: {
              ...chartOptions.scales.y.ticks,
              callback: function(value) {
                return value + '%';
              }
            }
          }
        }
      }} />
    </div>
  );
}

export function CallsByHourChart({ data }) {
  const hours = Array.from({length: 24}, (_, i) => `${i.toString().padStart(2, '0')}:00`);
  const chartData = {
    labels: hours,
    datasets: [{
      data: hours.map(hour => data?.[hour] || 0),
      backgroundColor: colors.blue,
      borderRadius: 4,
      borderSkipped: false,
    }]
  };

  return (
    <div className="h-48">
      <Bar data={chartData} options={{
        ...chartOptions,
        scales: {
          ...chartOptions.scales,
          x: {
            ...chartOptions.scales.x,
            ticks: {
              ...chartOptions.scales.x.ticks,
              maxTicksLimit: 8
            }
          }
        }
      }} />
    </div>
  );
}

export function CallStatusDistribution({ data }) {
  const statusColors = {
    completed: colors.green,
    failed: colors.red,
    pending: colors.orange,
    cancelled: colors.gray,
    // Added support for conversation overview
    active: colors.green,
    inactive: colors.gray,
  };

  const chartData = {
    labels: Object.keys(data || {}),
    datasets: [{
      data: Object.values(data || {}),
      backgroundColor: Object.keys(data || {}).map(status => statusColors[status] || colors.gray),
      borderWidth: 0,
      cutout: '70%'
    }]
  };

  // Center text plugin to display % active
  const total = (Object.values(data || {}).reduce((a, b) => a + b, 0)) || 0;
  const activeCount = data?.active ?? data?.completed ?? 0;
  const pct = total ? Math.round((activeCount * 100) / total) : 0;
  const centerText = {
    id: 'centerText',
    beforeDraw(chart, args, options) {
      const { ctx, chartArea: { width, height } } = chart;
      ctx.save();
      ctx.font = 'bold 16px -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif';
      ctx.fillStyle = '#111827';
      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';
      ctx.fillText(`${pct}%`, width / 2, height / 2);
      ctx.restore();
    }
  };

  return (
    <div className="h-48 flex items-center justify-center">
      <Doughnut data={chartData} options={{
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
            cornerRadius: 8,
            callbacks: {
              label: function(context) {
                const total = context.dataset.data.reduce((a, b) => a + b, 0);
                const percentage = ((context.parsed * 100) / total).toFixed(1);
                return `${context.label}: ${percentage}%`;
              }
            }
          }
        }
      }} plugins={[centerText]} />
    </div>
  );
}

export function ConversationDurationChart({ data }) {
  const chartData = {
    labels: Object.keys(data || {}),
    datasets: [{
      data: Object.values(data || {}),
      backgroundColor: [colors.blue, colors.green, colors.orange, colors.purple],
      borderRadius: 6,
      borderSkipped: false,
    }]
  };

  return (
    <div className="h-48">
      <Bar data={chartData} options={{
        ...chartOptions,
        indexAxis: 'y',
        scales: {
          x: {
            ...chartOptions.scales.x,
            ticks: {
              ...chartOptions.scales.x.ticks,
              callback: function(value) {
                return value + '%';
              }
            }
          },
          y: {
            ...chartOptions.scales.y,
            grid: {
              display: false
            }
          }
        }
      }} />
    </div>
  );
}

// Combined line chart: counts vs active rate with dual y-axes
export function CombinedTrendChart({ countsData, rateData }) {
  const labels = countsData?.map(d => d.label ?? new Date(d.date).toLocaleDateString('en-US', { weekday: 'short' })) || [];
  const counts = countsData?.map(d => d.value) || [];
  const rate = rateData?.map(d => d.value) || [];

  const chartData = {
    labels,
    datasets: [
      {
        type: 'line',
        label: 'Conversations',
        data: counts,
        borderColor: colors.blue,
        backgroundColor: `${colors.blue}20`,
        borderWidth: 3,
        tension: 0.4,
        pointRadius: 0,
        yAxisID: 'y',
        fill: true,
      },
      {
        type: 'line',
        label: 'Active %',
        data: rate,
        borderColor: colors.green,
        backgroundColor: `${colors.green}20`,
        borderWidth: 3,
        tension: 0.4,
        pointRadius: 0,
        yAxisID: 'y1',
        fill: true,
      }
    ]
  };

  // Dynamic bounds for %
  const minRate = rate.length ? Math.min(...rate) : 0;
  const maxRate = rate.length ? Math.max(...rate) : 100;
  const pad = 5;

  return (
    <div className="h-48">
      <Line data={chartData} options={{
        ...chartOptions,
        plugins: {
          ...chartOptions.plugins,
          legend: { display: true }
        },
        scales: {
          x: { ...chartOptions.scales.x },
          y: {
            ...chartOptions.scales.y,
            title: { display: true, text: 'Conversations', color: colors.gray },
            ticks: { ...chartOptions.scales.y.ticks }
          },
          y1: {
            type: 'linear',
            position: 'right',
            grid: { drawOnChartArea: false },
            min: Math.max(0, Math.floor(minRate - pad)),
            max: Math.min(100, Math.ceil(maxRate + pad) || 100),
            ticks: {
              color: colors.gray,
              callback: (v) => `${v}%`
            },
            title: { display: true, text: 'Active %', color: colors.gray }
          }
        }
      }} />
    </div>
  );
}

// Horizontal bar chart of counts by agent type
export function AgentDistributionChart({ data }) {
  const entries = Object.entries(data || {}).sort((a, b) => b[1] - a[1]);
  const labels = entries.map(([k]) => k);
  const values = entries.map(([, v]) => v);
  const palette = [colors.blue, colors.green, colors.orange, colors.purple, colors.pink, colors.gray];

  const chartData = {
    labels,
    datasets: [{
      data: values,
      backgroundColor: values.map((_, i) => palette[i % palette.length]),
      borderRadius: 6,
      borderSkipped: false,
    }]
  };

  return (
    <div className="h-48">
      <Bar data={chartData} options={{
        ...chartOptions,
        indexAxis: 'y',
        plugins: { ...chartOptions.plugins, legend: { display: false } },
        scales: {
          x: { ...chartOptions.scales.x, grid: { ...chartOptions.scales.x.grid, display: true } },
          y: { ...chartOptions.scales.y, grid: { display: false } }
        }
      }} />
    </div>
  );
}

// Polar area for hour-of-day distribution (engaging radial view)
export function CallsByHourPolarChart({ data }) {
  const hours = Array.from({ length: 24 }, (_, i) => `${i.toString().padStart(2, '0')}:00`);
  const values = hours.map(h => data?.[h] || 0);
  const max = values.length ? Math.max(...values) : 0;
  const bg = values.map(v => `rgba(0,122,255,${max ? (0.2 + 0.6 * (v / max)) : 0.2})`);

  const chartData = {
    labels: hours,
    datasets: [{
      data: values,
      backgroundColor: bg,
      borderWidth: 0,
    }]
  };

  return (
    <div className="h-48">
      <PolarArea data={chartData} options={{
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          r: {
            grid: { color: 'rgba(142, 142, 147, 0.2)' },
            angleLines: { color: 'rgba(142,142,147,0.2)' },
            ticks: { display: false }
          }
        },
        plugins: {
          legend: { display: false },
          tooltip: { ...chartOptions.plugins.tooltip }
        }
      }} />
    </div>
  );
}
