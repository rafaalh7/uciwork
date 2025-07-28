// stores/formStore.js
import { create } from 'zustand';
import { immer } from 'zustand/middleware/immer';
import { persist, createJSONStorage } from 'zustand/middleware';
import LZString from 'lz-string';

// Estado inicial del formulario
const initialFormState = {
  name: '',
  email: '',
  address: {
    street: '',
    city: '',
    zip: '',
    country: '',
  },
  preferences: {
    newsletter: false,
    theme: 'light',
    notifications: true,
  },
};

// Función para comprimir el estado (opcional)
const compressState = (state) => LZString.compressToUTF16(JSON.stringify(state));
const decompressState = (compressed) => JSON.parse(LZString.decompressFromUTF16(compressed) || 'null');

export const useFormStore = create(
  persist(
    immer((set, get) => ({
      // Historial
      past: [],
      present: initialFormState,
      future: [],
      lastActionTime: null,
      
      // Actualizar el formulario
      updateForm: (updater) => {
        const now = Date.now();
        const { past, present, lastActionTime } = get();
        
        // Determinar si debemos fusionar con la última acción
        const shouldMerge = now - lastActionTime < 1000; // 1 segundo
        
        // Crear nuevo estado
        set((state) => {
          const newPresent = typeof updater === 'function' 
            ? updater(state.present) 
            : { ...state.present, ...updater };
          
          // Actualizar historial solo si hay cambios reales
          if (JSON.stringify(present) !== JSON.stringify(newPresent)) {
            // Si no hay que fusionar o no hay acciones previas, agregar al historial
            if (!shouldMerge || !lastActionTime || past.length === 0) {
              state.past = [...state.past.slice(-99), present]; // Limitar a 100 estados
            }
            
            state.present = newPresent;
            state.future = []; // Limpiar futuro al hacer nueva acción
            state.lastActionTime = now;
          }
        });
      },
      
      // Deshacer
      undo: () => {
        const { past, present, future } = get();
        if (past.length === 0) return;
        
        const previous = past[past.length - 1];
        const newPast = past.slice(0, -1);
        
        set({
          past: newPast,
          present: previous,
          future: [present, ...future],
          lastActionTime: Date.now(),
        });
      },
      
      // Rehacer
      redo: () => {
        const { past, present, future } = get();
        if (future.length === 0) return;
        
        const next = future[0];
        const newFuture = future.slice(1);
        
        set({
          past: [...past, present],
          present: next,
          future: newFuture,
          lastActionTime: Date.now(),
        });
      },
      
      // Reiniciar formulario
      resetForm: () => {
        set({
          past: [],
          present: initialFormState,
          future: [],
          lastActionTime: Date.now(),
        });
      },
    })),
    {
      name: 'form-storage',
      storage: {
        getItem: (name) => {
          const item = localStorage.getItem(name);
          return item ? decompressState(item) : null;
        },
        setItem: (name, value) => {
          localStorage.setItem(name, compressState(value));
        },
        removeItem: (name) => localStorage.removeItem(name),
      },
    }
  )
);

// Hook auxiliar para acceder a las capacidades de undo/redo
export const useUndoRedo = () => {
  const canUndo = useFormStore((state) => state.past.length > 0);
  const canRedo = useFormStore((state) => state.future.length > 0);
  const undo = useFormStore((state) => state.undo);
  const redo = useFormStore((state) => state.redo);
  
  return { canUndo, canRedo, undo, redo };
};