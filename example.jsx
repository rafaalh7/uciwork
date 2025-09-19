// Ejemplo de uso en una aplicación completa
import { useDocumentStore } from './store/useDocumentStore';

// En otro componente, podemos acceder al estado de documentos seleccionados
function DocumentCounter() {
  const selectedDocuments = useDocumentStore(state => state.selectedDocuments);
  
  return (
    <div>
      <span>Documentos seleccionados: {selectedDocuments.length}</span>
    </div>
  );
}

// Componente para simular cambio de página
function OtherPage() {
  // Al cambiar a esta página, los documentos seleccionados se mantienen
  const selectedDocuments = useDocumentStore(state => state.selectedDocuments);
  
  return (
    <div>
      <h2>Otra página</h2>
      <p>Documentos seleccionados (persistentes): {selectedDocuments.length}</p>
    </div>
  );
}