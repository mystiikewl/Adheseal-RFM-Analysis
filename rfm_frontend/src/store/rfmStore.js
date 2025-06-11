import { create } from 'zustand'

export const useRfmStore = create((set) => ({
  rfmData: [],
  filters: {
    customer_group: '',
    customer_type: '',
    customer_ranking: '',
    state: ''
  },
  filterOptions: {
    customer_group: [],
    customer_type: [],
    customer_ranking: [],
    state: []
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
