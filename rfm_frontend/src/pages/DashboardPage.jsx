import React, { useEffect } from 'react'
import { useRfmStore } from '../store/rfmStore'
import { fetchRfmData, fetchFilterOptions } from '../services/api'

function DashboardPage() {
  const { rfmData, isLoading, error, filterOptions } = useRfmStore()

  useEffect(() => {
    fetchRfmData()
    fetchFilterOptions()
  }, [])

  if (isLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>
  }

  if (error) {
    return <div className="text-red-500 text-center p-4">Error: {error}</div>
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">RFM Analysis Dashboard</h1>
      <div className="bg-white shadow-md rounded p-4">
        <h2 className="text-xl font-semibold mb-2">Customer Segments</h2>
        <p className="text-gray-700">Data loaded: {rfmData.length} customers</p>
        {/* Placeholder for KPI cards, filters, and data table */}
        <div className="mt-4">
          <p className="text-gray-500">Filters and visualizations will be added here.</p>
          <pre className="text-xs text-gray-500">Filter Options: {JSON.stringify(filterOptions, null, 2)}</pre>
        </div>
      </div>
    </div>
  )
}

export default DashboardPage
