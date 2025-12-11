import React, { useState } from 'react';
import { useExpandedRowsStore } from '../../stores/useExpandedRowsStore';
import { validateDocumentDetails } from '../../utils/dataValidation';
import DocumentIcon from '../DocumentIcon';
import './ExpandableTable.css';

const ExpandableRow = ({ document }) => {
  const { id, name, type, lastModified, size, status } = document;
  const [isAnimating, setIsAnimating] = useState(false);
  
  const { 
    isRowExpanded, 
    toggleRow 
  } = useExpandedRowsStore();
  
  const expanded = isRowExpanded(id);
  
  const handleToggle = () => {
    setIsAnimating(true);
    toggleRow(id);
    
    // Reset animating state after transition
    setTimeout(() => {
      setIsAnimating(false);
    }, 300);
  };
  
  // Validar detalles del documento
  const details = document.details || {};
  const isValidDetails = validateDocumentDetails(details);
  const hasDetails = Object.keys(details).length > 0 && isValidDetails;
  
  return (
    <>
      <tr className={`table-row ${expanded ? 'expanded' : ''}`}>
        <td className="expand-cell">
          <button 
            className={`expand-button ${expanded ? 'expanded' : ''} ${isAnimating ? 'animating' : ''}`}
            onClick={handleToggle}
            aria-label={expanded ? "Colapsar detalles" : "Expandir detalles"}
            aria-expanded={expanded}
          >
            <span className="expand-icon">
              {expanded ? '▼' : '▶'}
            </span>
          </button>
        </td>
        <td>
          <div className="document-cell">
            <DocumentIcon type={type} />
            <span className="document-name">{name}</span>
          </div>
        </td>
        <td>
          <span className={`status-badge status-${status.toLowerCase()}`}>
            {status}
          </span>
        </td>
        <td>{type}</td>
        <td>{new Date(lastModified).toLocaleDateString()}</td>
        <td>{size}</td>
      </tr>
      
      {/* Fila expandible con detalles */}
      <tr className={`details-row ${expanded ? 'expanded' : ''}`}>
        <td colSpan="6">
          <div className={`details-content ${expanded ? 'expanded' : ''}`}>
            {hasDetails ? (
              <div className="document-details">
                <h4>Detalles del Documento</h4>
                <div className="details-grid">
                  {Object.entries(details).map(([key, value]) => (
                    <div className="detail-item" key={key}>
                      <strong>{formatKey(key)}:</strong>
                      <span>{formatValue(key, value)}</span>
                    </div>
                  ))}
                </div>
                
                {/* Metadatos adicionales */}
                {details.metadata && (
                  <div className="metadata-section">
                    <h5>Metadatos</h5>
                    <div className="metadata-grid">
                      {Object.entries(details.metadata).map(([metaKey, metaValue]) => (
                        <div className="metadata-item" key={metaKey}>
                          <span className="meta-key">{metaKey}:</span>
                          <span className="meta-value">{String(metaValue)}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="no-details">
                <p>⚠️ Sin detalles disponibles para este documento</p>
                <small>El documento no contiene información adicional o los datos son inválidos</small>
              </div>
            )}
          </div>
        </td>
      </tr>
    </>
  );
};

// Funciones auxiliares para formateo
const formatKey = (key) => {
  return key
    .replace(/([A-Z])/g, ' $1')
    .replace(/^./, str => str.toUpperCase());
};

const formatValue = (key, value) => {
  if (value === null || value === undefined) return 'N/A';
  
  if (key.toLowerCase().includes('date')) {
    return new Date(value).toLocaleString();
  }
  
  if (typeof value === 'boolean') {
    return value ? 'Sí' : 'No';
  }
  
  return String(value);
};

export default ExpandableRow;