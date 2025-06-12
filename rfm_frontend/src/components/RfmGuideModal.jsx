import React, { useState, useEffect } from 'react'
import { api } from '../services/api'

/**
 * Comprehensive RFM Guide Modal Component
 * Provides educational content about RFM analysis methodology and detailed segment definitions
 * 
 * @param {Object} props - Component props
 * @param {boolean} props.isOpen - Whether the modal is open
 * @param {Function} props.onClose - Function to close the modal
 * @returns {JSX.Element} RFM Guide Modal component
 */
function RfmGuideModal({ isOpen, onClose }) {
  const [guideData, setGuideData] = useState(null)
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState('overview')
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('all')

  // Fetch RFM guide data when modal opens
  useEffect(() => {
    if (isOpen && !guideData) {
      fetchGuideData()
    }
  }, [isOpen])

  const fetchGuideData = async () => {
    setLoading(true)
    try {
      const data = await api.getRfmGuide()
      setGuideData(data)
    } catch (error) {
      console.error('Error fetching RFM guide data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter segments based on search and category
  const filteredSegments = () => {
    if (!guideData?.segments) return []

    let segments = Object.entries(guideData.segments)

    // Filter by category
    if (selectedCategory !== 'all') {
      const categorySegments = guideData.segment_categories[selectedCategory]?.segments || []
      segments = segments.filter(([name]) => categorySegments.includes(name))
    }

    // Filter by search term
    if (searchTerm) {
      segments = segments.filter(([name, segment]) =>
        name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        segment.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    return segments
  }

  // Get segment styling based on category with explicit colors
  const getSegmentStyling = (segmentName) => {
    if (!guideData?.segment_categories) return 'bg-gray-600 text-white'

    for (const [categoryKey, category] of Object.entries(guideData.segment_categories)) {
      if (category.segments.includes(segmentName)) {
        switch (category.color_theme) {
          case 'green': return 'bg-green-600 text-white'
          case 'lime': return 'bg-lime-600 text-white'
          case 'yellow': return 'bg-yellow-500 text-gray-900'
          case 'orange': return 'bg-orange-600 text-white'
          case 'red': return 'bg-red-600 text-white'
          case 'blue': return 'bg-blue-600 text-white'
          default: return 'bg-gray-600 text-white'
        }
      }
    }
    return 'bg-gray-600 text-white'
  }

  // Get priority styling with explicit colors
  const getPriorityStyling = (priority) => {
    switch (priority?.toLowerCase()) {
      case 'critical': return 'bg-red-50 text-red-800 border border-red-200'
      case 'high': return 'bg-orange-50 text-orange-800 border border-orange-200'
      case 'medium-high': return 'bg-yellow-50 text-yellow-800 border border-yellow-200'
      case 'medium': return 'bg-blue-50 text-blue-800 border border-blue-200'
      default: return 'bg-gray-50 text-gray-800 border border-gray-200'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black bg-opacity-60 transition-opacity duration-300"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-2xl w-full max-w-7xl h-full max-h-[95vh] flex flex-col border border-gray-200">
          
          {/* Header */}
          <div className="flex items-center justify-between p-6 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div>
                <h2 className="text-2xl font-bold text-gray-900">
                  RFM Analysis Guide
                </h2>
                <p className="text-gray-600 mt-1">
                  Master customer segmentation and marketing strategies
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-500 hover:text-gray-700 p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* Tab Navigation */}
          <div className="flex border-b border-gray-200 bg-gray-50">
            {[
              { key: 'overview', label: 'RFM Overview', icon: '📊' },
              { key: 'segments', label: 'Customer Segments', icon: '👥' },
              { key: 'implementation', label: 'Implementation', icon: '🚀' }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveTab(tab.key)}
                className={`px-6 py-4 text-sm font-medium border-b-2 transition-all duration-200 flex items-center gap-2 ${
                  activeTab === tab.key
                    ? 'border-blue-500 text-blue-600 bg-white'
                    : 'border-transparent text-gray-600 hover:text-gray-900 hover:bg-gray-100'
                }`}
              >
                <span className="text-lg">{tab.icon}</span>
                {tab.label}
              </button>
            ))}
          </div>

          {/* Content */}
          <div className="flex-1 overflow-auto bg-gray-50">
            {loading ? (
              <div className="flex items-center justify-center h-64">
                <div className="text-center">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500 mx-auto mb-4"></div>
                  <p className="text-gray-600">Loading RFM guide...</p>
                </div>
              </div>
            ) : (
              <div className="p-6">
                {/* Overview Tab */}
                {activeTab === 'overview' && guideData && (
                  <div className="space-y-8">
                    {/* RFM Introduction */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                      <div className="flex items-center gap-3 mb-4">
                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center">
                          <span className="text-blue-600 font-bold">?</span>
                        </div>
                        <h3 className="text-xl font-bold text-gray-900">What is RFM Analysis?</h3>
                      </div>
                      <p className="text-gray-700 text-lg leading-relaxed">
                        {guideData.rfm_methodology.overview}
                      </p>
                    </div>

                    {/* RFM Components */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                      <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <span className="text-2xl">🎯</span>
                        The Three Dimensions
                      </h4>
                      <div className="grid md:grid-cols-3 gap-6">
                        {Object.entries(guideData.rfm_methodology.components).map(([key, component]) => (
                          <div key={key} className="bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl p-6 border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 mb-4">
                              <div className={`w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg ${
                                key === 'recency' ? 'bg-green-500' : 
                                key === 'frequency' ? 'bg-blue-500' : 'bg-purple-500'
                              }`}>
                                {key === 'recency' ? 'R' : key === 'frequency' ? 'F' : 'M'}
                              </div>
                              <h5 className="font-bold text-gray-900 text-lg">{component.name}</h5>
                            </div>
                            <p className="text-gray-700 mb-4 leading-relaxed">
                              {component.description}
                            </p>
                            <div className="space-y-3">
                              <div className="bg-white rounded-lg p-3 border border-gray-200">
                                <span className="font-semibold text-gray-900 text-sm">Scoring: </span>
                                <span className="text-gray-700 text-sm">{component.scoring}</span>
                              </div>
                              <div className="bg-white rounded-lg p-3 border border-gray-200">
                                <span className="font-semibold text-gray-900 text-sm">Impact: </span>
                                <span className="text-gray-700 text-sm">{component.business_impact}</span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Scoring System */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                      <h4 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <span className="text-2xl">⚖️</span>
                        Scoring System
                      </h4>
                      <div className="grid md:grid-cols-2 gap-6">
                        {Object.entries(guideData.rfm_methodology.scoring_system).map(([key, value]) => (
                          <div key={key} className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4 border border-blue-200">
                            <div className="flex items-start gap-3">
                              <div className="w-6 h-6 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                                <span className="text-white text-xs font-bold">i</span>
                              </div>
                              <div>
                                <span className="font-bold text-gray-900 capitalize block mb-1">
                                  {key.replace('_', ' ')}: 
                                </span>
                                <span className="text-gray-700 text-sm leading-relaxed">
                                  {value}
                                </span>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {/* Segments Tab */}
                {activeTab === 'segments' && guideData && (
                  <div className="space-y-6">
                    {/* Search and Filter Controls */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="flex-1">
                          <div className="relative">
                            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                              <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                              </svg>
                            </div>
                            <input
                              type="text"
                              placeholder="Search segments..."
                              value={searchTerm}
                              onChange={(e) => setSearchTerm(e.target.value)}
                              className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-300 text-gray-900 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                          </div>
                        </div>
                        <select
                          value={selectedCategory}
                          onChange={(e) => setSelectedCategory(e.target.value)}
                          className="bg-gray-50 border border-gray-300 text-gray-900 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        >
                          <option value="all">All Categories</option>
                          {Object.entries(guideData.segment_categories).map(([key, category]) => (
                            <option key={key} value={key}>{category.name}</option>
                          ))}
                        </select>
                      </div>
                    </div>

                    {/* Segment Categories Overview */}
                    {selectedCategory === 'all' && (
                      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 mb-8">
                        {Object.entries(guideData.segment_categories).map(([key, category]) => (
                          <div key={key} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                            <div className="flex items-center gap-3 mb-3">
                              <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold ${
                                category.color_theme === 'green' ? 'bg-green-500' :
                                category.color_theme === 'lime' ? 'bg-lime-500' :
                                category.color_theme === 'yellow' ? 'bg-yellow-500' :
                                category.color_theme === 'orange' ? 'bg-orange-500' :
                                category.color_theme === 'red' ? 'bg-red-500' :
                                category.color_theme === 'blue' ? 'bg-blue-500' : 'bg-gray-500'
                              }`}>
                                {category.segments.length}
                              </div>
                              <h4 className="font-bold text-gray-900">{category.name}</h4>
                            </div>
                            <p className="text-gray-700 text-sm mb-3 leading-relaxed">
                              {category.description}
                            </p>
                            <div className="space-y-2">
                              <div className="text-xs text-gray-600">
                                <span className="font-semibold">Focus: </span>{category.focus}
                              </div>
                              <div className="text-xs text-gray-600">
                                <span className="font-semibold">Segments: </span>{category.segments.length}
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Segments List */}
                    <div className="space-y-6">
                      {filteredSegments().map(([name, segment]) => (
                        <div key={name} className="bg-white rounded-xl p-6 shadow-sm border border-gray-200 hover:shadow-md transition-shadow">
                          <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                            <div className="flex-1">
                              <div className="flex items-center gap-3 mb-4">
                                <span className={`inline-flex px-4 py-2 text-sm font-bold rounded-full ${getSegmentStyling(name)}`}>
                                  {name}
                                </span>
                                <span className={`inline-flex px-3 py-1 text-xs font-semibold rounded-full ${getPriorityStyling(segment.priority)}`}>
                                  {segment.priority} Priority
                                </span>
                              </div>
                              <p className="text-gray-700 mb-6 text-lg leading-relaxed">
                                {segment.description}
                              </p>
                              
                              <div className="grid md:grid-cols-2 gap-6">
                                <div>
                                  <h5 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <span className="text-blue-500">📋</span>
                                    Characteristics
                                  </h5>
                                  <ul className="space-y-2">
                                    {segment.characteristics.map((char, idx) => (
                                      <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                                        <span className="text-blue-500 mt-1 flex-shrink-0">•</span>
                                        <span className="leading-relaxed">{char}</span>
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                                
                                <div>
                                  <h5 className="font-bold text-gray-900 mb-3 flex items-center gap-2">
                                    <span className="text-green-500">🎯</span>
                                    Marketing Strategy
                                  </h5>
                                  <ul className="space-y-2">
                                    {segment.marketing_strategy.slice(0, 4).map((strategy, idx) => (
                                      <li key={idx} className="flex items-start gap-3 text-sm text-gray-700">
                                        <span className="text-green-500 mt-1 flex-shrink-0">•</span>
                                        <span className="leading-relaxed">{strategy}</span>
                                      </li>
                                    ))}
                                    {segment.marketing_strategy.length > 4 && (
                                      <li className="text-xs text-gray-500 italic pl-6">
                                        +{segment.marketing_strategy.length - 4} more strategies...
                                      </li>
                                    )}
                                  </ul>
                                </div>
                              </div>
                            </div>
                            
                            <div className="lg:text-right space-y-3 lg:min-w-[200px]">
                              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                <span className="font-semibold text-gray-900 text-sm block">Risk Level</span>
                                <span className={`text-sm font-medium ${
                                  segment.risk_level === 'Critical' ? 'text-red-600' :
                                  segment.risk_level === 'High' ? 'text-orange-600' :
                                  segment.risk_level === 'Medium' ? 'text-yellow-600' : 'text-green-600'
                                }`}>{segment.risk_level}</span>
                              </div>
                              <div className="bg-gray-50 rounded-lg p-3 border border-gray-200">
                                <span className="font-semibold text-gray-900 text-sm block">Revenue Potential</span>
                                <span className={`text-sm font-medium ${
                                  segment.revenue_potential.includes('High') ? 'text-green-600' :
                                  segment.revenue_potential.includes('Medium') ? 'text-yellow-600' : 'text-gray-600'
                                }`}>{segment.revenue_potential}</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Implementation Tab */}
                {activeTab === 'implementation' && guideData && (
                  <div className="space-y-8">
                    {/* Benefits */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <span className="text-2xl">✨</span>
                        Implementation Benefits
                      </h3>
                      <div className="grid md:grid-cols-2 gap-4">
                        {guideData.implementation_benefits.map((benefit, idx) => (
                          <div key={idx} className="flex items-start gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg border border-green-200">
                            <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                              </svg>
                            </div>
                            <span className="text-gray-800 text-sm leading-relaxed font-medium">
                              {benefit}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Best Practices */}
                    <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                      <h3 className="text-xl font-bold text-gray-900 mb-6 flex items-center gap-3">
                        <span className="text-2xl">💡</span>
                        Best Practices
                      </h3>
                      <div className="space-y-4">
                        {guideData.best_practices.map((practice, idx) => (
                          <div key={idx} className="flex items-start gap-4 p-4 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg border border-blue-200">
                            <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5">
                              <span className="text-white font-bold text-sm">{idx + 1}</span>
                            </div>
                            <span className="text-gray-800 text-sm leading-relaxed font-medium">
                              {practice}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="bg-gradient-to-r from-blue-500 to-indigo-600 rounded-xl p-6 text-white shadow-lg">
                      <h4 className="font-bold text-xl mb-6 flex items-center gap-3">
                        <span className="text-2xl">📊</span>
                        Your RFM System Overview
                      </h4>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                        <div className="text-center bg-white bg-opacity-20 rounded-lg p-4">
                          <div className="text-3xl font-bold mb-2">
                            {guideData.total_segments}
                          </div>
                          <div className="text-sm opacity-90">
                            Total Segments
                          </div>
                        </div>
                        <div className="text-center bg-white bg-opacity-20 rounded-lg p-4">
                          <div className="text-3xl font-bold mb-2">
                            {guideData.high_priority_segments?.length || 0}
                          </div>
                          <div className="text-sm opacity-90">
                            High Priority
                          </div>
                        </div>
                        <div className="text-center bg-white bg-opacity-20 rounded-lg p-4">
                          <div className="text-3xl font-bold mb-2">
                            {guideData.critical_risk_segments?.length || 0}
                          </div>
                          <div className="text-sm opacity-90">
                            Critical Risk
                          </div>
                        </div>
                        <div className="text-center bg-white bg-opacity-20 rounded-lg p-4">
                          <div className="text-3xl font-bold mb-2">
                            {guideData.high_risk_segments?.length || 0}
                          </div>
                          <div className="text-sm opacity-90">
                            High Risk
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default RfmGuideModal 