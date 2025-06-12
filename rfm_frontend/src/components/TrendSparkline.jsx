import React from 'react'

/**
 * Trend Sparkline component for displaying customer purchase trends
 * Follows the Adheseal style guide with theme support and consistent styling
 * 
 * @param {Object} props - Component props
 * @param {Array} props.data - Array of trend values (e.g., monthly spend over 12 months)
 * @param {string} props.direction - Trend direction: 'up', 'down', or 'stable'
 * @param {number} props.width - Width of the sparkline (default: 80)
 * @param {number} props.height - Height of the sparkline (default: 20)
 * @param {string} props.className - Additional CSS classes
 * @returns {JSX.Element} Trend sparkline component
 */
function TrendSparkline({ 
  data = [], 
  direction = 'stable', 
  width = 80, 
  height = 20, 
  className = '' 
}) {
  // Return empty state if no data
  if (!data || data.length === 0) {
    return (
      <div className={`flex items-center justify-center ${className}`} style={{ width, height }}>
        <div className="w-2 h-2 bg-neutral-border-light dark:bg-neutral-border-dark rounded-full opacity-50"></div>
      </div>
    )
  }

  // Calculate dimensions and scales
  const padding = 2
  const chartWidth = width - (padding * 2)
  const chartHeight = height - (padding * 2)
  
  // Find min and max values for scaling
  const maxValue = Math.max(...data)
  const minValue = Math.min(...data)
  const valueRange = maxValue - minValue || 1 // Avoid division by zero

  // Generate SVG path
  const pathData = data.map((value, index) => {
    const x = padding + (index / (data.length - 1)) * chartWidth
    const y = padding + chartHeight - ((value - minValue) / valueRange) * chartHeight
    return `${index === 0 ? 'M' : 'L'} ${x} ${y}`
  }).join(' ')

  // Get color based on trend direction following style guide
  const getStrokeColor = () => {
    switch (direction) {
      case 'up':
        return '#22c55e' // Green for positive trend (VIP customers color)
      case 'down':
        return '#ef4444' // Red for negative trend (hibernating color)
      case 'stable':
      default:
        return '#6b7280' // Gray for stable/neutral
    }
  }

  // Get trend arrow icon
  const getTrendIcon = () => {
    switch (direction) {
      case 'up':
        return (
          <svg className="w-3 h-3 text-green-600 dark:text-green-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z" clipRule="evenodd" />
          </svg>
        )
      case 'down':
        return (
          <svg className="w-3 h-3 text-red-600 dark:text-red-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M14.707 12.293a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 111.414-1.414L9 14.586V3a1 1 0 012 0v11.586l2.293-2.293a1 1 0 011.414 0z" clipRule="evenodd" />
          </svg>
        )
      case 'stable':
      default:
        return (
          <svg className="w-3 h-3 text-neutral-text-secondary-light dark:text-neutral-text-secondary-dark" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M3 10a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1z" clipRule="evenodd" />
          </svg>
        )
    }
  }

  return (
    <div className={`flex items-center gap-2 ${className}`}>
      {/* Sparkline Chart */}
      <div className="relative">
        <svg
          width={width}
          height={height}
          className="overflow-visible"
          style={{ backgroundColor: 'transparent' }}
        >
          {/* Grid lines for better readability (subtle) */}
          <defs>
            <pattern
              id="grid"
              width="10"
              height="5"
              patternUnits="userSpaceOnUse"
            >
              <path
                d="M 10 0 L 0 0 0 5"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-neutral-border-light dark:text-neutral-border-dark opacity-20"
              />
            </pattern>
          </defs>
          
          {/* Background */}
          <rect
            width={width}
            height={height}
            fill="url(#grid)"
            className="opacity-10"
          />
          
          {/* Trend line */}
          <path
            d={pathData}
            fill="none"
            stroke={getStrokeColor()}
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="drop-shadow-sm"
          />
          
          {/* Fill area under curve for better visual impact */}
          <path
            d={`${pathData} L ${padding + chartWidth} ${padding + chartHeight} L ${padding} ${padding + chartHeight} Z`}
            fill={getStrokeColor()}
            fillOpacity="0.1"
          />
          
          {/* End point indicator */}
          {data.length > 1 && (
            <circle
              cx={padding + chartWidth}
              cy={padding + chartHeight - ((data[data.length - 1] - minValue) / valueRange) * chartHeight}
              r="1.5"
              fill={getStrokeColor()}
              className="drop-shadow-sm"
            />
          )}
        </svg>
      </div>
      
      {/* Trend Direction Indicator */}
      <div className="flex items-center" title={`Trend: ${direction}`}>
        {getTrendIcon()}
      </div>
    </div>
  )
}

export default TrendSparkline 