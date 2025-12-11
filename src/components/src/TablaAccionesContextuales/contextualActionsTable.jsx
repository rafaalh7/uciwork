import React, { useState, useCallback } from 'react';
import DocumentRow from './DocumentRow';
import ActionsHistoryPanel from './ActionsHistoryPanel';
import RoleSelector from './RoleSelector';
import { useUserStore, useActionsHistoryStore } from '../../stores';
import { sanitizeDocumentData } from '../../utils/documentValidator';
import './ContextualActionsTable.css';

const ContextualActionsTable = ({ documents = [], onDocumentsChange }) => {
  const [selectedDocuments, setSelectedDocuments] = useState([]);
  const [showHistory, setShowHistory] = useState(false);
  const [notification, setNotification] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  
  const { user, hasPermission } = useUserStore();
  const { actionsHistory, getStats, clearHistory } = useActionsHistoryStore();
  
  const handleActionCompleted = useCallback((action, data) => {
    // Mostrar notificación
    let message = '';
    let type = 'info';
    
    if (action === 'error') {
      message = `Error: ${data.message}`;
      type = 'error';
    } else {
      message = `Acción "${action}" completada en "${data.document.name}"`;
      type = 'success';
    }
    
    setNotification({ message, type });
    
    // Ocultar notificación después de 3 segundos
    setTimeout(() => {
      setNotification(null);
    }, 3000);
    
    // Si la acción fue eliminar, actualizar la lista
    if (action === 'delete' && onDocumentsChange) {
      const updatedDocs = documents.filter(doc => doc.id !== data.document.id);
      onDocumentsChange(updatedDocs);
    }
  }, [documents, onDocumentsChange]);
  
  const handleBulkAction = (action) => {
    if (selectedDocuments.length === 0) {
      setNotification({
        message: 'Seleccione al menos un documento',
        type: 'warning'
      });
      return;
    }
    
    // Verificar permisos para acción masiva
    if (!hasPermission(action)) {
      setNotification({
        message: `No tiene permisos para ${action} documentos`,
        type: 'error'
      });
      return;
    }
    
    // Ejecutar acción en todos los documentos seleccionados
    selectedDocuments.forEach(docId => {
      const document = documents.find(d => d.id === docId);
      if (document) {
        // Aquí se ejecutaría la acción masiva
        console.log(`Ejecutando ${action} en ${document.name}`);
      }
    });
    
    setNotification({
      message: `Acción "${action}" aplicada a ${selectedDocuments.length} documentos`,
      type: 'success'
    });
    
    // Limpiar selección
    setSelectedDocuments([]);
  };
  
  const handleSelectAll = (e) => {
    if (e.target.checked) {
      setSelectedDocuments(documents.map(doc => doc.id));
    } else {
      setSelectedDocuments([]);
    }
  };
  
  const handleSelectDocument = (docId) => {
    setSelectedDocuments(prev => {
      if (prev.includes(docId)) {
        return prev.filter(id => id !== docId);
      } else {
        return [...prev, docId];
      }
    });
  };
  
  const filteredDocuments = documents.filter(doc => {
    if (!searchTerm) return true;
    
    const searchLower = searchTerm.toLowerCase();
    return (
      doc.name.toLowerCase().includes(searchLower) ||
      doc.type.toLowerCase().includes(searchLower) ||
      (doc.description && doc.description.toLowerCase().includes(searchLower)) ||
      doc.status.toLowerCase().includes(searchLower)
    );
  });
  
  const stats = getStats();
  
  return (
    <div className="contextual-actions-container">
      {/* Header con controles */}
      <div className="table-header-controls">
        <div className="header-left">
          <h2>📁 Gestión Documental</h2>
          <RoleSelector />
        </div>
        
        <div className="header-right">
          <div className="search-container">
            <input
              type="text"
              placeholder="Buscar documentos..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="search-input"
            />
            <span className="search-icon">🔍</span>