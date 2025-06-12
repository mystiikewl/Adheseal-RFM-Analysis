import React, { useMemo } from 'react';
import { Bar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';

// Register ChartJS components
ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const SegmentBarChart = ({ data }) => {
  // Process data to count customers per segment
  const segmentCounts = useMemo(() => {
    const counts = {};
    if (Array.isArray(data)) {
      data.forEach(customer => {
        const segment = customer.segment || 'Unknown';
        counts[segment] = (counts[segment] || 0) + 1;
      });
    }
    return counts;
  }, [data]);

  // Prepare chart data
  const chartData = useMemo(() => {
    const labels = Object.keys(segmentCounts);
    const counts = Object.values(segmentCounts);
    return {
      labels,
      datasets: [
        {
          label: 'Customer Count',
          data: counts,
          backgroundColor: labels.map(label => {
            // Hot-to-cold palette: green for positive segments, red for negative
            if (label.includes('VIP Customers')) {
              return 'rgba(74, 222, 128, 0.7)'; // Green for positive segments
            } else if (label.includes('Customers with Potential')) {
              return 'rgba(134, 239, 172, 0.7)'; // Light green for potential
            } else if (label.includes('At Risk')) {
              return 'rgba(251, 191, 36, 0.7)'; // Warm for caution
            } else if (label.includes('Hibernating')) {
              return 'rgba(239, 68, 68, 0.7)'; // Red for negative segments
            } else {
              return 'rgba(156, 163, 175, 0.7)'; // Neutral gray for 'Other' or unknown
            }
          }),
          borderColor: labels.map(label => {
            if (label.includes('VIP Customers')) {
              return 'rgba(74, 222, 128, 1)';
            } else if (label.includes('Customers with Potential')) {
              return 'rgba(134, 239, 172, 1)';
            } else if (label.includes('At Risk')) {
              return 'rgba(251, 191, 36, 1)';
            } else if (label.includes('Hibernating')) {
              return 'rgba(239, 68, 68, 1)';
            } else {
              return 'rgba(156, 163, 175, 1)';
            }
          }),
          borderWidth: 1,
        },
      ],
    };
  }, [segmentCounts]);

  // Chart options with theme awareness
  const options = useMemo(() => ({
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        position: 'top',
        labels: {
          color: document.documentElement.classList.contains('dark') ? '#FFFFFF' : '#212121',
        },
      },
      title: {
        display: true,
        text: 'Customer Segments Distribution',
        color: document.documentElement.classList.contains('dark') ? '#FFFFFF' : '#212121',
        font: {
          size: 18,
        },
      },
      tooltip: {
        backgroundColor: document.documentElement.classList.contains('dark') ? 'rgba(30, 30, 30, 0.8)' : 'rgba(255, 255, 255, 0.8)',
        titleColor: document.documentElement.classList.contains('dark') ? '#FFFFFF' : '#212121',
        bodyColor: document.documentElement.classList.contains('dark') ? '#FFFFFF' : '#212121',
        borderColor: document.documentElement.classList.contains('dark') ? '#333333' : '#E0E0E0',
        borderWidth: 1,
      },
    },
    scales: {
      x: {
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#FFFFFF' : '#212121',
        },
        grid: {
          color: document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        title: {
          display: true,
          text: 'Segment',
          color: document.documentElement.classList.contains('dark') ? '#FFFFFF' : '#212121',
        },
      },
      y: {
        ticks: {
          color: document.documentElement.classList.contains('dark') ? '#FFFFFF' : '#212121',
        },
        grid: {
          color: document.documentElement.classList.contains('dark') ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.1)',
        },
        title: {
          display: true,
          text: 'Customer Count',
          color: document.documentElement.classList.contains('dark') ? '#FFFFFF' : '#212121',
        },
      },
    },
  }), []);

  return (
    <div className="bg-neutral-card-background-light dark:bg-neutral-card-background-dark shadow-md rounded-lg p-4 h-96 border border-neutral-border-light dark:border-neutral-border-dark">
      <div className="relative h-full w-full">
        <Bar
          data={chartData}
          options={options}
          aria-label="Bar Chart of Customer Segments Distribution"
          role="img"
        />
      </div>
    </div>
  );
};

export default SegmentBarChart;
