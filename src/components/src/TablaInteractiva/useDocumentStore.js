// store/useDocumentStore.js
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useDocumentStore = create(
  persist(
    (set, get) => ({
      documents: [
        { id: 1, name: "Documento1.pdf", type: "PDF", date: "2025-09-01" },
        { id: 2, name: "Informe.docx", type: "DOCX", date: "2025-09-05" },
        { id: 3, name: "Presentacion.pptx", type: "PPTX", date: "2025-09-10" },
        { id: 4, name: "HojaCalculo.xlsx", type: "XLSX", date: "2025-09-15" },
        { id: 5, name: "Imagen.jpg", type: "JPG", date: "2025-09-18" }
      ],
      selectedDocuments: [],
      
      // Agregar o eliminar documentos seleccionados
      toggleDocumentSelection: (documentId) => {
        set((state) => {
          const isSelected = state.selectedDocuments.includes(documentId);
          return {
            selectedDocuments: isSelected
              ? state.selectedDocuments.filter(id => id !== documentId)
              : [...state.selectedDocuments, documentId]
          };
        });
      },
      
      // Seleccionar o deseleccionar todos los documentos
      toggleSelectAll: () => {
        set((state) => ({
          selectedDocuments: state.selectedDocuments.length === state.documents.length
            ? []
            : state.documents.map(doc => doc.id)
        }));
      },
      
      // Eliminar documentos seleccionados
      deleteSelectedDocuments: () => {
        set((state) => {
          const updatedDocuments = state.documents.filter(
            doc => !state.selectedDocuments.includes(doc.id)
          );
          return {
            documents: updatedDocuments,
            selectedDocuments: []
          };
        });
      },
      
      // Exportar documentos seleccionados (simulado)
      exportSelectedDocuments: () => {
        const { selectedDocuments, documents } = get();
        const selectedDocsData = documents.filter(doc => 
          selectedDocuments.includes(doc.id)
        );
        
        // Simulamos la exportación mostrando los datos en consola
        console.log("Exportando documentos:", selectedDocsData);
        alert(`Exportando ${selectedDocsData.length} documentos seleccionados`);
        
        // En una implementación real, aquí iría la lógica de exportación
        return selectedDocsData;
      }
    }),
    {
      name: 'document-storage', // nombre para el almacenamiento
    }
  )
);