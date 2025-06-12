import { useRfmStore } from '../store/rfmStore'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api'

export const fetchRfmData = async () => {
  const store = useRfmStore.getState()
  store.setLoading(true)
  store.setError(null)

  try {
    const response = await fetch(`${API_URL}/rfm-data`)
    if (!response.ok) {
      throw new Error('Failed to fetch RFM data')
    }
    const data = await response.json()
    store.setRfmData(data)
  } catch (error) {
    store.setError(error.message)
  } finally {
    store.setLoading(false)
  }
}

export const fetchFilterOptions = async () => {
  const store = useRfmStore.getState()
  store.setLoading(true)
  store.setError(null)

  try {
    const response = await fetch(`${API_URL}/filters`)
    if (!response.ok) {
      throw new Error('Failed to fetch filter options')
    }
    const data = await response.json()
    store.setFilterOptions(data)
  } catch (error) {
    store.setError(error.message)
  } finally {
    store.setLoading(false)
  }
}

// Standalone API functions for non-store operations
export const api = {
  getRfmGuide: async () => {
    const response = await fetch(`${API_URL}/rfm-guide`)
    if (!response.ok) {
      throw new Error('Failed to fetch RFM guide')
    }
    return response.json()
  }
}
