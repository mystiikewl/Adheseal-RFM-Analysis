import React from 'react'
import DashboardPage from './pages/DashboardPage'

function App() {
  return (
    <div className="min-h-screen bg-gray-100">
      <header className="bg-white shadow">
        <div className="container mx-auto px-4 py-3">
          <h1 className="text-2xl font-bold text-gray-800">Adheseal RFM Analysis Dashboard</h1>
        </div>
      </header>
      <main>
        <DashboardPage />
      </main>
      <footer className="bg-gray-200 text-gray-600 text-center py-4">
        <p>&copy; {new Date().getFullYear()} Adheseal RFM Analysis Dashboard</p>
      </footer>
    </div>
  )
}

export default App
