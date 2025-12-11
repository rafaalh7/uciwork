import React, { useEffect } from 'react';
import './ContextualActionsTable.css';

const ConfirmationModal = ({
  isOpen,
  title,
  message,
  document,
  action,
  onConfirm,
  onCancel,
  confirmText = 'Confirmar',
  cancelText = 'Cancelar',
  type = 'warning'
}) => {
  useEffect(() => {
    const handleEscape = (e) => {
      if (e.key === 'Escape' && isOpen) {
        onCancel();
      }
    };
    
    document.addEventListener('keydown', handleEscape);
    return () => document.removeEventListener('keydown', handleEscape);
  }, [isOpen, onCancel]);
  
  if (!isOpen) return null;
  
  const getTypeIcon = () => {
    switch(type) {
      case 'danger': return '⚠️';
      case 'warning': return '⚠️';
      case 'info': return 'ℹ️';
      case 'success': return '✅';
      default: return '❓';
    }
  };
  
  const getTypeClass = () => {
    switch(type) {
      case 'danger': return 'danger';
      case 'warning': return 'warning';
      case 'info': return 'info';
      case 'success': return 'success';
      default: return 'info';
    }
  };
  
  const getActionDetails = () => {
    if (!action || !document) return null;
    
    const actionTitles = {
      'delete': 'Eliminar Documento',
      'edit': 'Editar Documento',
      'approve': 'Aprobar Documento',
      'reject': 'Rechazar Documento',
      'export': 'Exportar Documento'
    };
    
    return {
      title: actionTitles[action] || `Realizar acción: ${action}`,
      description: `¿Está seguro de que desea ${action} el documento "${document.name}"?`
    };
  };
  
  const actionDetails = getActionDetails();
  
  return (
    <div className="modal-overlay" onClick={onCancel}>
      <div className="confirmation-modal" onClick={(e) => e.stopPropagation()}>
        <div className={`modal-header ${getTypeClass()}`}>
          <span className="modal-icon">{getTypeIcon()}</span>
          <h3>{title || actionDetails?.title}</h3>
        </div>
        
        <div className="modal-body">
          <p>{message || actionDetails?.description}</p>
          
          {document && (
            <div className="document-preview">
              <div className="preview-header">
                <span className="doc-icon">
                  {getDocumentIcon(document.type)}
                </span>
                <div>
                  <strong>{document.name}</strong>
                  <small>{document.type} • {document.size}</small>
                </div>
              </div>
              
              <div className="preview-details">
                {document.lastModified && (
                  <div className="detail-item">
                    <span>Última modificación:</span>
                    <span>{new Date(document.lastModified).toLocaleDateString()}</span>
                  </div>
                )}
                {document.status && (
                  <div className="detail-item">
                    <span>Estado:</span>
                    <span className={`status-badge status-${document.status.toLowerCase()}`}>
                      {document.status}
                    </span>
                  </div>
                )}
              </div>
            </div>
          )}
          
          {action === 'delete' && (
            <div className="warning-box">
              <strong>⚠️ Advertencia:</strong> Esta acción no se puede deshacer. 
              El documento será eliminado permanentemente del sistema.
            </div>
          )}
        </div>
        
        <div className="modal-footer">
          <button 
            className="cancel-btn"
            onClick={onCancel}
            autoFocus
          >
            {cancelText}
          </button>
          <button 
            className={`confirm-btn ${getTypeClass()}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

const getDocumentIcon = (type) => {
  const typeLower = type?.toLowerCase() || '';
  if (typeLower.includes('pdf')) return '📄';
  if (typeLower.includes('word') || typeLower.includes('doc')) return '📝';
  if (typeLower.includes('excel') || typeLower.includes('xls')) return '📊';
  return '📋';
};

export default ConfirmationModal;