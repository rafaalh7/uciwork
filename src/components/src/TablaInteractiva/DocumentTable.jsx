// components/DocumentTable.jsx
import { useState } from 'react';
import { useDocumentStore } from '../store/useDocumentStore';

const DocumentTable = () => {
  const { 
    documents, 
    selectedDocuments, 
    toggleDocumentSelection, 
    toggleSelectAll, 
    deleteSelectedDocuments, 
    exportSelectedDocuments 
  } = useDocumentStore();
  
  const [error, setError] = useState('');

  // Verificar si todos los documentos están seleccionados
  const allSelected = documents.length > 0 && selectedDocuments.length === documents.length;
  
  // Verificar si algunos documentos están seleccionados
  const someSelected = selectedDocuments.length > 0 && !allSelected;

  // Manejar la acción de eliminar
  const handleDelete = () => {
    if (selectedDocuments.length === 0) {
      setError('Por favor, selecciona al menos un documento para eliminar');
      return;
    }
    
    if (window.confirm(`¿Estás seguro de que quieres eliminar ${selectedDocuments.length} documento(s)?`)) {
      deleteSelectedDocuments();
      setError('');
    }
  };

  // Manejar la acción de exportar
  const handleExport = () => {
    if (selectedDocuments.length === 0) {
      setError('Por favor, selecciona al menos un documento para exportar');
      return;
    }
    
    exportSelectedDocuments();
    setError('');
  };

  return (
    <div className="document-table-container">
      <div className="table-actions">
        <h2>Gestión de Documentos</h2>
        
        <div className="bulk-actions">
          <button 
            onClick={handleDelete}
            className="btn btn-danger"
            disabled={selectedDocuments.length === 0}
          >
            Eliminar seleccionados ({selectedDocuments.length})
          </button>
          
          <button 
            onClick={handleExport}
            className="btn btn-primary"
            disabled={selectedDocuments.length === 0}
          >
            Exportar seleccionados ({selectedDocuments.length})
          </button>
        </div>
      </div>

      {error && (
        <div className="error-message">
          {error}
        </div>
      )}

      <div className="table-responsive">
        <table className="document-table">
          <thead>
            <tr>
              <th>
                <input
                  type="checkbox"
                  checked={allSelected}
                  ref={input => {
                    if (input) {
                      input.indeterminate = someSelected;
                    }
                  }}
                  onChange={toggleSelectAll}
                />
              </th>
              <th>Nombre</th>
              <th>Tipo</th>
              <th>Fecha</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {documents.length === 0 ? (
              <tr>
                <td colSpan="5" className="empty-table">
                  No hay documentos disponibles
                </td>
              </tr>
            ) : (
              documents.map(document => (
                <tr key={document.id} className={selectedDocuments.includes(document.id) ? 'selected' : ''}>
                  <td>
                    <input
                      type="checkbox"
                      checked={selectedDocuments.includes(document.id)}
                      onChange={() => toggleDocumentSelection(document.id)}
                    />
                  </td>
                  <td>{document.name}</td>
                  <td>{document.type}</td>
                  <td>{document.date}</td>
                  <td>
                    <button 
                      className="btn-icon"
                      onClick={() => toggleDocumentSelection(document.id)}
                    >
                      {selectedDocuments.includes(document.id) ? 'Deseleccionar' : 'Seleccionar'}
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default DocumentTable;