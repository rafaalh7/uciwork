import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export const useTableStore = create(
  persist(
    (set) => ({
      sortConfig: null,
      setSortConfig: (config) => set({ sortConfig: config }),
      clearSortConfig: () => set({ sortConfig: null })
    }),
    {
      name: 'table-sort-storage'
    }
  )
)