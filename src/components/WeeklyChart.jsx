import React, { useRef } from 'react';
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

// Register Chart.js components
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

const WeeklyChart = ({ data }) => {
  const chartRef = useRef(null);

  const chartData = {
    labels: data.map(item => item.week),
    datasets: [
      {
        label: 'Points',
        data: data.map(item => item.points),
        borderColor: 'rgb(17,17,17)',
        backgroundColor: (context) => {
          const chart = context.chart;
          const { ctx, chartArea } = chart;
          
          if (!chartArea) {
            return null;
          }
          
          const gradient = ctx.createLinearGradient(0, chartArea.top, 0, chartArea.bottom);
          gradient.addColorStop(0, 'rgba(17,17,17,0.18)');
          gradient.addColorStop(1, 'rgba(17,17,17,0.02)');
          return gradient;
        },
        fill: true,
        tension: 0.35,
        pointRadius: 2.5,
        pointHoverRadius: 4,
        pointBackgroundColor: 'rgb(17,17,17)',
        pointBorderColor: 'rgb(17,17,17)',
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      },
      tooltip: {
        displayColors: false,
        backgroundColor: 'rgb(17,17,17)',
        padding: 8,
        titleColor: '#fff',
        bodyColor: '#fff',
        cornerRadius: 6,
        callbacks: {
          title: (context) => context[0].label,
          label: (context) => `${context.parsed.y.toLocaleString()} points`
        }
      }
    },
    scales: {
      x: {
        grid: {
          display: false
        },
        ticks: {
          color: '#737373',
          font: {
            size: 11
          }
        }
      },
      y: {
        grid: {
          color: 'rgba(0,0,0,0.06)'
        },
        ticks: {
          color: '#737373',
          font: {
            size: 11
          },
          callback: function(value) {
            return value.toLocaleString();
          }
        }
      }
    },
    interaction: {
      intersect: false,
      mode: 'index'
    }
  };

  return (
    <div className="rounded-lg bg-white border border-neutral-200 p-4 shadow-sm h-full">
      <div className="flex items-center justify-between mb-3">
        <h2 className="text-lg font-semibold tracking-tight">Weekly Progress</h2>
        <span className="text-xs text-neutral-500">Points</span>
      </div>
      <div className="flex-1">
        <div className="rounded-md border border-neutral-200 p-2">
          <div className="relative h-40 sm:h-48">
            <Line ref={chartRef} data={chartData} options={options} />
          </div>
        </div>
        <p className="mt-2 text-xs text-neutral-500">Last 6 weeks across all tracks.</p>
      </div>
    </div>
  );
};

export default WeeklyChart;