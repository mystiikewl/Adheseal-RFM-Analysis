import React from 'react'
import { useRfmStore } from '../store/rfmStore'

/**
 * Filter dropdown component for RFM dashboard filtering
 * Follows the Adheseal style guide with proper styling and accessibility
 * 
 * @param {Object} props - Component props
 * @param {string} props.label - Label for the dropdown
 * @param {string} props.name - Field name for filtering
 * @param {Array} props.options - Array of options to display
 * @returns {JSX.Element} Filter dropdown component
 */
function FilterDropdown({ label, name, options }) {
  const { filters, updateFilter } = useRfmStore()

  const handleChange = (event) => {
    updateFilter(name, event.target.value)
  }

  const currentValue = filters?.[name] || ''

  return (
    <div className="flex flex-col space-y-2">
      <label 
        htmlFor={`filter-${name}`}
        className="text-sm font-medium text-neutral-text-primary-light dark:text-neutral-text-primary-dark"
      >
        {label}
      </label>
      <div className="relative">
        <select
          id={`filter-${name}`}
          value={currentValue}
          onChange={handleChange}
          className="w-full bg-neutral-card-background-light dark:bg-neutral-card-background-dark border border-neutral-border-light dark:border-neutral-border-dark text-neutral-text-primary-light dark:text-neutral-text-primary-dark rounded-lg px-4 py-3 pr-10 text-sm focus:outline-none focus:ring-2 focus:ring-primary-light dark:focus:ring-primary-dark focus:border-primary-light dark:focus:border-primary-dark transition-all duration-200 hover:border-primary-light dark:hover:border-primary-dark appearance-none cursor-pointer"
          aria-label={`Filter by ${label}`}
        >
          <option value="" className="bg-neutral-card-background-light dark:bg-neutral-card-background-dark">
            All {label}s
          </option>
          {options.map((option) => (
            <option 
              key={option} 
              value={option}
              className="bg-neutral-card-background-light dark:bg-neutral-card-background-dark text-neutral-text-primary-light dark:text-neutral-text-primary-dark"
            >
              {option}
            </option>
          ))}
        </select>
        
        {/* Custom dropdown arrow */}
        <div className="absolute inset-y-0 right-0 flex items-center pr-3 pointer-events-none">
          <svg 
            className="w-5 h-5 text-neutral-text-secondary-light dark:text-neutral-text-secondary-dark" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </div>
      </div>
    </div>
  )
}

export default FilterDropdown
