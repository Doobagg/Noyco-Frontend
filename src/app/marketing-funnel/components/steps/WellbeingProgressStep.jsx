












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
  const [drawProgress, setDrawProgress] = useState(0); // 0 to 4 (smooth progress)
  const [animationComplete, setAnimationComplete] = useState(false);
  const chartRef = useRef();
  const animationFrameRef = useRef();

  // Full target path
  const fullPath = [
    { x: 0, y: 25 },   // Now
    { x: 1, y: 45 },   // Week 1
    { x: 2, y: 65 },   // Week 2
    { x: 3, y: 80 },   // Week 3
    { x: 4, y: 90 }    // Week 4
  ];

  // Calculate smooth interpolated data based on draw progress
  const getInterpolatedData = () => {
    const progress = drawProgress;
    
    // Always show first point
    if (progress <= 0) {
      return [25, null, null, null, null];
    }
    
    // Determine which segment we're drawing
    const segmentIndex = Math.floor(progress);
    const segmentProgress = progress - segmentIndex;
    
    const result = [null, null, null, null, null];
    
    // Fill completed segments
    for (let i = 0; i <= segmentIndex && i < fullPath.length; i++) {
      result[i] = fullPath[i].y;
    }
    
    // Interpolate current segment
    if (segmentIndex < fullPath.length - 1 && segmentProgress > 0) {
      const currentPoint = fullPath[segmentIndex];
      const nextPoint = fullPath[segmentIndex + 1];
      
      // Linear interpolation for smooth line drawing
      const interpolatedY = currentPoint.y + (nextPoint.y - currentPoint.y) * segmentProgress;
      result[segmentIndex + 1] = interpolatedY;
    }
    
    return result;
  };

  // Custom plugin for drawing effect with moving dot
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

      // Draw points
      const points = meta.data || [];
      const time = Date.now();
      
      points.forEach((pt, index) => {
        if (!pt || pt.skip || pt.x === null || pt.y === null) return;
        
        ctx.save();
        
        const isLastVisiblePoint = (index === points.filter(p => p && !p.skip && p.x !== null && p.y !== null).length - 1);
        const isAnimating = !animationComplete;
        
        if (isLastVisiblePoint && isAnimating && drawProgress < 4) {
          // Moving dot at the leading edge while drawing
          const pulse = 1 + 0.18 * Math.sin(time / 200);
          
          // Outer glow
          ctx.shadowColor = 'rgba(34, 197, 94, 0.7)';
          ctx.shadowBlur = 18;
          ctx.strokeStyle = 'rgba(34, 197, 94, 0.35)';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 13 * pulse, 0, Math.PI * 2);
          ctx.stroke();
          
          // Middle glow
          ctx.strokeStyle = 'rgba(34, 197, 94, 0.55)';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 9 * pulse, 0, Math.PI * 2);
          ctx.stroke();
          
          // Core dot
          ctx.shadowColor = 'rgba(34, 197, 94, 0.9)';
          ctx.shadowBlur = 12;
          ctx.fillStyle = '#22C55E';
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 8, 0, Math.PI * 2);
          ctx.fill();
          
          // Bright center
          ctx.shadowBlur = 0;
          ctx.fillStyle = 'rgba(255, 255, 255, 0.95)';
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 3.5, 0, Math.PI * 2);
          ctx.fill();
          
        } else if (animationComplete && index === 4) {
          // Final static dot at 90%
          ctx.shadowColor = 'rgba(34, 197, 94, 0.5)';
          ctx.shadowBlur = 14;
          
          // Outer ring
          ctx.strokeStyle = 'rgba(34, 197, 94, 0.3)';
          ctx.lineWidth = 3;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 14, 0, Math.PI * 2);
          ctx.stroke();
          
          // Main dot
          ctx.fillStyle = '#22C55E';
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 10, 0, Math.PI * 2);
          ctx.fill();
          
          // White border
          ctx.shadowBlur = 0;
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 2.5;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 10, 0, Math.PI * 2);
          ctx.stroke();
          
          // Highlight
          ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 4, 0, Math.PI * 2);
          ctx.fill();
          
        } else if (index < Math.floor(drawProgress)) {
          // Completed points along the path
          ctx.fillStyle = '#22C55E';
          ctx.strokeStyle = '#fff';
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(pt.x, pt.y, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        }
        
        ctx.restore();
      });
    }
  };

  // Smooth drawing animation - like filling a path
  useEffect(() => {
    const totalDuration = 4000; // 4 seconds to draw the entire line
    const startDelay = 800;
    const totalSegments = 4; // 0 to 4
    
    let startTime = null;

    const animate = (timestamp) => {
      if (!startTime) startTime = timestamp;
      const elapsed = timestamp - startTime;
      const progress = Math.min(elapsed / totalDuration, 1);
      
      // Ease out for smooth deceleration
      const eased = 1 - Math.pow(1 - progress, 3);
      
      // Map to segment progress (0 to 4)
      const currentProgress = eased * totalSegments;
      setDrawProgress(currentProgress);

      if (progress < 1) {
        animationFrameRef.current = requestAnimationFrame(animate);
      } else {
        setDrawProgress(4);
        setAnimationComplete(true);
      }
    };

    const timeout = setTimeout(() => {
      animationFrameRef.current = requestAnimationFrame(animate);
    }, startDelay);

    return () => {
      clearTimeout(timeout);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
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
        data: getInterpolatedData(),
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
        spanGaps: false,
      }
    ]
  });

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    animation: false,
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
            return `Well-being: ${Math.round(context.parsed.y)}%`;
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