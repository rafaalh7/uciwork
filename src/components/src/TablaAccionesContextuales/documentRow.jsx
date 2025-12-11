import React, { useState, useRef } from 'react';
import ActionMenu from './ActionMenu';
import ConfirmationModal from './ConfirmationModal';
import { useUserStore, useActionsHistoryStore } from '../../stores';
import { validateDocumentForAction } from '../../utils/permissionValidator';
import { sanitizeDocumentData } from '../../utils/documentValidator';
import './ContextualActionsTable.css';

const DocumentRow = ({ document, onActionCompleted, index }) => {
  const [showMenu, setShowMenu] = useState(false);
  const [showConfirmation, setShowConfirmation] = useState(false);
  const [pendingAction, setPendingAction] = useState(null);
  const [menuPosition, setMenuPosition] = useState({ x: 0, y: 0 });
  
  const menuButtonRef = useRef(null);
  const rowRef = useRef(null);
  
  const { user, hasPermission } = useUserStore();
  const { addAction, addFailedAction } = useActionsHistoryStore();
  
  const handleMenuButtonClick = (e) => {
    e.stopPropagation();
    
    const buttonRect = e.currentTarget.getBoundingClientRect();
    setMenuPosition({
      x: buttonRect.left - 200, // Ajustar para que no se salga de la pantalla
      y: buttonRect.bottom + 5
    });
    
    setShowMenu(true);
  };
  
  const handleActionClick = (action, doc) => {
    setShowMenu(false);
    
    try {
      // Validar documento antes de cualquier acción
      validateDocumentForAction(doc, action);
      
      // Verificar si requiere confirmación
      const requiresConfirmation = ['delete', 'approve', 'reject'].includes(action);
      
      if (requiresConfirmation) {
        setPendingAction({ action, document: doc });
        setShowConfirmation(true);
      } else {
        executeAction(action, doc);
      }
    } catch (error) {
      console.error('Error validando acción:', error);
      addFailedAction({
        type: action,
        documentId: doc.id,
        documentName: doc.name
      }, error);
      
      onActionCompleted?.('error', {
        action,
        document: doc,
        message: error.message
      });
    }
  };
  
  const executeAction = async (action, doc) => {
    try {
      // Registrar inicio de acción
      const actionRecord = {
        type: action,
        documentId: doc.id,
        documentName: doc.name,
        userId: user.id,
        userName: user.name,
        timestamp: new Date().toISOString()
      };
      
      // Simular ejecución de acción
      await simulateActionExecution(action, doc);
      
      // Registrar acción exitosa
      const completedAction = addAction({
        ...actionRecord,
        details: {
          action,
          document: sanitizeDocumentData(doc),
          timestamp: new Date().toISOString()
        }
      });
      
      // Notificar acción completada
      onActionCompleted?.(action, {
        action: completedAction,
        document: doc,
        success: true
      });
      
      // Mostrar feedback visual
      showActionFeedback(action, doc);
      
    } catch (error) {
      console.error('Error ejecutando acción:', error);
      
      // Registrar acción fallida
      addFailedAction({
        type: action,
        documentId: doc.id,
        documentName: doc.name,
        userId: user.id
      }, error);
      
      onActionCompleted?.('error', {
        action,
        document: doc,
        message: error.message,
        success: false
      });
    }
  };
  
  const simulateActionExecution = (action, doc) => {
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // Simular diferentes respuestas basadas en la acción
        switch(action) {
          case 'delete':
            if (doc.status === 'Aprobado' && user.role !== 'admin') {
              reject(new Error('No puede eliminar documentos aprobados'));
            } else {
              resolve({ success: true, message: 'Documento eliminado' });
            }
            break;
          case 'edit':
            if (!doc.name || doc.name.trim() === '') {
              reject(new Error('Documento sin nombre válido'));
            } else {
              resolve({ success: true, message: 'Documento editado' });
            }
            break;
          case 'view':
            resolve({ success: true, message: 'Documento abierto' });
            break;
          default:
            resolve({ success: true, message: `Acción ${action} completada` });
        }
      }, 500); // Simular delay de red
    });
  };
  
  const showActionFeedback = (action, doc) => {
    const row = rowRef.current;
    if (!row) return;
    
    // Añadir clase de feedback
    row.classList.add(`action-${action}-feedback`);
    
    // Remover clase después de la animación
    setTimeout(() => {
      row.classList.remove(`action-${action}-feedback`);
    }, 1000);
  };
  
  const handleConfirmAction = () => {
    if (pendingAction) {
      executeAction(pendingAction.action, pendingAction.document);
    }
    setShowConfirmation(false);
    setPendingAction(null);
  };
  
  const handleCancelAction = () => {
    setShowConfirmation(false);
    setPendingAction(null);
  };
  
  const getStatusBadgeClass = (status) => {
    if (!status) return 'status-default';
    
    const statusLower = status.toLowerCase();
    if (statusLower.includes('aprobado')) return 'status-approved';
    if (statusLower.includes('pendiente')) return 'status-pending';
    if (statusLower.includes('rechazado')) return 'status-rejected';
    if (statusLower.includes('eliminado')) return 'status-deleted';
    if (statusLower.includes('finalizado')) return 'status-completed';
    return 'status-default';
  };
  
  const canEdit = hasPermission('edit');
  const canDelete = hasPermission('delete');
  
  return (
    <>
      <tr 
        ref={rowRef}
        className={`document-row ${index % 2 === 0 ? 'even' : 'odd'}`}
        data-document-id={document.id}
      >
        <td className="document-name-cell">
          <div className="document-info">
            <span className="document-type-icon">
              {getDocumentIcon(document.type)}
            </span>
            <div>
              <span className="document-name">{document.name}</span>
              {document.description && (
                <small className="document-description">{document.description}</small>
              )}
            </div>
          </div>
        </td>
        
        <td>
          <span className={`status-badge ${getStatusBadgeClass(document.status)}`}>
            {document.status || 'Sin estado'}
          </span>
        </td>
        
        <td>{document.type || 'N/A'}</td>
        
        <td>
          {document.lastModified 
            ? new Date(document.lastModified).toLocaleDateString()
            : 'N/A'
          }
        </td>
        
        <td>{document.size || 'N/A'}</td>
        
        <td className="actions-cell">
          <div className="quick-actions">
            {canEdit && (
              <button 
                className="quick-action-btn edit-btn"
                onClick={() => handleActionClick('edit', document)}
                title="Editar documento"
              >
                ✏️
              </button>
            )}
            
            <button 
              className="quick-action-btn view-btn"
              onClick={() => handleActionClick('view', document)}
              title="Ver documento"
            >
              👁️
            </button>
            
            <div className="context-menu-container">
              <button
                ref={menuButtonRef}
                className="context-menu-btn"
                onClick={handleMenuButtonClick}
                title="Más acciones"
                aria-label="Menú contextual"
              >
                <span className="menu-dots">⋯</span>
              </button>
              
              {showMenu && (
                <ActionMenu
                  document={document}
                  userPermissions={user.permissions}
                  position={menuPosition}
                  onAction={handleActionClick}
                  onClose={() => setShowMenu(false)}
                />
              )}
            </div>
          </div>
        </td>
      </tr>
      
      <ConfirmationModal
        isOpen={showConfirmation}
        action={pendingAction?.action}
        document={pendingAction?.document}
        onConfirm={handleConfirmAction}
        onCancel={handleCancelAction}
        confirmText={pendingAction?.action === 'delete' ? 'Eliminar' : 'Confirmar'}
        type={pendingAction?.action === 'delete' ? 'danger' : 'warning'}
      />
    </>
  );
};

const getDocumentIcon = (type) => {
  const typeLower = type?.toLowerCase() || '';
  if (typeLower.includes('pdf')) return '📄';
  if (typeLower.includes('word') || typeLower.includes('doc')) return '📝';
  if (typeLower.includes('excel') || typeLower.includes('xls')) return '📊';
  if (typeLower.includes('image')) return '🖼️';
  if (typeLower.includes('video')) return '🎬';
  if (typeLower.includes('zip')) return '🗜️';
  return '📋';
};

export default DocumentRow;