// store/documentStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

// Estados permitidos
export const ALLOWED_STATUSES = {
  PENDING: 'Pendiente',
  APPROVED: 'Aprobado',
  REJECTED: 'Rechazado',
  IN_REVIEW: 'En Revisión'
};

// Colores para cada estado
export const STATUS_COLORS = {
  [ALLOWED_STATUSES.PENDING]: 'bg-yellow-100 text-yellow-800 border-yellow-300',
  [ALLOWED_STATUSES.APPROVED]: 'bg-green-100 text-green-800 border-green-300',
  [ALLOWED_STATUSES.REJECTED]: 'bg-red-100 text-red-800 border-red-300',
  [ALLOWED_STATUSES.IN_REVIEW]: 'bg-blue-100 text-blue-800 border-blue-300'
};

const useDocumentStore = create(
  persist(
    (set, get) => ({
      documents: [
        {
          id: 1,
          title: 'Informe Financiero Q1',
          author: 'Juan Pérez',
          date: '2024-01-15',
          status: ALLOWED_STATUSES.PENDING
        },
        {
          id: 2,
          title: 'Contrato de Servicios',
          author: 'María García',
          date: '2024-01-18',
          status: ALLOWED_STATUSES.APPROVED
        },
        {
          id: 3,
          title: 'Propuesta Marketing',
          author: 'Carlos López',
          date: '2024-01-20',
          status: ALLOWED_STATUSES.REJECTED
        },
        {
          id: 4,
          title: 'Política de Seguridad',
          author: 'Ana Martínez',
          date: '2024-01-22',
          status: ALLOWED_STATUSES.IN_REVIEW
        }
      ],
      
      // Actualizar estado de un documento
      updateDocumentStatus: (documentId, newStatus) => {
        const { documents } = get();
        
        // Validar que el estado sea permitido
        if (!Object.values(ALLOWED_STATUSES).includes(newStatus)) {
          throw new Error(`Estado no válido: ${newStatus}`);
        }
        
        const updatedDocuments = documents.map(doc =>
          doc.id === documentId ? { ...doc, status: newStatus } : doc
        );
        
        set({ documents: updatedDocuments });
      },
      
      // Agregar nuevo documento
      addDocument: (document) => {
        const { documents } = get();
        const newDocument = {
          ...document,
          id: Math.max(...documents.map(d => d.id)) + 1,
          date: new Date().toISOString().split('T')[0]
        };
        
        set({ documents: [...documents, newDocument] });
      },
      
      // Validar documento completo
      validateDocument: (document) => {
        const errors = [];
        
        if (!document.title?.trim()) {
          errors.push('El título es requerido');
        }
        
        if (!document.author?.trim()) {
          errors.push('El autor es requerido');
        }
        
        if (document.status && !Object.values(ALLOWED_STATUSES).includes(document.status)) {
          errors.push(`Estado no válido. Estados permitidos: ${Object.values(ALLOWED_STATUSES).join(', ')}`);
        }
        
        return errors;
      }
    }),
    {
      name: 'document-storage', // nombre para localStorage
      version: 1
    }
  )
);

export default useDocumentStore;