import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useDocumentStore = create(
  persist(
    (set, get) => ({
      documents: [],
      
      setDocuments: (documents) => {
        set({ documents });
      },
      
      addDocument: (document) => {
        set((state) => ({
          documents: [...state.documents, document]
        }));
      },
      
      updateDocument: (documentId, updates) => {
        set((state) => ({
          documents: state.documents.map(doc =>
            doc.id === documentId ? { ...doc, ...updates } : doc
          )
        }));
      },
      
      removeDocument: (documentId) => {
        set((state) => ({
          documents: state.documents.filter(doc => doc.id !== documentId)
        }));
      },
      
      getDocumentById: (documentId) => {
        return get().documents.find(doc => doc.id === documentId);
      }
    }),
    {
      name: 'document-storage',
    }
  )
);