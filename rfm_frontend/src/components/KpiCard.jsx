import React from 'react'

/**
 * KPI Card component displaying key performance indicators
 * Follows the Adheseal style guide with red accents and proper spacing
 * 
 * @param {Object} props - Component props
 * @param {string} props.title - The title/label for the KPI
 * @param {string|number} props.value - The numerical value to display
 * @param {string} props.description - Optional description text
 * @returns {JSX.Element} KPI card component
 */
function KpiCard({ title, value, description }) {
  return (
    <div className="bg-neutral-card-background-light dark:bg-neutral-card-background-dark border border-neutral-border-light dark:border-neutral-border-dark shadow-lg rounded-lg p-6 transition-all duration-200 hover:shadow-xl hover:scale-105">
      <div className="text-center">
        <h3 className="text-sm font-medium text-neutral-text-secondary-light dark:text-neutral-text-secondary-dark mb-2 uppercase tracking-wide">
          {title}
        </h3>
        <div className="mb-3">
          <span className="text-3xl font-bold text-primary-light dark:text-primary-dark">
            {value}
          </span>
        </div>
        {description && (
          <p className="text-sm text-neutral-text-secondary-light dark:text-neutral-text-secondary-dark leading-relaxed">
            {description}
          </p>
        )}
      </div>
    </div>
  )
}

export default KpiCard
