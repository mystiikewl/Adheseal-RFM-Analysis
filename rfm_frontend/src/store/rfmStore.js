import { create } from 'zustand'

export const useRfmStore = create((set) => ({
  rfmData: [],
  filters: {
    customer_type: '',
    salesperson: '',
    segment: ''
  },
  filterOptions: {
    customer_type: [],
    salesperson: [],
    segment: []
  },
  isLoading: false,
  error: null,
  theme: 'light', // Default theme is light
  setRfmData: (data) => set({ rfmData: data }),
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  updateFilter: (key, value) => set((state) => ({ 
    filters: { ...state.filters, [key]: value } 
  })),
  setFilterOptions: (options) => set({ filterOptions: options }),
  setLoading: (status) => set({ isLoading: status }),
  setError: (error) => set({ error }),
  toggleTheme: () => set((state) => ({ theme: state.theme === 'light' ? 'dark' : 'light' }))
}))
