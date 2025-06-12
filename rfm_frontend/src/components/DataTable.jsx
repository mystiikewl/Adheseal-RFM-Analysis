import React, { useState, useEffect } from 'react'
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from '@dnd-kit/core'
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  horizontalListSortingStrategy,
} from '@dnd-kit/sortable'
import {
  useSortable,
} from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import TrendSparkline from './TrendSparkline'

/**
 * Data table component for displaying RFM customer data
 * Follows the Adheseal style guide with sorting, filtering, column reordering, horizontal scrolling, and column visibility controls
 * 
 * @param {Object} props - Component props
 * @param {Array} props.data - Array of customer data objects
 * @returns {JSX.Element} Data table component
 */
function DataTable({ data }) {
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' })
  const [searchTerm, setSearchTerm] = useState('')
  const [showColumnControls, setShowColumnControls] = useState(false)
  
  // Default column order
  const defaultColumns = [
    { key: 'customer_name', label: 'Name', visible: true },
    { key: 'customer_type', label: 'Type', visible: true },
    { key: 'customer_ranking', label: 'Ranking', visible: true },
    { key: 'recency', label: 'Recency', visible: true },
    { key: 'frequency', label: 'Frequency', visible: true },
    { key: 'monetary', label: 'Monetary', visible: true },
    { key: 'avg_transaction_spend', label: 'Avg Spend', visible: true },
    { key: 'trend', label: 'Trend (12M)', visible: true },
    { key: 'last_sale_date', label: 'Last Sale', visible: true },
    { key: 'rfm_score', label: 'RFM Score', visible: true },
    { key: 'segment', label: 'Segment', visible: true }
  ]
  
  // Column order and visibility state with persistence
  const [columns, setColumns] = useState(() => {
    const savedOrder = localStorage.getItem('rfm-table-column-order')
    const savedVisibility = localStorage.getItem('rfm-table-column-visibility')
    
    if (savedOrder && savedVisibility) {
      const orderData = JSON.parse(savedOrder)
      const visibilityData = JSON.parse(savedVisibility)
      
      return orderData.map(col => ({
        ...col,
        visible: visibilityData[col.key] !== undefined ? visibilityData[col.key] : true
      }))
    }
    
    return defaultColumns
  })

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  )

  // Save column order and visibility to localStorage
  useEffect(() => {
    localStorage.setItem('rfm-table-column-order', JSON.stringify(columns))
    const visibilityMap = columns.reduce((acc, col) => ({
      ...acc,
      [col.key]: col.visible
    }), {})
    localStorage.setItem('rfm-table-column-visibility', JSON.stringify(visibilityMap))
  }, [columns])

  // Handle column reordering
  const handleDragEnd = (event) => {
    const { active, over } = event

    if (active.id !== over.id) {
      setColumns((items) => {
        const oldIndex = items.findIndex((item) => item.key === active.id)
        const newIndex = items.findIndex((item) => item.key === over.id)

        return arrayMove(items, oldIndex, newIndex)
      })
    }
  }

  // Function to handle sorting with improved type handling
  const handleSort = (key) => {
    let direction = 'ascending'
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending'
    }
    setSortConfig({ key, direction })
  }

  // Enhanced sorting function with proper type handling
  const sortedData = () => {
    if (!sortConfig.key) return data

    return [...data].sort((a, b) => {
      let aValue = a[sortConfig.key]
      let bValue = b[sortConfig.key]
      
      // Handle null/undefined values
      if (aValue == null && bValue == null) return 0
      if (aValue == null) return sortConfig.direction === 'ascending' ? 1 : -1
      if (bValue == null) return sortConfig.direction === 'ascending' ? -1 : 1
      
      // Handle numeric values
      if (typeof aValue === 'number' && typeof bValue === 'number') {
        return sortConfig.direction === 'ascending' 
          ? aValue - bValue 
          : bValue - aValue
      }
      
      // Handle string numeric values (like monetary values)
      const aNum = parseFloat(aValue)
      const bNum = parseFloat(bValue)
      if (!isNaN(aNum) && !isNaN(bNum)) {
        return sortConfig.direction === 'ascending' 
          ? aNum - bNum 
          : bNum - aNum
      }
      
      // Handle dates
      const aDate = new Date(aValue)
      const bDate = new Date(bValue)
      if (!isNaN(aDate.getTime()) && !isNaN(bDate.getTime())) {
        return sortConfig.direction === 'ascending' 
          ? aDate - bDate 
          : bDate - aDate
      }
      
      // Handle strings
      const aStr = String(aValue).toLowerCase()
      const bStr = String(bValue).toLowerCase()
      
      if (aStr < bStr) {
        return sortConfig.direction === 'ascending' ? -1 : 1
      }
      if (aStr > bStr) {
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

  // Function to reset column order
  const resetColumnOrder = () => {
    setColumns(defaultColumns)
  }

  // Function to toggle column visibility
  const toggleColumnVisibility = (columnKey) => {
    setColumns(columns.map(col => 
      col.key === columnKey 
        ? { ...col, visible: !col.visible }
        : col
    ))
  }

  // Function to show/hide all columns
  const toggleAllColumns = (visible) => {
    setColumns(columns.map(col => ({ ...col, visible })))
  }

  // Get visible columns only
  const visibleColumns = columns.filter(col => col.visible)

  // Function to get segment color styling - comprehensive coverage for all RFM segments
  const getSegmentStyling = (segment) => {
    switch (segment?.toLowerCase()) {
      // Highest Value Segments - Green shades
      case 'champions':
        return 'bg-green-600 dark:bg-green-500 text-white'
      case 'vip customers':
      case 'vip customer':
        return 'bg-green-500 dark:bg-green-400 text-white'
      case 'loyal customers':
      case 'loyal customer':
        return 'bg-green-400 dark:bg-green-300 text-gray-900'
        
      // Growth Potential - Light Green/Lime shades
      case 'potential loyalists':
      case 'potential loyalist':
        return 'bg-lime-500 dark:bg-lime-400 text-white'
      case 'recent customers':
      case 'recent customer':
        return 'bg-lime-400 dark:bg-lime-300 text-gray-900'
      case 'promising':
        return 'bg-emerald-500 dark:bg-emerald-400 text-white'
        
      // Attention Needed - Yellow/Orange shades
      case 'customers needing attention':
      case 'customer needing attention':
        return 'bg-yellow-500 dark:bg-yellow-400 text-gray-900'
      case 'about to sleep':
        return 'bg-orange-400 dark:bg-orange-300 text-gray-900'
        
      // High Risk - Orange/Red shades
      case 'at risk':
        return 'bg-orange-500 dark:bg-orange-400 text-white'
      case 'cannot lose them':
      case 'cannot lose':
        return 'bg-red-600 dark:bg-red-500 text-white'
        
      // Lost/Inactive - Red shades
      case 'lost customers':
      case 'lost customer':
        return 'bg-red-500 dark:bg-red-400 text-white'
      case 'hibernating':
        return 'bg-red-400 dark:bg-red-300 text-white'
        
      // Price Focused - Blue shades
      case 'price sensitive':
        return 'bg-blue-500 dark:bg-blue-400 text-white'
      case 'bargain hunters':
      case 'bargain hunter':
        return 'bg-blue-400 dark:bg-blue-300 text-white'
        
      // Uncategorized - Gray
      case 'other':
      case 'unknown':
      case 'neutral':
        return 'bg-gray-500 dark:bg-gray-400 text-white'
        
      // Default fallback
      default:
        return 'bg-neutral-border-light dark:bg-neutral-border-dark text-neutral-text-primary-light dark:text-neutral-text-primary-dark'
    }
  }

  // Function to get recency category styling
  const getRecencyCategoryStyling = (category) => {
    switch (category?.toLowerCase()) {
      case 'recent':
        return 'text-green-600 dark:text-green-400'
      case 'active':
        return 'text-blue-600 dark:text-blue-400'
      case 'moderate':
        return 'text-yellow-600 dark:text-yellow-400'
      case 'distant':
        return 'text-orange-600 dark:text-orange-400'
      case 'inactive':
        return 'text-red-600 dark:text-red-400'
      default:
        return 'text-neutral-text-secondary-light dark:text-neutral-text-secondary-dark'
    }
  }

  // Function to format cell content based on column
  const formatCellContent = (row, column) => {
    const value = row[column.key]
    
    if (column.key === 'segment') {
      return (
        <span className={`inline-flex px-2 py-1 text-xs font-medium rounded-full ${getSegmentStyling(value)}`}>
          {value || '-'}
        </span>
      )
    } else if (column.key === 'monetary' || column.key === 'avg_transaction_spend') {
      return (
        <span className="text-neutral-text-primary-light dark:text-neutral-text-primary-dark font-medium">
          {value ? `$${parseFloat(value).toLocaleString()}` : '-'}
        </span>
      )
    } else if (column.key === 'recency') {
      // Enhanced recency display
      const recencyFormatted = row.recency_formatted || `${Math.abs(value)} days ago`
      const recencyCategory = row.recency_category || 'Unknown'
      
      return (
        <div className="space-y-1">
          <span className="text-neutral-text-primary-light dark:text-neutral-text-primary-dark font-medium">
            {recencyFormatted}
          </span>
          <div className={`text-xs font-medium ${getRecencyCategoryStyling(recencyCategory)}`}>
            {recencyCategory}
          </div>
        </div>
      )
    } else if (column.key === 'trend') {
      // Trend sparkline display
      const trendValues = row.trend_values || []
      const trendDirection = row.trend_direction || 'stable'
      
      return (
        <div className="flex items-center justify-center py-2">
          <TrendSparkline
            data={trendValues}
            direction={trendDirection}
            width={80}
            height={24}
          />
        </div>
      )
    } else {
      return (
        <span className="text-neutral-text-primary-light dark:text-neutral-text-primary-dark">
          {value || '-'}
        </span>
      )
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
              {filteredData.length} of {data.length} customers • {visibleColumns.length} of {columns.length} columns visible
            </p>
          </div>
          
          <div className="flex flex-col sm:flex-row gap-3 w-full md:w-auto">
            {/* Column Controls */}
            <div className="relative">
              <button
                onClick={() => setShowColumnControls(!showColumnControls)}
                className="px-3 py-2 text-xs font-medium text-neutral-text-secondary-light dark:text-neutral-text-secondary-dark hover:text-neutral-text-primary-light dark:hover:text-neutral-text-primary-dark bg-neutral-background-light dark:bg-neutral-background-dark border border-neutral-border-light dark:border-neutral-border-dark rounded-md hover:bg-primary-light hover:bg-opacity-10 dark:hover:bg-primary-dark dark:hover:bg-opacity-10 transition-colors duration-200 flex items-center gap-2"
                title="Show/hide columns"
              >
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                </svg>
                Columns
              </button>
              
              {showColumnControls && (
                <div className="absolute right-0 top-full mt-2 w-64 bg-neutral-card-background-light dark:bg-neutral-card-background-dark border border-neutral-border-light dark:border-neutral-border-dark rounded-lg shadow-lg z-50 p-4">
                  <div className="flex justify-between items-center mb-3">
                    <h4 className="text-sm font-semibold text-neutral-text-primary-light dark:text-neutral-text-primary-dark">
                      Column Visibility
                    </h4>
                    <button
                      onClick={() => setShowColumnControls(false)}
                      className="text-neutral-text-secondary-light dark:text-neutral-text-secondary-dark hover:text-neutral-text-primary-light dark:hover:text-neutral-text-primary-dark"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                  
                  <div className="flex gap-2 mb-3">
                    <button
                      onClick={() => toggleAllColumns(true)}
                      className="px-2 py-1 text-xs bg-primary-light dark:bg-primary-dark text-white rounded hover:bg-primary-hover-light dark:hover:bg-primary-hover-dark transition-colors"
                    >
                      Show All
                    </button>
                    <button
                      onClick={() => toggleAllColumns(false)}
                      className="px-2 py-1 text-xs bg-neutral-border-light dark:bg-neutral-border-dark text-neutral-text-primary-light dark:text-neutral-text-primary-dark rounded hover:bg-neutral-background-light dark:hover:bg-neutral-background-dark transition-colors"
                    >
                      Hide All
                    </button>
                  </div>
                  
                  <div className="max-h-48 overflow-y-auto space-y-2">
                    {columns.map((column) => (
                      <label key={column.key} className="flex items-center gap-2 cursor-pointer">
                        <input
                          type="checkbox"
                          checked={column.visible}
                          onChange={() => toggleColumnVisibility(column.key)}
                          className="w-4 h-4 text-primary-light dark:text-primary-dark focus:ring-primary-light dark:focus:ring-primary-dark border-neutral-border-light dark:border-neutral-border-dark rounded"
                        />
                        <span className="text-sm text-neutral-text-primary-light dark:text-neutral-text-primary-dark">
                          {column.label}
                        </span>
                      </label>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            <button
              onClick={resetColumnOrder}
              className="px-3 py-2 text-xs font-medium text-neutral-text-secondary-light dark:text-neutral-text-secondary-dark hover:text-neutral-text-primary-light dark:hover:text-neutral-text-primary-dark bg-neutral-background-light dark:bg-neutral-background-dark border border-neutral-border-light dark:border-neutral-border-dark rounded-md hover:bg-primary-light hover:bg-opacity-10 dark:hover:bg-primary-dark dark:hover:bg-opacity-10 transition-colors duration-200"
              title="Reset column order to default"
            >
              Reset Columns
            </button>
            
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
          </div>
        </div>
      </div>

      {/* Top Horizontal Scrollbar */}
      <div className="overflow-x-auto bg-neutral-background-light dark:bg-neutral-background-dark border-b border-neutral-border-light dark:border-neutral-border-dark">
        <div className="h-4 min-w-full" style={{ width: 'max-content' }}>
          <div className="h-full" style={{ minWidth: `${visibleColumns.length * 150}px` }}></div>
        </div>
      </div>

      {/* Table Section with dual scrollbars */}
      <div className="relative h-[calc(100vh-6rem)]">
        <div className="h-full overflow-auto">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
          >
            <table className="min-w-full divide-y divide-neutral-border-light dark:divide-neutral-border-dark" style={{ minWidth: `${visibleColumns.length * 150}px` }}>
              <thead className="bg-white dark:bg-gray-800 sticky top-0 z-10 shadow-md border-b-2 border-neutral-border-light dark:border-neutral-border-dark">
                <tr>
                  <SortableContext items={visibleColumns.map(col => col.key)} strategy={horizontalListSortingStrategy}>
                    {visibleColumns.map((column) => (
                      <SortableTableHeader
                        key={column.key}
                        column={column}
                        sortConfig={sortConfig}
                        onSort={handleSort}
                      />
                    ))}
                  </SortableContext>
                </tr>
              </thead>
              <tbody className="bg-neutral-card-background-light dark:bg-neutral-card-background-dark divide-y divide-neutral-border-light dark:divide-neutral-border-dark">
                {filteredData.length > 0 ? (
                  filteredData.map((row, index) => (
                    <tr 
                      key={`${row.customer_id}-${index}`} 
                      className="hover:bg-neutral-background-light hover:bg-opacity-50 dark:hover:bg-neutral-background-dark dark:hover:bg-opacity-50 transition-colors duration-150"
                    >
                      {visibleColumns.map((column) => (
                        <td key={column.key} className="px-6 py-4 whitespace-nowrap text-sm min-w-[120px]">
                          {formatCellContent(row, column)}
                        </td>
                      ))}
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={visibleColumns.length} className="px-6 py-12 text-center">
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
          </DndContext>
        </div>
      </div>
      
      {/* Click outside to close column controls */}
      {showColumnControls && (
        <div 
          className="fixed inset-0 z-40" 
          onClick={() => setShowColumnControls(false)}
        />
      )}
    </div>
  )
}

/**
 * Sortable table header component with enhanced sorting indicators
 */
function SortableTableHeader({ column, sortConfig, onSort }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: column.key })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  }

  // Determine sort direction for visual indicators
  const isActive = sortConfig.key === column.key
  const isAscending = isActive && sortConfig.direction === 'ascending'
  const isDescending = isActive && sortConfig.direction === 'descending'

  return (
    <th
      ref={setNodeRef}
      style={style}
      scope="col"
      className={`px-6 py-4 text-left text-xs font-semibold text-gray-700 dark:text-gray-300 uppercase tracking-wider cursor-grab bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-primary-light dark:focus:ring-primary-dark select-none min-w-[120px] ${isDragging ? 'bg-primary-light bg-opacity-20 dark:bg-primary-dark dark:bg-opacity-20' : ''}`}
      {...attributes}
      {...listeners}
    >
      <div className="flex items-center justify-between gap-2">
        <div 
          className="flex items-center gap-2 cursor-pointer flex-1"
          onClick={(e) => {
            e.stopPropagation()
            onSort(column.key)
          }}
        >
          <span className="truncate">{column.label}</span>
          <div className="flex flex-col justify-center h-4">
            <svg 
              className={`w-3 h-3 ${isAscending ? 'text-primary-light dark:text-primary-dark' : 'text-neutral-text-secondary-light dark:text-neutral-text-secondary-dark opacity-30'}`} 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M14.707 12.707a1 1 0 01-1.414 0L10 9.414l-3.293 3.293a1 1 0 01-1.414-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 010 1.414z" clipRule="evenodd" />
            </svg>
            <svg 
              className={`w-3 h-3 ${isDescending ? 'text-primary-light dark:text-primary-dark' : 'text-neutral-text-secondary-light dark:text-neutral-text-secondary-dark opacity-30'}`} 
              fill="currentColor" 
              viewBox="0 0 20 20"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </div>
        </div>
        <div className="flex items-center text-neutral-text-secondary-light dark:text-neutral-text-secondary-dark opacity-50">
          <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </div>
      </div>
    </th>
  )
}

export default DataTable
