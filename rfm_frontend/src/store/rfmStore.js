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
  setRfmData: (data) => set({ rfmData: data }),
  setFilters: (filters) => set((state) => ({ filters: { ...state.filters, ...filters } })),
  setFilterOptions: (options) => set({ filterOptions: options }),
  setLoading: (status) => set({ isLoading: status }),
  setError: (error) => set({ error })
}))
