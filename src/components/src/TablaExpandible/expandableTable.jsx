import React, { useCallback } from 'react';
import ExpandableRow from './ExpandableRow';
import { useExpandedRowsStore } from '../../stores/useExpandedRowsStore';
import './ExpandableTable.css';

const ExpandableTable = ({ documents = [], onRefresh }) => {
  const { expandedRows, clearAll } = useExpandedRowsStore();
  
  const handleExpandAll = useCallback(() => {
    documents.forEach(doc => {
      if (!expandedRows.has(doc.id)) {
        useExpandedRowsStore.getState().expandRow(doc.id);
      }
    });
  }, [documents, expandedRows]);
  
  const handleCollapseAll = useCallback(() => {
    documents.forEach(doc => {
      useExpandedRowsStore.getState().collapseRow(doc.id);
    });
  }, [documents]);
  
  const expandedCount = expandedRows.size;
  const hasDocuments = documents.length > 0;
  
  return (
    <div className="expandable-table-container">
      <div className="table-header">
        <h2>Gestión Documental</h2>
        <div className="table-controls">
          <div className="status-info">
            <span className="expanded-count">
              {expandedCount} de {documents.length} expandidos
            </span>
          </div>
          <div className="control-buttons">
            <button 
              className="control-button expand-all"
              onClick={handleExpandAll}
              disabled={!hasDocuments}
            >
              Expandir Todos
            </button>
            <button 
              className="control-button collapse-all"
              onClick={handleCollapseAll}
              disabled={!hasDocuments || expandedCount === 0}
            >
              Colapsar Todos
            </button>
            <button 
              className="control-button clear-all"
              onClick={clearAll}
              disabled={expandedCount === 0}
            >
              Limpiar Estado
            </button>
            {onRefresh && (
              <button 
                className="control-button refresh"
                onClick={onRefresh}
              >
                Actualizar
              </button>
            )}
          </div>
        </div>
      </div>
      
      <div className="table-responsive">
        <table className="expandable-table">
          <thead>
            <tr>
              <th style={{ width: '50px' }}></th>
              <th>Nombre del Documento</th>
              <th>Estado</th>
              <th>Tipo</th>
              <th>Última Modificación</th>
              <th>Tamaño</th>
            </tr>
          </thead>
          <tbody>
            {hasDocuments ? (
              documents.map((document) => (
                <ExpandableRow 
                  key={document.id} 
                  document={document} 
                />
              ))
            ) : (
              <tr className="no-data-row">
                <td colSpan="6">
                  <div className="no-data-message">
                    No hay documentos disponibles
                  </div>
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
      
      <div className="table-footer">
        <small>
          El estado de las filas expandidas se mantiene incluso al recargar la página
        </small>
      </div>
    </div>
  );
};

export default ExpandableTable;