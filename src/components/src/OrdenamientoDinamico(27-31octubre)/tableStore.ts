// stores/tableStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

interface TableState {
  sortConfig: SortConfig[];
  setSortConfig: (config: SortConfig[]) => void;
  addSortConfig: (key: string) => void;
  clearSortConfig: () => void;
}

export const useTableStore = create<TableState>()(
  persist(
    (set, get) => ({
      sortConfig: [],
      
      setSortConfig: (config: SortConfig[]) => set({ sortConfig: config }),
      
      addSortConfig: (key: string) => {
        const { sortConfig } = get();
        const existingIndex = sortConfig.findIndex(config => config.key === key);
        let newConfig: SortConfig[];

        if (existingIndex >= 0) {
          const existing = sortConfig[existingIndex];
          if (existing.direction === 'asc') {
            // Cambiar a descendente
            newConfig = [
              ...sortConfig.slice(0, existingIndex),
              { ...existing, direction: 'desc' },
              ...sortConfig.slice(existingIndex + 1)
            ];
          } else {
            // Remover del ordenamiento
            newConfig = sortConfig.filter((_, index) => index !== existingIndex);
          }
        } else {
          // Agregar nuevo ordenamiento
          newConfig = [
            ...sortConfig,
            { key, direction: 'asc' }
          ];
        }

        set({ sortConfig: newConfig });
      },
      
      clearSortConfig: () => set({ sortConfig: [] }),
    }),
    {
      name: 'table-sort-storage',
    }
  )
);