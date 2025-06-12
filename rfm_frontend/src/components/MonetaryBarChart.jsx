import React, { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

const MonetaryBarChart = ({ data, theme }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!data || !chartRef.current) return;

    const ctx = chartRef.current.getContext('2d');

    // Destroy previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    const barChartData = data;

    // Create new grouped bar chart
    chartInstance.current = new Chart(ctx, {
      type: 'bar',
      data: barChartData,
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        layout: {
          padding: {
            left: 10,
            right: 10,
            bottom: 10
          }
        },
        scales: {
          x: {
            title: {
              display: true,
              text: 'RFM Segments',
              color: theme === 'dark' ? '#ffffff' : '#1f2937',
              font: {
                size: 14,
                weight: '500',
                family: 'Inter, system-ui, sans-serif'
              }
            },
            ticks: {
              color: theme === 'dark' ? '#ffffff' : '#1f2937',
              font: {
                size: 12,
                family: 'Inter, system-ui, sans-serif'
              },
              maxRotation: 45,
              minRotation: 45
            },
            grid: {
              display: false
            }
          },
          y: {
            title: {
              display: true,
              text: 'Monetary Value ($)',
              color: theme === 'dark' ? '#ffffff' : '#1f2937',
              font: {
                size: 14,
                weight: '500',
                family: 'Inter, system-ui, sans-serif'
              }
            },
            ticks: {
              color: theme === 'dark' ? '#ffffff' : '#1f2937',
              font: {
                size: 12,
                family: 'Inter, system-ui, sans-serif'
              }
            },
            beginAtZero: true
          }
        },
        plugins: {
          title: {
            display: true,
            text: 'Monetary Value by Segment',
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
            display: true,
            position: 'top',
            labels: {
              color: theme === 'dark' ? '#ffffff' : '#1f2937',
              font: {
                size: 12,
                family: 'Inter, system-ui, sans-serif'
              },
              padding: 15,
              usePointStyle: true
            }
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
                return `${context.dataset.label}: $${context.raw.toLocaleString()}`;
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
  }, [data, theme]);

  return (
    <div className="relative h-80 w-full">
      <canvas
        ref={chartRef}
        role="img"
        aria-label="Grouped bar chart displaying total and average monetary value by RFM segment"
        tabIndex={0}
        onKeyDown={(e) => {
          if (e.key === 'Enter' && chartInstance.current) {
            // Optionally, focus on chart interaction or provide audio feedback
            e.preventDefault();
          }
        }}
      />
    </div>
  );
};

export default MonetaryBarChart;
