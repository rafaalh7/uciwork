// advanced-history-store.ts
import { create } from 'zustand';
import { persist, devtools } from 'zustand/middleware';
import LZString from 'lz-string';

interface HistoryState<T> {
  past: string[]; // Almacenamos estados comprimidos
  present: T;
  future: string[]; // Almacenamos estados comprimidos
  lastUpdate: number;
  changeType: 'major' | 'minor';
}

interface HistoryActions<T> {
  commitState: (newPresent: T, changeType?: 'major' | 'minor') => void;
  undo: () => void;
  redo: () => void;
  clearHistory: () => void;
  canUndo: () => boolean;
  canRedo: () => boolean;
}

// Función para comprimir estados
const compressState = <T>(state: T): string => {
  return LZString.compressToUTF16(JSON.stringify(state));
};

// Función para descomprimir estados
const decompressState = <T>(compressed: string): T => {
  return JSON.parse(LZString.decompressFromUTF16(compressed));
};

const createAdvancedHistoryStore = <T extends object>(
  initialState: T,
  options?: {
    maxStates?: number;
    debounceTime?: number;
  }
) => {
  const maxStates = options?.maxStates || 50;
  const debounceTime = options?.debounceTime || 500;

  return create<HistoryState<T> & HistoryActions<T>>()(
    devtools(
      persist(
        (set, get) => ({
          past: [],
          present: initialState,
          future: [],
          lastUpdate: 0,
          changeType: 'major',
          
          canUndo: () => get().past.length > 0,
          canRedo: () => get().future.length > 0,
          
          commitState: (newPresent, changeType = 'major') => {
            const now = Date.now();
            const state = get();
            
            // Determinar si debemos mergear con el último estado
            const shouldMerge = 
              changeType === 'minor' || 
              (now - state.lastUpdate < debounceTime && state.changeType === 'minor');
            
            set({
              past: [
                ...(shouldMerge ? state.past.slice(0, -1) : state.past),
                compressState(state.present),
              ].slice(-maxStates),
              present: newPresent,
              future: [],
              lastUpdate: now,
              changeType,
            });
          },
          
          undo: () => {
            const state = get();
            if (!state.canUndo()) return;
            
            const lastPast = decompressState<T>(state.past[state.past.length - 1]);
            
            set({
              past: state.past.slice(0, -1),
              present: lastPast,
              future: [compressState(state.present), ...state.future],
              lastUpdate: Date.now(),
              changeType: 'major',
            });
          },
          
          redo: () => {
            const state = get();
            if (!state.canRedo()) return;
            
            const nextFuture = decompressState<T>(state.future[0]);
            
            set({
              past: [...state.past, compressState(state.present)],
              present: nextFuture,
              future: state.future.slice(1),
              lastUpdate: Date.now(),
              changeType: 'major',
            });
          },
          
          clearHistory: () => {
            set({
              past: [],
              future: [],
              lastUpdate: 0,
            });
          },
        }),
        {
          name: 'app-history-storage',
          partialize: (state) => ({ 
            past: state.past,
            future: state.future,
          }),
          serialize: (state) => JSON.stringify(state),
          deserialize: (str) => JSON.parse(str),
        }
      )
    )
  );
};

export default createAdvancedHistoryStore;