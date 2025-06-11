import React, { useState } from 'react'

/**
 * Data table component for displaying RFM customer data
 * Follows the Adheseal style guide with sorting, filtering, and export functionality
 * 
 * @param {Object} props - Component props
 * @param {Array} props.data - Array of customer data objects
 * @returns {JSX.Element} Data table component
 */
function DataTable({ data }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' })
  const [searchTerm, setSearchTerm] = useState('')

  // Function to handle sorting
  const handleSort = (key) => {
    let direction = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  // Function to sort data based on current configuration
  const sortedData = () => {
    if (!sortConfig.key) return data

    return [...data].sort((a, b) => {
      if (a[sortConfig.key] < b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? -1 : 1
      }
      if (a[sortConfig.key] > b[sortConfig.key]) {
        return sortConfig.direction === 'ascending' ? 1 : -1
      }
      return 0
    })
  }

  // Function to filter data based on search term
  const filteredData = sortedData().filter((row) =>
    Object.values(row).some((value) =>
      value?.toString().toLowerCase().includes(searchTerm.toLowerCase())
    )
  )

  // Function to export data to CSV
  const exportToCsv = () => {
    const headers = [
      'customer_id', 'customer_name', 'customer_group', 'customer_type', 
      'customer_ranking', 'state', 'recency', 'frequency', 'monetary', 
      'rfm_score', 'segment'
    ]
    const csvRows = [
      headers.join(','),
      ...data.map(row => 
        headers.map(header => {
          let value = row[header] || ''
          // Escape commas and quotes in the value
          value = value.toString().replace(/"/g, '""')
          return `"${value}"`
        }).join(',')
      )
    ]
    const csvContent = csvRows.join('\n')
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.setAttribute('href', url)
    link.setAttribute('download', 'rfm_data_export.csv')
    link.style.visibility = 'hidden'
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  }

  // Define columns for the table
  const columns = [
    { key: 'customer_id', label: 'Customer ID' },
    { key: 'customer_name', label: 'Name' },
    { key: 'customer_group', label: 'Group' },
    { key: 'customer_type', label: 'Type' },
    { key: 'customer_ranking', label: 'Ranking' },
    { key: 'state', label: 'State' },
    { key: 'recency', label: 'Recency' },
    { key: 'frequency', label: 'Frequency' },
    { key: 'monetary', label: 'Monetary' },
    { key: 'rfm_score', label: 'RFM Score' },
    { key: 'segment', label: 'Segment' }
  ]

  // Function to get segment color styling
  const getSegmentStyling = (segment) => {
    switch (segment?.toLowerCase()) {
      case 'vip customers':
      case 'vip customer':
        return 'bg-feedback-success-light dark:bg-feedback-success-dark text-white'
      case 'at risk':
        return 'bg-feedback-warning-light dark:bg-feedback-warning-dark text-white'
      case 'hibernating':
        return 'bg-feedback-error-light dark:bg-feedback-error-dark text-white'
      default:
        return 'bg-neutral-border-light dark:bg-neutral-border-dark text-neutral-text-primary-light dark:text-neutral-text-primary-dark'
    }
  }

  return (
    <div className="bg-neutral-card-background-light dark:bg-neutral-card-background-dark shadow-lg rounded-lg border border-neutral-border-light dark:border-neutral-border-dark overflow-hidden">
      {/* Header Section */}
      <div className="p-6 border-b border-neutral-border-light dark:border-neutral-border-dark">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div className="flex-1">
            <h2 className="text-xl font-semibold text-neutral-text-primary-light dark:text-neutral-text-primary-dark mb-1">
              Customer Data
            </h2>
            <p className="text-sm text-neutral-text-secondary-light dark:text-neutral-text-secondary-dark">
              {filteredData.length} of {data.length} customers
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            <div className="relative flex-1 md:w-64">
              <input
                type="text"
                placeholder="Search customers..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-neutral-background-light dark:bg-neutral-background-dark border border-neutral-border-light dark:border-neutral-border-dark text-neutral-text-primary-light dark:text-neutral-text-primary-dark rounded-lg px-4 py-2 pl-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-dark transition-all duration-200"
                aria-label="Search customers"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="w-4 h-4 text-neutral-text-secondary-light dark:text-neutral-text-secondary-dark" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <button
              onClick={exportToCsv}
              className="bg-primary-light hover:bg-primary-hover-light dark:bg-primary-dark dark:hover:bg-primary-hover-dark text-white font-medium px-4 py-2 rounded-lg transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:ring-offset-2 focus:ring-offset-neutral-card-background-light dark:focus:ring-offset-neutral-card-background-dark flex items-center gap-2"
              aria-label="Export customer data to CSV"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
              </svg>
              Export CSV
            </button>
          </div>
        </div>
      </div>

      {/* Table Section */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-neutral-border-light dark:divide-neutral-border-dark">
          <thead className="bg-neutral-background-light dark:bg-neutral-background-dark">
            <tr>
              {columns.map((column) => (
                <th
                  key={column.key}
                  scope="col"
                  className="px-6 py-4 text-left text-xs font-semibold text-neutral-text-secondary-light dark:text-neutral-text-secondary-dark uppercase tracking-wider cursor-pointer hover:bg-primary-light hover:bg-opacity-10 dark:hover:bg-primary-dark dark:hover:bg-opacity-10 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-light dark:focus:ring-primary-dark"
                  onClick={() => handleSort(column.key)}
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleSort(column.key)
                    }
                  }}
                  role="button"
                  aria-label={`Sort by ${column.label}`}
                >
                  <div className="flex items-center gap-2">
                    {column.label}
                    <div className="flex flex-col">
                      <svg 
                        className={`w-3 h-3 ${sortConfig.key === column.key && sortConfig.direction === 'ascending' ? 'text-primary-light dark:text-primary-dark' : 'text-neutral-text-secondary-light dark:text-neutral-text-secondary-dark opacity-50'}`} 
                        fill="currentColor" 
                        viewBox="0 0 20 20"
                      >
                        <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
                      </svg>
                    </div>
                  </div>
                </th>
              ))}
            </tr>
          </thead>
          <tbody className="bg-neutral-card-background-light dark:bg-neutral-card-background-dark divide-y divide-neutral-border-light dark:divide-neutral-border-dark">
            {filteredData.length > 0 ? (
              filteredData.map((row, index) => (
                <tr 
                  key={`${row.customer_id}-${index}`} 
                  className="hover:bg-neutral-background-light hover:bg-opacity-50 dark:hover:bg-neutral-background-dark dark:hover:bg-opacity-50 transition-colors duration-150"
                >
                  {columns.map((column) => (
                    <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm">
                      {column.key === 'segment' ? (
                        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getSegmentStyling(row[column.key])}`}>
                          {row[column.key] || '-'}
                        </span>
                      ) : column.key === 'monetary' ? (
                        <span className="text-neutral-text-primary-light dark:text-neutral-text-primary-dark font-medium">
                          {row[column.key] ? `$${parseFloat(row[column.key]).toLocaleString()}` : '-'}
                        </span>
                      ) : (
                        <span className="text-neutral-text-primary-light dark:text-neutral-text-primary-dark">
                          {row[column.key] || '-'}
                        </span>
                      )}
                    </td>
                  ))}
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={columns.length} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center gap-3">
                    <svg className="w-12 h-12 text-neutral-text-secondary-light dark:text-neutral-text-secondary-dark opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                    <div>
                      <p className="text-neutral-text-primary-light dark:text-neutral-text-primary-dark font-medium">No customers found</p>
                      <p className="text-sm text-neutral-text-secondary-light dark:text-neutral-text-secondary-dark mt-1">
                        Try adjusting your search or filters
                      </p>
                    </div>
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}

export default DataTable
