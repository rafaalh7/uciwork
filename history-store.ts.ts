// history-store.ts
import { create } from 'zustand';
import { devtools } from 'zustand/middleware';

interface HistoryState<T> {
  past: T[];
  present: T;
  future: T[];
  lastUpdate: number;
}

interface HistoryActions<T> {
  commitState: (newPresent: T) => void;
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;
}

const createHistoryStore = <T extends object>(initialState: T) => {
  return create<HistoryState<T> & HistoryActions<T>>()(
    devtools((set) => ({
      past: [],
      present: initialState,
      future: [],
      lastUpdate: 0,
      
      commitState: (newPresent) => {
        set((state) => {
          // Merge rápido si los cambios son dentro de 500ms
          const now = Date.now();
          const shouldMerge = (now - state.lastUpdate) < 500;
          
          const newPast = shouldMerge 
            ? [...state.past.slice(0, -1), state.present]
            : [...state.past, state.present];
          
          // Limitar el historial a 50 estados
          const limitedPast = newPast.slice(-50);
          
          return {
            past: limitedPast,
            present: newPresent,
            future: [], // Limpiar futuro al hacer un nuevo commit
            lastUpdate: now,
          };
        });
      },
      
      undo: () => {
        set((state) => {
          if (state.past.length === 0) return state;
          
          const previous = state.past[state.past.length - 1];
          const newPast = state.past.slice(0, -1);
          
          return {
            past: newPast,
            present: previous,
            future: [state.present, ...state.future],
            lastUpdate: Date.now(),
          };
        });
      },
      
      redo: () => {
        set((state) => {
          if (state.future.length === 0) return state;
          
          const next = state.future[0];
          const newFuture = state.future.slice(1);
          
          return {
            past: [...state.past, state.present],
            present: next,
            future: newFuture,
            lastUpdate: Date.now(),
          };
        });
      },
      
      clearHistory: () => {
        set({
          past: [],
          future: [],
          lastUpdate: 0,
        });
      },
    }))
  );
};

export default createHistoryStore;