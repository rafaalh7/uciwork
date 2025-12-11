/**
 * Valida datos de documentos para prevenir errores
 */
export const validateDocumentData = (document) => {
  if (!document || typeof document !== 'object') {
    throw new Error('Documento inválido');
  }
  
  const requiredFields = ['id', 'name', 'type'];
  const missingFields = requiredFields.filter(field => !document[field]);
  
  if (missingFields.length > 0) {
    throw new Error(`Documento incompleto. Faltan: ${missingFields.join(', ')}`);
  }
  
  // Validar tipos de datos
  if (typeof document.id !== 'string') {
    throw new Error('ID de documento inválido');
  }
  
  if (typeof document.name !== 'string' || document.name.trim() === '') {
    throw new Error('Nombre de documento inválido');
  }
  
  // Validar tamaño si existe
  if (document.size && !/^\d+(\.\d+)?\s*(KB|MB|GB|TB)$/i.test(document.size)) {
    console.warn(`Tamaño de documento inválido: ${document.size}`);
  }
  
  // Validar fecha si existe
  if (document.lastModified) {
    const date = new Date(document.lastModified);
    if (isNaN(date.getTime())) {
      console.warn(`Fecha de modificación inválida: ${document.lastModified}`);
    }
  }
  
  return true;
};

/**
 * Sanitiza datos de documento para evitar problemas de seguridad
 */
export const sanitizeDocumentData = (document) => {
  const safeDocument = { ...document };
  
  // Sanitizar strings
  ['name', 'type', 'status', 'owner'].forEach(field => {
    if (safeDocument[field]) {
      safeDocument[field] = safeDocument[field]
        .toString()
        .replace(/[<>]/g, '') // Remover tags HTML
        .trim();
    }
  });
  
  // Sanitizar descripción
  if (safeDocument.description) {
    safeDocument.description = safeDocument.description
      .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
      .trim();
  }
  
  return safeDocument;
};