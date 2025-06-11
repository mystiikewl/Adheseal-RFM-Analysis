import React, { useEffect, useMemo } from 'react'
import { useRfmStore } from '../store/rfmStore'
import { fetchRfmData, fetchFilterOptions } from '../services/api'
import KpiCard from '../components/KpiCard'
import FilterDropdown from '../components/FilterDropdown'
import DataTable from '../components/DataTable'

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
      <div className="container mx-auto px-4 py-6">
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
        
        {/* Filters Section */}
        <div className="bg-neutral-card-background-light dark:bg-neutral-card-background-dark shadow-lg rounded-lg p-6 mb-8 border border-neutral-border-light dark:border-neutral-border-dark">
          <h2 className="text-xl font-semibold mb-4 text-neutral-text-primary-light dark:text-neutral-text-primary-dark">
            Filters
          </h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
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
          </div>
        </div>
        
        {/* Data Table Section */}
        <DataTable data={filteredRfmData} />
      </div>
    </div>
  )
}

export default DashboardPage
