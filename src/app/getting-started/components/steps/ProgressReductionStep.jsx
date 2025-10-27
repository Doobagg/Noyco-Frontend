"use client";

import { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
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
import { Line } from 'react-chartjs-2';
import { useMarketingFunnel } from "../../context/MarketingFunnelContext";

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

const ProgressReductionStep = () => {
  const { actions } = useMarketingFunnel();
  const [lineData, setLineData] = useState([52.5, null, null, null, null, null]);
  const [animationComplete, setAnimationComplete] = useState(false);
  const chartRef = useRef();

  // Custom plugin: glow stroke, pulsing start/end markers, and dynamic gradient fill
  const progressLinePlugin = {
    id: 'progress-decorations',
    beforeDatasetsDraw(chart) {
      const { ctx, chartArea } = chart;
      if (!chartArea) return;

      // Dynamic gradient fill under the line
      const grad = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
      grad.addColorStop(0, 'rgba(52, 199, 89, 0.22)');
      grad.addColorStop(1, 'rgba(52, 199, 89, 0.02)');
      if (chart.data && chart.data.datasets && chart.data.datasets[0]) {
        chart.data.datasets[0].backgroundColor = grad;
      }
    },
    afterDatasetsDraw(chart) {
      const { ctx } = chart;
      const meta = chart.getDatasetMeta(0);
      if (!meta || !meta.dataset) return;

  // Glow effect by re-stroking the line with shadow
      ctx.save();
      ctx.shadowColor = 'rgba(52, 199, 89, 0.6)';
      ctx.shadowBlur = 14;
      ctx.lineWidth = 3;
      ctx.strokeStyle = '#34C759';
  // Re-draw the dataset to apply glow stroke
  meta.dataset.draw(ctx);
      ctx.restore();

      // Pulsing markers on first and last visible points
      const points = meta.data || [];
      const visible = points.filter(p => !p.skip);
      if (visible.length === 0) return;
      const startPt = visible[0];
      const endPt = visible[visible.length - 1];

      const time = Date.now();
      const pulse = 1 + 0.15 * Math.sin(time / 280);

      const drawPulse = (pt, base = 7) => {
        ctx.save();
        ctx.fillStyle = '#34C759';
        ctx.strokeStyle = 'rgba(52,199,89,0.35)';
        ctx.lineWidth = 2;
        // solid core
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, base, 0, Math.PI * 2);
        ctx.fill();
        // soft outer ring (pulse)
        ctx.beginPath();
        ctx.arc(pt.x, pt.y, base * pulse + 4, 0, Math.PI * 2);
        ctx.stroke();
        ctx.restore();
      };

      drawPulse(startPt, 8);
      if (endPt !== startPt) drawPulse(endPt, 8);
    }
  };

  // Progressively reveal the line from the first green point (52.5%) down to 12.75%
  useEffect(() => {
    const target = [52.5, 48, 40, 32, 25, 12.75];
    let i = 1;
    const startDelay = 350;
    const stepDelay = 500; // delay between revealing each subsequent point

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
        // finalize a little after the last point appears
        timers.push(setTimeout(() => setAnimationComplete(true), 600));
      }
    }, startDelay));

    return () => {
      timers.forEach(t => clearTimeout(t));
    };
  }, []);

  const handleContinue = () => {
    actions.nextStep();
  };

  // Dynamic chart data based on animated line values
  const getChartData = () => ({
    labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
    datasets: [
      {
        label: 'Symptom Intensity',
        data: lineData,
        borderColor: '#34C759',
        backgroundColor: 'rgba(52, 199, 89, 0.1)', // replaced by dynamic gradient in plugin
        borderWidth: 3,
        fill: true,
        tension: 0.4,
        pointBackgroundColor: '#34C759',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        // Make start and end marks a bit larger, others medium
        pointRadius: (ctx) => (ctx.dataIndex === 0 || ctx.dataIndex === (ctx.chart.data.labels.length - 1) ? 8 : 6),
        pointHoverRadius: (ctx) => (ctx.dataIndex === 0 || ctx.dataIndex === (ctx.chart.data.labels.length - 1) ? 10 : 8),
        pointHitRadius: 12,
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
            return `${context.parsed.y}% intensity`;
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
          color: '#8E8E93',
          font: {
            size: 12
          }
        }
      },
      y: {
        min: 0,
        max: 60,
        grid: {
          color: 'rgba(142, 142, 147, 0.2)',
          borderDash: [5, 5]
        },
        border: {
          display: false
        },
        ticks: {
          color: '#8E8E93',
          font: {
            size: 12
          },
          callback: function(value) {
            return value + '%';
          }
        }
      }
    },
    // Smooth animation for each revealed point
    animations: {
      y: {
        duration: 900,
        easing: 'easeInOutQuad'
      },
      x: { duration: 0 }
    }
  };

  return (
    <div className="text-center space-y-8">
      <div className="space-y-4">
        <motion.h2 
          className="text-xl font-medium text-gray-900"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          Your progress in just 6 weeks
        </motion.h2>
        <motion.p 
          className="text-gray-500 leading-relaxed"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          Based on your profile, here's what others with similar needs achieved
        </motion.p>
      </div>

      {/* Progress visualization */}
      <div className="space-y-6">
        {/* Weekly progress chart */}
        <motion.div 
          className="bg-white border border-gray-200 rounded-lg p-6 shadow-sm"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Weekly Progress Trajectory</h3>
          <div className="h-64">
            <Line data={getChartData()} options={chartOptions} ref={chartRef} plugins={[progressLinePlugin]} />
          </div>
        </motion.div>

        {/* Key benefits */}
       
      </div>
      <p className="text-gray-400 font-semibold text-sm leading-relaxed">*Based on the data of users who log their progress in Noyco.</p>


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
          {animationComplete ? "See my personalized plan" : "Continue"}
        </button>
      </motion.div>

    </div>
  );
};

export default ProgressReductionStep;













