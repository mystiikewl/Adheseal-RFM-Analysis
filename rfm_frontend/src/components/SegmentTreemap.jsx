import React, { useEffect, useRef } from 'react';
import { Chart } from 'chart.js/auto';
import { TreemapController, TreemapElement } from 'chartjs-chart-treemap';

Chart.register(TreemapController, TreemapElement);

const SegmentTreemap = ({ data, theme }) => {
  const chartRef = useRef(null);
  const chartInstance = useRef(null);

  useEffect(() => {
    if (!data || !chartRef.current) return;

    console.log('Treemap Data Received:', data);

    const ctx = chartRef.current.getContext('2d');

    // Destroy previous chart instance if it exists
    if (chartInstance.current) {
      chartInstance.current.destroy();
    }

    // Prepare treemap data
    const treemapData = {
      datasets: [{
        label: 'RFM Segments',
        tree: data, // Use 'tree' for hierarchical data if needed, or ensure 'data' is flat array of objects
        data: data, // Keep data for flat structure if 'tree' is not used by this plugin version
        key: 'value', // Specify the key for sizing rectangles
        backgroundColor: data.map(item => item.color),
        borderWidth: 1,
        borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
        spacing: 0.5, // Reduced spacing
        // labels: { // Temporarily remove complex label config
        //   display: true,
        //   color: theme === 'dark' ? '#ffffff' : '#1f2937',
        //   font: {
        //     size: 12,
        //     family: 'Inter, system-ui, sans-serif'
        //   },
        //   align: 'center',
        //   padding: 4
        // }
      }]
    };

    // Create new treemap chart
    console.log('Initializing Treemap Chart with Data:', treemapData);
    try {
      chartInstance.current = new Chart(ctx, {
        type: 'treemap',
        data: treemapData,
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            title: {
              display: true,
              text: 'Treemap of Customer Segments',
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
                  return `${context.raw.name}: ${context.raw.value} customers`;
                }
              }
            }
          }
        }
      });
      console.log('Treemap Chart Render Status:', chartInstance.current.chartArea);
    console.log('Treemap Chart Initialized Successfully:', chartInstance.current);
  } catch (error) {
    console.error('Error Initializing Treemap Chart:', error);
  }

  return () => {
    if (chartInstance.current) {
      console.log('Destroying Treemap Chart Instance');
      chartInstance.current.destroy();
    }
  };
  }, [data, theme]);

  return (
    <div className="relative h-80 w-full">
      <canvas
        ref={chartRef}
        role="img"
        aria-label="Treemap chart displaying customer distribution across RFM segments"
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

export default SegmentTreemap;
