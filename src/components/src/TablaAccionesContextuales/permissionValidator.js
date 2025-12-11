/**
 * Valida permisos del usuario para acciones específicas
 */
export const validatePermission = (userPermissions, action, document = null) => {
  if (!userPermissions) {
    throw new Error('Permisos de usuario no disponibles');
  }
  
  const permissionMap = {
    'view': 'view',
    'preview': 'view',
    'open': 'view',
    'edit': 'edit',
    'update': 'edit',
    'delete': 'delete',
    'remove': 'delete',
    'export': 'export',
    'download': 'export',
    'approve': 'approve',
    'reject': 'approve'
  };
  
  const requiredPermission = permissionMap[action] || action;
  
  if (!userPermissions[requiredPermission]) {
    return {
      allowed: false,
      message: `No tiene permisos para ${action} documentos`
    };
  }
  
  // Validaciones adicionales basadas en el documento
  if (document) {
    // No permitir eliminar documentos aprobados si no es admin
    if (action === 'delete' && document.status === 'Aprobado') {
      if (!userPermissions.deleteProtected) {
        return {
          allowed: false,
          message: 'No puede eliminar documentos aprobados'
        };
      }
    }
    
    // No permitir editar documentos eliminados
    if (action === 'edit' && document.status === 'Eliminado') {
      return {
        allowed: false,
        message: 'No puede editar documentos eliminados'
      };
    }
  }
  
  return { allowed: true };
};

/**
 * Valida datos antes de ejecutar acciones
 */
export const validateDocumentForAction = (document, action) => {
  if (!document) {
    throw new Error('Documento no proporcionado');
  }
  
  const validations = {
    edit: () => {
      if (!document.name || document.name.trim() === '') {
        throw new Error('El documento no tiene un nombre válido');
      }
      if (document.status === 'Eliminado') {
        throw new Error('No se puede editar un documento eliminado');
      }
    },
    delete: () => {
      if (!document.id) {
        throw new Error('Documento sin ID válido');
      }
    },
    view: () => {
      if (!document.name) {
        throw new Error('Documento sin nombre');
      }
    }
  };
  
  const validationFn = validations[action];
  if (validationFn) {
    validationFn();
  }
  
  return true;
};

/**
 * Obtiene el icono para cada tipo de acción
 */
export const getActionIcon = (action) => {
  const icons = {
    view: '👁️',
    edit: '✏️',
    delete: '🗑️',
    export: '📤',
    download: '⬇️',
    preview: '🔍',
    approve: '✅',
    reject: '❌',
    share: '📤',
    copy: '📋'
  };
  
  return icons[action] || '🔧';
};

/**
 * Obtiene el color para cada tipo de acción
 */
export const getActionColor = (action) => {
  const colors = {
    view: '#2196F3',
    edit: '#FF9800',
    delete: '#F44336',
    export: '#4CAF50',
    download: '#9C27B0',
    preview: '#009688',
    approve: '#4CAF50',
    reject: '#F44336',
    share: '#3F51B5',
    copy: '#607D8B'
  };
  
  return colors[action] || '#757575';
};