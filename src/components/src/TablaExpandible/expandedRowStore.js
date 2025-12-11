import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';

export const useExpandedRowsStore = create(
  persist(
    (set, get) => ({
      expandedRows: new Set(),
      
      toggleRow: (rowId) => {
        set((state) => {
          const newExpandedRows = new Set(state.expandedRows);
          
          if (newExpandedRows.has(rowId)) {
            newExpandedRows.delete(rowId);
          } else {
            newExpandedRows.add(rowId);
          }
          
          return { expandedRows: newExpandedRows };
        });
      },
      
      isRowExpanded: (rowId) => {
        return get().expandedRows.has(rowId);
      },
      
      expandRow: (rowId) => {
        set((state) => {
          const newExpandedRows = new Set(state.expandedRows);
          newExpandedRows.add(rowId);
          return { expandedRows: newExpandedRows };
        });
      },
      
      collapseRow: (rowId) => {
        set((state) => {
          const newExpandedRows = new Set(state.expandedRows);
          newExpandedRows.delete(rowId);
          return { expandedRows: newExpandedRows };
        });
      },
      
      clearAll: () => {
        set({ expandedRows: new Set() });
      }
    }),
    {
      name: 'expanded-rows-storage',
      storage: createJSONStorage(() => localStorage),
    }
  )
);