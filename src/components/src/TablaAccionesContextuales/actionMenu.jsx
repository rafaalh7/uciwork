import React, { useRef, useState } from 'react';
import { useClickOutside } from '../../hooks/useClickOutside';
import { 
  validatePermission, 
  getActionIcon, 
  getActionColor 
} from '../../utils/permissionValidator';
import './ContextualActionsTable.css';

const ActionMenu = ({ 
  document, 
  userPermissions, 
  position = { x: 0, y: 0 },
  onAction,
  onClose 
}) => {
  const menuRef = useRef(null);
  const [submenuOpen, setSubmenuOpen] = useState(null);
  
  useClickOutside(menuRef, onClose);
  
  const actionGroups = [
    {
      title: 'Acciones Principales',
      actions: [
        { id: 'view', label: 'Ver Documento', icon: '👁️', shortcut: 'Ctrl+V' },
        { id: 'preview', label: 'Vista Previa', icon: '🔍', shortcut: 'Ctrl+P' },
        { id: 'edit', label: 'Editar', icon: '✏️', shortcut: 'Ctrl+E' },
      ]
    },
    {
      title: 'Gestión',
      actions: [
        { id: 'download', label: 'Descargar', icon: '⬇️', shortcut: 'Ctrl+D' },
        { id: 'export', label: 'Exportar PDF', icon: '📤' },
        { id: 'share', label: 'Compartir', icon: '📤', shortcut: 'Ctrl+S' },
        { id: 'copy', label: 'Copiar Enlace', icon: '📋' },
      ]
    },
    {
      title: 'Administración',
      actions: [
        { id: 'approve', label: 'Aprobar', icon: '✅', color: '#4CAF50' },
        { id: 'reject', label: 'Rechazar', icon: '❌', color: '#F44336' },
        { id: 'delete', label: 'Eliminar', icon: '🗑️', color: '#F44336', destructive: true },
      ]
    }
  ];
  
  const handleActionClick = (actionId) => {
    const permissionCheck = validatePermission(userPermissions, actionId, document);
    
    if (!permissionCheck.allowed) {
      // Mostrar error de permisos
      onAction('error', {
        action: actionId,
        document,
        message: permissionCheck.message
      });
      return;
    }
    
    // Cerrar submenús
    setSubmenuOpen(null);
    
    // Ejecutar acción
    onAction(actionId, document);
  };
  
  const handleSubmenuToggle = (groupId) => {
    setSubmenuOpen(submenuOpen === groupId ? null : groupId);
  };
  
  const menuStyle = {
    position: 'fixed',
    left: `${position.x}px`,
    top: `${position.y}px`,
    zIndex: 1000
  };
  
  return (
    <div className="action-menu-container" style={menuStyle} ref={menuRef}>
      <div className="action-menu-header">
        <div className="document-info">
          <span className="document-icon">
            {getDocumentIcon(document?.type)}
          </span>
          <div>
            <h4>{document?.name || 'Documento'}</h4>
            <small>{document?.type || 'Tipo desconocido'}</small>
          </div>
        </div>
        <button className="close-menu-btn" onClick={onClose}>
          ×
        </button>
      </div>
      
      <div className="action-menu-content">
        {actionGroups.map((group, groupIndex) => (
          <div key={groupIndex} className="action-group">
            <div 
              className="action-group-header"
              onClick={() => handleSubmenuToggle(groupIndex)}
            >
              <span className="group-title">{group.title}</span>
              <span className="group-toggle">
                {submenuOpen === groupIndex ? '▲' : '▼'}
              </span>
            </div>
            
            <div className={`action-list ${submenuOpen === groupIndex ? 'open' : ''}`}>
              {group.actions.map((action) => {
                const permissionCheck = validatePermission(userPermissions, action.id, document);
                const isAllowed = permissionCheck.allowed;
                
                return (
                  <button
                    key={action.id}
                    className={`action-item ${!isAllowed ? 'disabled' : ''} ${action.destructive ? 'destructive' : ''}`}
                    onClick={() => isAllowed && handleActionClick(action.id)}
                    disabled={!isAllowed}
                    title={!isAllowed ? permissionCheck.message : action.label}
                    style={{ 
                      '--action-color': action.color || getActionColor(action.id),
                      cursor: isAllowed ? 'pointer' : 'not-allowed'
                    }}
                  >
                    <span className="action-icon">{action.icon || getActionIcon(action.id)}</span>
                    <span className="action-label">{action.label}</span>
                    {action.shortcut && (
                      <span className="action-shortcut">{action.shortcut}</span>
                    )}
                    {!isAllowed && (
                      <span className="permission-lock">🔒</span>
                    )}
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>
      
      <div className="action-menu-footer">
        <small>
          Rol actual: <strong>{userPermissions?.role || 'Invitado'}</strong>
        </small>
      </div>
    </div>
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

export default ActionMenu;