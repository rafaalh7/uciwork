import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Document, DocumentStore } from '../types/document';
import { initialDocuments } from '../data/initialDocuments';

const validatePositions = (documents: Document[]): boolean => {
  const positions = documents.map(d => d.priority);
  const uniquePositions = new Set(positions);
  
  // Validar que no haya posiciones duplicadas
  if (uniquePositions.size !== positions.length) {
    return false;
  }
  
  // Validar que las posiciones sean consecutivas
  const sortedPositions = [...positions].sort((a, b) => a - b);
  for (let i = 0; i < sortedPositions.length; i++) {
    if (sortedPositions[i] !== i + 1) {
      return false;
    }
  }
  
  return true;
};

export const useDocumentStore = create<DocumentStore>()(
  persist(
    (set, get) => ({
      documents: initialDocuments,
      isLoading: false,
      error: null,
      
      setDocuments: (documents) => set({ documents }),
      
      reorderDocuments: (startIndex: number, endIndex: number) => {
        const { documents } = get();
        const newDocuments = [...documents];
        const [removed] = newDocuments.splice(startIndex, 1);
        newDocuments.splice(endIndex, 0, removed);
        
        // Actualizar prioridades según nueva posición
        const updatedDocuments = newDocuments.map((doc, index) => ({
          ...doc,
          priority: index + 1,
        }));
        
        set({ documents: updatedDocuments });
      },
      
      saveNewOrder: () => {
        const { documents } = get();
        set({ isLoading: true, error: null });
        
        // Simular validación antes de guardar
        setTimeout(() => {
          const isValid = validatePositions(documents);
          
          if (!isValid) {
            set({ 
              error: 'Las posiciones no son válidas. Hay duplicados o números faltantes.',
              isLoading: false 
            });
            return;
          }
          
          // Simular llamada API exitosa
          set({ 
            isLoading: false,
            error: null 
          });
          
          console.log('Nuevo orden guardado:', documents);
          alert('¡Orden guardado exitosamente!');
        }, 500);
      },
      
      resetOrder: () => {
        set({ 
          documents: initialDocuments,
          error: null 
        });
      },
    }),
    {
      name: 'document-store',
      version: 1,
    }
  )
);