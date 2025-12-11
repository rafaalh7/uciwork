/**
 * Valida los detalles de un documento
 * Previene errores si faltan datos
 */
export const validateDocumentDetails = (details) => {
  if (!details || typeof details !== 'object') {
    return false;
  }
  
  try {
    // Verificar que no haya valores inválidos que puedan romper la UI
    const invalidValues = Object.values(details).some(value => {
      if (value === undefined) return true;
      if (typeof value === 'object' && value !== null) {
        try {
          JSON.stringify(value);
          return false;
        } catch {
          return true; // Objeto cíclico o no serializable
        }
      }
      return false;
    });
    
    return !invalidValues;
  } catch (error) {
    console.warn('Error validando detalles del documento:', error);
    return false;
  }
};

/**
 * Valida y sanitiza datos de documentos
 */
export const sanitizeDocumentData = (documents) => {
  if (!Array.isArray(documents)) {
    return [];
  }
  
  return documents.map(doc => ({
    id: doc.id || `doc-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    name: doc.name || 'Documento sin nombre',
    type: doc.type || 'Desconocido',
    lastModified: doc.lastModified || new Date().toISOString(),
    size: doc.size || '0 KB',
    status: doc.status || 'Pendiente',
    details: validateDocumentDetails(doc.details) ? doc.details : {}
  }));
};