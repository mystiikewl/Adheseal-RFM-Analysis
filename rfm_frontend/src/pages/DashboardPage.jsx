import React, { useEffect, useMemo } from 'react'
import { useRfmStore } from '../store/rfmStore'
import { fetchRfmData, fetchFilterOptions } from '../services/api'
import KpiCard from '../components/KpiCard'
import FilterDropdown from '../components/FilterDropdown'
import DataTable from '../components/DataTable'
import SegmentBarChart from '../components/SegmentBarChart'
import SegmentTreemap from '../components/SegmentTreemap'
import MonetaryBarChart from '../components/MonetaryBarChart'
import RfmHeatmap from '../components/RfmHeatmap'

function DashboardPage() {
  const { rfmData, isLoading, error, filterOptions, filters, theme, toggleTheme } = useRfmStore()

  useEffect(() => {
    fetchRfmData()
    fetchFilterOptions()
  }, [])

  // Filter RFM data based on selected filters
  const filteredRfmData = useMemo(() => {
    // Ensure rfmData and filters are available and rfmData is an array
    if (!Array.isArray(rfmData) || !filters) {
      return []; // Return an empty array if data is not ready
    }
    return rfmData.filter(customer => {
      // Ensure filters object has the expected properties
      const customerType = filters.customer_type ?? '';
      const salesperson = filters.salesperson ?? '';
      const segment = filters.segment ?? '';

      return (
        (customerType === '' || customer.customer_type === customerType) &&
        (salesperson === '' || customer.salesperson === salesperson) &&
        (segment === '' || customer.segment === segment)
      );
    });
  }, [rfmData, filters]);

  // Calculate KPI metrics from filtered RFM data
  const kpiMetrics = useMemo(() => {
    const totalCustomers = filteredRfmData.length
    const vipCustomers = filteredRfmData.filter(customer => customer.segment === 'VIP Customers').length
    const atRiskCustomers = filteredRfmData.filter(customer => customer.segment === 'At Risk').length
    const averageRecency = totalCustomers > 0 
      ? (filteredRfmData.reduce((sum, customer) => sum + customer.recency, 0) / totalCustomers).toFixed(1)
      : 0

    return {
      total: totalCustomers,
      vip: vipCustomers,
      atRisk: atRiskCustomers,
      recency: averageRecency
    }
  }, [filteredRfmData])

  // Prepare data for SegmentTreemap
  const segmentTreemapData = useMemo(() => {
    console.log('Filtered RFM Data:', filteredRfmData);
    const segmentCount = filteredRfmData.reduce((acc, customer) => {
      acc[customer.segment] = (acc[customer.segment] || 0) + 1;
      return acc;
    }, {});

    const segmentColors = {
      'VIP Customers': '#22c55e',
      'Customers with Potential': '#84cc16',
      'At Risk': '#f59e0b',
      'Hibernating': '#ef4444',
      'Other': '#dc2626',
      'Neutral/Unknown': '#9ca3af',
    };

    const treemapData = Object.keys(segmentCount).map(segment => ({
      name: segment,
      value: segmentCount[segment],
      color: segmentColors[segment] || '#9ca3af',
    }));
    console.log('Segment Treemap Data Prepared:', treemapData);
    return treemapData;
  }, [filteredRfmData]);

  // Prepare data for MonetaryBarChart
  const monetaryBarChartData = useMemo(() => {
    const monetaryBySegment = filteredRfmData.reduce((acc, customer) => {
      acc[customer.segment] = (acc[customer.segment] || 0) + customer.monetary;
      return acc;
    }, {});
    return {
      labels: Object.keys(monetaryBySegment),
      datasets: [{
        label: 'Total Monetary Value',
        data: Object.values(monetaryBySegment),
        backgroundColor: [
          '#3b82f6', '#60a5fa', '#93c5fd', '#bfdbfe', '#dbeafe',
          '#4ade80', '#86efac', '#fed7aa', '#fbbf24', '#ef4444'
        ],
        borderColor: theme === 'dark' ? '#374151' : '#e5e7eb',
        borderWidth: 1,
      }],
    };
  }, [filteredRfmData, theme]);

  // Prepare data for RfmHeatmap
  const rfmHeatmapData = useMemo(() => {
    const heatmap = {};
    filteredRfmData.forEach(customer => {
      const key = `${customer.recency}-${customer.frequency}`;
      if (!heatmap[key]) {
        heatmap[key] = { x: customer.recency, y: customer.frequency, count: 0, monetary: 0 };
      }
      heatmap[key].count++;
      heatmap[key].monetary += customer.monetary;
    });

    return Object.values(heatmap).map(item => ({
      x: item.x,
      y: item.y,
      count: item.count,
      monetary: item.monetary,
    }));
  }, [filteredRfmData]);

  // Function to export data to CSV
  const exportToCsv = (dataToExport) => {
    if (!Array.isArray(dataToExport) || dataToExport.length === 0) {
      console.warn("No data to export or data is not an array.");
      // Optionally, provide user feedback e.g., using a toast notification
      alert("No data available to export.");
      return;
    }
    const headers = [
      'customer_name', 'customer_type', 'customer_ranking', 'recency', 
      'frequency', 'monetary', 'avg_transaction_spend', 'last_sale_date', 
      'rfm_score', 'segment'
    ];
    const csvRows = [
      headers.join(','),
      ...dataToExport.map(row => 
        headers.map(header => {
          let value = row[header] === null || typeof row[header] === 'undefined' ? '' : row[header];
          // Escape commas and quotes in the value
          value = value.toString().replace(/"/g, '""');
          return `"${value}"`;
        }).join(',')
      )
    ];
    const csvContent = csvRows.join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'rfm_filtered_data_export.csv');
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url); // Clean up the object URL
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen bg-neutral-background-light dark:bg-neutral-background-dark">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-light dark:border-primary-dark mx-auto mb-4"></div>
          <p className="text-neutral-text-primary-light dark:text-neutral-text-primary-dark text-lg font-medium">Loading RFM Analysis...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex justify-center items-center h-screen bg-neutral-background-light dark:bg-neutral-background-dark">
        <div className="bg-neutral-card-background-light dark:bg-neutral-card-background-dark rounded-lg shadow-lg p-8 max-w-md mx-4">
          <div className="text-center">
            <div className="w-12 h-12 bg-feedback-error-light dark:bg-feedback-error-dark rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 19.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h3 className="text-lg font-semibold text-neutral-text-primary-light dark:text-neutral-text-primary-dark mb-2">Error Loading Data</h3>
            <p className="text-feedback-error-light dark:text-feedback-error-dark text-sm">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className={`min-h-screen bg-neutral-background-light dark:bg-neutral-background-dark ${theme === 'dark' ? 'dark' : ''}`}>
      <div className="container mx-auto px-4 py-6 pb-24"> {/* Added pb-24 for spacing */}
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-neutral-text-primary-light dark:text-neutral-text-primary-dark">
            RFM Analysis Dashboard
          </h1>
          <button 
            onClick={toggleTheme} 
            className="bg-primary-light hover:bg-primary-hover-light dark:bg-primary-dark dark:hover:bg-primary-hover-dark text-white px-4 py-2 rounded-lg transition-all duration-200 font-medium focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:ring-offset-2 focus:ring-offset-neutral-background-light dark:focus:ring-offset-neutral-background-dark"
          >
            {theme === 'light' ? '🌙 Dark Mode' : '☀️ Light Mode'}
          </button>
        </div>
        
        {/* KPI Cards Section */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <KpiCard 
            title="Total Customers" 
            value={kpiMetrics.total.toLocaleString()} 
            description="Total number of customers analyzed" 
          />
          <KpiCard 
            title="VIP Customers" 
            value={kpiMetrics.vip.toLocaleString()} 
            description="High-value, loyal customers" 
          />
          <KpiCard 
            title="At Risk Customers" 
            value={kpiMetrics.atRisk.toLocaleString()} 
            description="Customers needing attention" 
          />
          <KpiCard 
            title="Avg. Recency (Days)" 
            value={kpiMetrics.recency} 
            description="Average days since last purchase" 
          />
        </div>
        
        
        {/* Visualizations Section */}
        <div className="bg-neutral-card-background-light dark:bg-neutral-card-background-dark shadow-lg rounded-lg p-6 mb-8 border border-neutral-border-light dark:border-neutral-border-dark">
          <h2 className="text-xl font-semibold mb-4 text-neutral-text-primary-light dark:text-neutral-text-primary-dark">
            RFM Visualizations
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-neutral-background-light dark:bg-neutral-background-dark p-4 rounded-lg border border-neutral-border-light dark:border-neutral-border-dark">
              <SegmentBarChart data={filteredRfmData} />
            </div>
            <div className="bg-neutral-background-light dark:bg-neutral-background-dark p-4 rounded-lg border border-neutral-border-light dark:border-neutral-border-dark">
              <SegmentTreemap data={segmentTreemapData} theme={theme} />
            </div>
            <div className="bg-neutral-background-light dark:bg-neutral-background-dark p-4 rounded-lg border border-neutral-border-light dark:border-neutral-border-dark">
              <MonetaryBarChart data={monetaryBarChartData} />
            </div>
            <div className="bg-neutral-background-light dark:bg-neutral-background-dark p-4 rounded-lg border border-neutral-border-light dark:border-neutral-border-dark">
              <RfmHeatmap data={rfmHeatmapData} />
            </div>
          </div>
        </div>
        
        {/* Data Table Section */}
        <DataTable data={filteredRfmData} />

        {/* Filters Section - Fixed at Bottom */}
        <div 
          className="fixed bottom-0 left-0 w-full z-10 shadow-lg p-6 border-t border-neutral-border-light dark:border-neutral-border-dark"
          style={{ backgroundColor: theme === 'dark' ? '#1E1E1E' : '#FFFFFF' }} // Directly apply background color
        >
          {/* <h2 className="text-xl font-semibold mb-4 text-neutral-text-primary-light dark:text-neutral-text-primary-dark">
            Filters
          </h2> */} {/* Optional: Remove or restyle heading for fixed bottom bar */}
          <div className="container mx-auto px-4"> {/* Ensure content aligns with page container */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 items-center"> {/* Adjusted to lg:grid-cols-4 and added items-center */}
              <FilterDropdown 
                label="Customer Type" 
                name="customer_type" 
                options={filterOptions.customer_type || []} 
              />
              <FilterDropdown 
                label="Salesperson" 
                name="salesperson" 
                options={filterOptions.salesperson || []} 
              />
              <FilterDropdown 
                label="Segment" 
                name="segment" 
                options={filterOptions.segment || []} 
              />
              <div className="flex justify-center lg:justify-end mt-4 sm:mt-0"> {/* Container for button, aligned to end on larger screens */}
                <button
                  onClick={() => exportToCsv(filteredRfmData)}
                  className="w-full sm:w-auto bg-primary-light hover:bg-primary-hover-light dark:bg-primary-dark dark:hover:bg-primary-hover-dark text-white font-medium px-6 py-2.5 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:ring-offset-2 focus:ring-offset-neutral-background-light dark:focus:ring-offset-neutral-background-dark flex items-center justify-center gap-2 text-sm"
                  aria-label="Export filtered customer data to CSV"
                  disabled={filteredRfmData.length === 0} // Disable button if no data
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Export CSV
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
