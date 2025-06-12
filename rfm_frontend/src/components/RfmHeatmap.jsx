import React, { useEffect, useRef, useState } from 'react';
import { Chart } from 'chart.js/auto';
import { MatrixController, MatrixElement } from 'chartjs-chart-matrix';

Chart.register(MatrixController, MatrixElement);

const RfmHeatmap = ({ data, theme }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);
  const [viewMode, setViewMode] = useState('count'); // Toggle between 'count' and 'monetary'

  useEffect(() => {
    if (!data || data.length === 0 || !chartRef.current) { // Add check for empty data
      if (chartInstance.current) {
        chartInstance.current.destroy();
        chartInstance.current = null; // Ensure chart instance is nullified
      }
      return;
    }

    const ctx = chartRef.current.getContext('2d');

    // Destroy previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
      chartInstance.current = null; // Ensure chart instance is nullified
    }

    // Prepare heatmap data based on view mode
    const heatmapData = {
      datasets: [{
        label: viewMode === 'count' ? 'Customer Count' : 'Monetary Value',
        data: data.map(item => ({
          x: item.x,
          y: item.y,
          v: viewMode === 'count' ? item.count : item.monetary // Use count or monetary based on viewMode
        })),
        backgroundColor: (context) => {
          const item = context.raw;
          if (!item) return 'transparent'; // Add null check for item
          const value = viewMode === 'count' ? item.count : item.monetary;
          const maxValue = Math.max(...data.map(d => viewMode === 'count' ? d.count : d.monetary));
          const intensity = maxValue > 0 ? value / maxValue : 0; // Avoid division by zero
          if (intensity > 0.8) return '#4ade80'; // Green for high values
          if (intensity > 0.6) return '#86efac';
          if (intensity > 0.4) return '#fed7aa'; // Neutral for mid-range
          if (intensity > 0.2) return '#fbbf24'; // Warm for lower mid-range
          return '#ef4444'; // Red for low values
        },
        borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
        borderWidth: 1,
        width: ({chart}) => (chart.chartArea || {}).width / 5,
        height: ({chart}) => (chart.chartArea || {}).height / 5
      }]
    };

    // Create new heatmap chart
    chartInstance.current = new Chart(ctx, {
      type: 'matrix',
      data: heatmapData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        scales: {
          x: {
            type: 'linear',
            position: 'bottom',
            min: 1,
            max: 5,
            ticks: {
              stepSize: 1,
              color: theme === 'dark' ? '#ffffff' : '#1f2937',
              font: {
                size: 12,
                family: 'Inter, system-ui, sans-serif'
              }
            },
            title: {
              display: true,
              text: 'Recency (1 = Most Recent)',
              color: theme === 'dark' ? '#ffffff' : '#1f2937',
              font: {
                size: 14,
                weight: '500',
                family: 'Inter, system-ui, sans-serif'
              }
            },
            grid: {
              color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
            }
          },
          y: {
            type: 'linear',
            min: 1,
            max: 5,
            ticks: {
              stepSize: 1,
              color: theme === 'dark' ? '#ffffff' : '#1f2937',
              font: {
                size: 12,
                family: 'Inter, system-ui, sans-serif'
              }
            },
            title: {
              display: true,
              text: 'Frequency (1 = Least Frequent)',
              color: theme === 'dark' ? '#ffffff' : '#1f2937',
              font: {
                size: 14,
                weight: '500',
                family: 'Inter, system-ui, sans-serif'
              }
            },
            grid: {
              color: theme === 'dark' ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)'
            }
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'RFM Heatmap',
            color: theme === 'dark' ? '#ffffff' : '#1f2937',
            font: {
              size: 16,
              weight: '600',
              family: 'Inter, system-ui, sans-serif'
            },
            padding: {
              top: 10,
              bottom: 20
            }
          },
          legend: {
            display: false
          },
          tooltip: {
            enabled: true,
            backgroundColor: theme === 'dark' ? 'rgba(31, 41, 55, 0.8)' : 'rgba(255, 255, 255, 0.9)',
            titleColor: theme === 'dark' ? '#ffffff' : '#1f2937',
            bodyColor: theme === 'dark' ? '#ffffff' : '#1f2937',
            bodyFont: {
              size: 12,
              family: 'Inter, system-ui, sans-serif'
            },
            padding: 10,
            boxPadding: 5,
            usePointStyle: true,
            callbacks: {
              label: function(context) {
                return viewMode === 'count' 
                  ? `Recency: ${context.raw.x}, Frequency: ${context.raw.y}, Count: ${context.raw.v}`
                  : `Recency: ${context.raw.x}, Frequency: ${context.raw.y}, Monetary: $${context.raw.v.toLocaleString()}`;
              }
            }
          }
        }
      }
    });

    return () => {
      if (chartInstance.current) {
        chartInstance.current.destroy();
      }
    };
  }, [data, theme, viewMode]);

  const toggleViewMode = () => {
    setViewMode(prevMode => prevMode === 'count' ? 'monetary' : 'count');
  };

  return (
    <div className="relative h-80 w-full">
      <canvas
        ref={chartRef}
        role="img"
        aria-label="Heatmap chart displaying RFM analysis by customer count or monetary value"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && chartInstance.current) {
            // Optionally, focus on chart interaction or provide audio feedback
            e.preventDefault();
          }
        }}
      />
      <button
        onClick={toggleViewMode}
        className="absolute top-4 right-4 px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
        aria-label={`Toggle heatmap view to ${viewMode === 'count' ? 'monetary value' : 'customer count'}`}
      >
        {viewMode === 'count' ? 'Show Monetary' : 'Show Count'}
      </button>
    </div>
  );
};

export default RfmHeatmap;
