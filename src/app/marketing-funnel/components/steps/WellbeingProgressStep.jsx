"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import { 
  Chart as ChartJS, 
  CategoryScale, 
  LinearScale, 
  PointElement, 
  LineElement, 
  Title, 
  Tooltip, 
  Legend,
  Filler 
} from 'chart.js';
import { Line } from 'react-chartjs-2';
import { useMarketingFunnel } from "../../context/MarketingFunnelContext";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

const WellbeingProgressStep = () => {
  const { data, actions } = useMarketingFunnel();
  const [lineData, setLineData] = useState([25, null, null, null, null]);
  const [animationComplete, setAnimationComplete] = useState(false);
  const chartRef = useRef();

  // Custom plugin for enhanced visuals
  const wellbeingProgressPlugin = {
    id: 'wellbeing-progress',
    beforeDatasetsDraw(chart) {
      const { ctx, chartArea } = chart;
      if (!chartArea) return;

      // Dynamic gradient fill under the line
      const grad = ctx.createLinearGradient(0, chartArea.bottom, 0, chartArea.top);
      grad.addColorStop(0, 'rgba(34, 197, 94, 0.02)');
      grad.addColorStop(0.5, 'rgba(34, 197, 94, 0.15)');
      grad.addColorStop(1, 'rgba(34, 197, 94, 0.3)');
      
      if (chart.data && chart.data.datasets && chart.data.datasets[0]) {
        chart.data.datasets[0].backgroundColor = grad;
      }
    },
    afterDatasetsDraw(chart) {
      const { ctx } = chart;
      const meta = chart.getDatasetMeta(0);
      if (!meta || !meta.dataset) return;

      // Glow effect on the line
      ctx.save();
      ctx.shadowColor = 'rgba(34, 197, 94, 0.4)';
      ctx.shadowBlur = 8;
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#22C55E';
      meta.dataset.draw(ctx);
      ctx.restore();

      // Pulsing markers on visible points
      const points = meta.data || [];
      const visible = points.filter(p => !p.skip);
      if (visible.length === 0) return;

      const time = Date.now();
      const pulse = 1 + 0.1 * Math.sin(time / 300);

      visible.forEach((pt, index) => {
        ctx.save();
        ctx.fillStyle = '#22C55E';
        ctx.strokeStyle = 'rgba(34, 197, 94, 0.3)';
        ctx.lineWidth = 2;
        
        // Solid core
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, 6, 0, Math.PI * 2);
        ctx.fill();
        
        // Pulse ring
        if (index === 0 || index === visible.length - 1) {
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 6 * pulse + 3, 0, Math.PI * 2);
          ctx.stroke();
        }
        ctx.restore();
      });
    }
  };

  // Progressive line animation from bottom to top
  useEffect(() => {
    const target = [25, 45, 65, 80, 90]; // Progress from 25% to 90% over 4 weeks
    let i = 1;
    const startDelay = 800;
    const stepDelay = 600;

    const timers = [];
    timers.push(setTimeout(function step() {
      setLineData(prev => {
        const next = [...prev];
        next[i] = target[i];
        return next;
      });
      i += 1;
      if (i < target.length) {
        timers.push(setTimeout(step, stepDelay));
      } else {
        timers.push(setTimeout(() => setAnimationComplete(true), 800));
      }
    }, startDelay));

    return () => {
      timers.forEach(t => clearTimeout(t));
    };
  }, []);

  const handleContinue = () => {
    actions.nextStep();
  };

  // Get user's name from email if available
  const getUserName = () => {
    if (data.email) {
      const name = data.email.split('@')[0];
      return name.charAt(0).toUpperCase() + name.slice(1);
    }
    return 'Your';
  };

  const getChartData = () => ({
    labels: ['Now', 'Week 1', 'Week 2', 'Week 3', 'Week 4'],
    datasets: [
      {
        label: 'Well-being Level',
        data: lineData,
        borderColor: '#22C55E',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        borderWidth: 4,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#22C55E',
        pointBorderColor: '#fff',
        pointBorderWidth: 3,
        pointRadius: 8,
        pointHoverRadius: 10,
        pointHitRadius: 15,
        spanGaps: true,
      }
    ]
  });

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
        cornerRadius: 8,
        displayColors: false,
        callbacks: {
          label: function(context) {
            return `Well-being: ${context.parsed.y}%`;
          }
        }
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
          color: '#6B7280',
          font: {
            size: 13,
            weight: '500'
          }
        }
      },
      y: {
        min: 0,
        max: 100,
        grid: {
          color: 'rgba(107, 114, 128, 0.1)',
          borderDash: [3, 3]
        },
        border: {
          display: false
        },
        ticks: {
          color: '#6B7280',
          font: {
            size: 12
          },
          callback: function(value) {
            return value + '%';
          }
        }
      }
    },
    animations: {
      y: {
        duration: 1000,
        easing: 'easeOutQuart'
      },
      x: { duration: 0 }
    }
  };

  return (
    <div className="text-center space-y-8">
      {/* Header with personalized greeting */}
      <div className="space-y-4">
        <motion.h2 
          className="text-xl font-medium text-gray-900"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {getUserName()}, your 4-week personal<br />
          <span className="text-green-600">Mental Wellness Reset plan</span><br />
          is ready!
        </motion.h2>
      </div>

      {/* Chart section */}
      <motion.div 
        className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        <div className="mb-4">
          <h3 className="text-lg font-semibold text-gray-900 mb-2">Your well-being</h3>
        </div>
        
        <div className="h-80 mb-4">
          <Line data={getChartData()} options={chartOptions} ref={chartRef} plugins={[wellbeingProgressPlugin]} />
        </div>

        {/* Chart disclaimer */}
        <p className="text-xs text-gray-400 italic">
          * Chart is for illustrational purposes only. Individual results may vary.
        </p>
      </motion.div>

    
     

      {/* Continue button */}
      <motion.div 
        className="flex justify-center pt-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 1.2 }}
      >
        <button
          onClick={handleContinue}
          className="bg-gradient-to-r from-[#E6D3E7] via-[#F6D9D5] to-[#D6E3EC] text-gray-800 px-8 py-3 rounded-none hover:shadow-lg transition-all duration-200 text-sm font-semibold"
        >
          {animationComplete ? "Continue" : "Building your plan..."}
        </button>
      </motion.div>
    </div>
  );
};

export default WellbeingProgressStep;