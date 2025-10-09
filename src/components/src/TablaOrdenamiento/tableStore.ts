// stores/tableStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface SortConfig {
  key: string;
  direction: 'asc' | 'desc';
}

interface TableState {
  sortConfigs: SortConfig[];
  setSortConfigs: (configs: SortConfig[]) => void;
  addSortConfig: (key: string) => void;
  clearSortConfigs: () => void;
}

export const useTableStore = create<TableState>()(
  persist(
    (set, get) => ({
      sortConfigs: [],
      setSortConfigs: (configs) => set({ sortConfigs: configs }),
      addSortConfig: (key) => {
        const { sortConfigs } = get();
        const existingIndex = sortConfigs.findIndex(config => config.key === key);
        
        let newConfigs: SortConfig[];
        
        if (existingIndex >= 0) {
          const existing = sortConfigs[existingIndex];
          // Cambiar dirección o eliminar si ya está en desc
          if (existing.direction === 'asc') {
            newConfigs = [
              ...sortConfigs.slice(0, existingIndex),
              { ...existing, direction: 'desc' },
              ...sortConfigs.slice(existingIndex + 1)
            ];
          } else {
            // Eliminar de la configuración
            newConfigs = sortConfigs.filter((_, index) => index !== existingIndex);
          }
        } else {
          // Agregar nueva configuración
          newConfigs = [...sortConfigs, { key, direction: 'asc' }];
        }
        
        set({ sortConfigs: newConfigs });
      },
      clearSortConfigs: () => set({ sortConfigs: [] }),
    }),
    {
      name: 'table-sort-storage',
    }
  )
);