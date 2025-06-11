import React from 'react'
import { useRfmStore } from './store/rfmStore'
import DashboardPage from './pages/DashboardPage'

/**
 * Main application component for the Adheseal RFM Analysis Dashboard
 * Provides the overall layout structure with header and footer
 * Manages dark mode theme application
 * 
 * @returns {JSX.Element} Main application component
 */
function App() {
  const { theme } = useRfmStore()
  
  return (
    <div className={`min-h-screen bg-neutral-background-light dark:bg-neutral-background-dark ${theme === 'dark' ? 'dark' : ''}`}>
      {/* Header */}
      <header className="bg-neutral-card-background-light dark:bg-neutral-card-background-dark shadow-lg border-b border-neutral-border-light dark:border-neutral-border-dark">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center gap-3">
            {/* Logo/Icon */}
            <div className="w-8 h-8 bg-primary-light dark:bg-primary-dark rounded-lg flex items-center justify-center">
              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
              </svg>
            </div>
            <div>
              <h1 className="text-xl font-bold text-neutral-text-primary-light dark:text-neutral-text-primary-dark">
                Adheseal RFM Analysis Dashboard
              </h1>
              <p className="text-sm text-neutral-text-secondary-light dark:text-neutral-text-secondary-dark">
                Customer Segmentation & Analytics
              </p>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1">
        <DashboardPage />
      </main>

      {/* Footer */}
      <footer className="bg-neutral-card-background-light dark:bg-neutral-card-background-dark border-t border-neutral-border-light dark:border-neutral-border-dark mt-8">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="flex items-center gap-2 text-sm text-neutral-text-secondary-light dark:text-neutral-text-secondary-dark">
              &copy; {new Date().getFullYear()} Adheseal RFM Analysis Dashboard
            </div>
            <div className="flex items-center gap-4 text-sm text-neutral-text-secondary-light dark:text-neutral-text-secondary-dark">
              <span>
                Powered by React & Tailwind CSS
              </span>
              <div className="flex items-center gap-1">
                <div className="w-2 h-2 bg-feedback-success-light dark:bg-feedback-success-dark rounded-full"></div>
                <span>System Online</span>
              </div>
            </div>
          </div>
        </div>
      </footer>
    </div>
  )
}

export default App
