import React, { useState, useEffect } from 'react';
import ExpandableTable from './components/ExpandableTable/ExpandableTable';
import { sanitizeDocumentData } from './utils/dataValidation';

// Datos de ejemplo para gestión documental
const initialDocuments = [
  {
    id: 'doc-001',
    name: 'Informe Anual 2023',
    type: 'PDF',
    lastModified: '2023-12-15',
    size: '2.4 MB',
    status: 'Aprobado',
    details: {
      autor: 'Juan Pérez',
      departamento: 'Finanzas',
      version: '3.2',
      fechaCreacion: '2023-11-01',
      palabrasClave: ['finanzas', 'reporte', 'anual'],
      metadata: {
        paginas: 45,
        revisiones: 3,
        seguridad: 'Alta',
        formato: 'PDF/A-2'
      }
    }
  },
  {
    id: 'doc-002',
    name: 'Propuesta Comercial Q4',
    type: 'Word',
    lastModified: '2023-12-10',
    size: '1.8 MB',
    status: 'Pendiente',
    details: {
      autor: 'María González',
      departamento: 'Ventas',
      version: '1.0',
      fechaCreacion: '2023-12-05',
      palabrasClave: ['ventas', 'propuesta', 'comercial'],
      metadata: {
        paginas: 28,
        revisiones: 1,
        seguridad: 'Media',
        formato: 'DOCX'
      }
    }
  },
  {
    id: 'doc-003',
    name: 'Análisis de Mercado',
    type: 'Excel',
    lastModified: '2023-12-05',
    size: '3.1 MB',
    status: 'Finalizado',
    details: {
      autor: 'Carlos Rodríguez',
      departamento: 'Marketing',
      version: '2.5',
      fechaCreacion: '2023-11-20',
      palabrasClave: ['marketing', 'análisis', 'datos'],
      metadata: {
        paginas: 12,
        revisiones: 4,
        seguridad: 'Media',
        formato: 'XLSX',
        hojas: 3
      }
    }
  },
  {
    id: 'doc-004',
    name: 'Contrato de Servicios',
    type: 'PDF',
    lastModified: '2023-11-28',
    size: '4.2 MB',
    status: 'Rechazado',
    details: {
      autor: 'Ana López',
      departamento: 'Legal',
      version: '1.2',
      fechaCreacion: '2023-11-15',
      palabrasClave: ['legal', 'contrato', 'servicios'],
      metadata: {
        paginas: 60,
        revisiones: 2,
        seguridad: 'Alta',
        formato: 'PDF',
        firmado: false
      }
    }
  },
  {
    id: 'doc-005',
    name: 'Manual de Procedimientos',
    type: 'PDF',
    lastModified: '2023-11-20',
    size: '5.6 MB',
    status: 'Aprobado',
    details: {} // Documento sin detalles para demostrar la validación
  },
  {
    id: 'doc-006',
    name: 'Presupuesto 2024',
    type: 'Excel',
    lastModified: '2023-12-12',
    size: '2.1 MB',
    status: 'Pendiente',
    // Sin propiedad details para demostrar la validación
  }
];

function App() {
  const [documents, setDocuments] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // Simular carga de datos
  useEffect(() => {
    setLoading(true);
    
    // Simular llamada a API
    setTimeout(() => {
      const sanitizedDocs = sanitizeDocumentData(initialDocuments);
      setDocuments(sanitizedDocs);
      setLoading(false);
    }, 1000);
  }, []);
  
  const handleRefresh = () => {
    setLoading(true);
    
    // Simular recarga de datos
    setTimeout(() => {
      const refreshedDocs = sanitizeDocumentData([
        ...initialDocuments,
        {
          id: `doc-${Date.now()}`,
          name: 'Nuevo Documento',
          type: 'PDF',
          lastModified: new Date().toISOString(),
          size: '1.2 MB',
          status: 'Pendiente',
          details: {
            autor: 'Sistema',
            departamento: 'General',
            version: '1.0'
          }
        }
      ]);
      setDocuments(refreshedDocs);
      setLoading(false);
    }, 800);
  };
  
  return (
    <div className="App">
      <header className="App-header">
        <h1>Sistema de Gestión Documental</h1>
        <p>Tabla expandible con persistencia de estado</p>
      </header>
      
      <main>
        {loading ? (
          <div className="loading-container">
            <div className="loading-spinner"></div>
            <p>Cargando documentos...</p>
          </div>
        ) : (
          <ExpandableTable 
            documents={documents} 
            onRefresh={handleRefresh}
          />
        )}
      </main>
      
      <style jsx>{`
        .App {
          min-height: 100vh;
          background-color: #f5f7fa;
          padding: 20px;
        }
        
        .App-header {
          text-align: center;
          padding: 20px;
          margin-bottom: 30px;
        }
        
        .App-header h1 {
          color: #333;
          margin-bottom: 10px;
        }
        
        .App-header p {
          color: #666;
          font-size: 1.1rem;
        }
        
        .loading-container {
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
          height: 400px;
          gap: 20px;
        }
        
        .loading-spinner {
          width: 50px;
          height: 50px;
          border: 5px solid #f3f3f3;
          border-top: 5px solid #667eea;
          border-radius: 50%;
          animation: spin 1s linear infinite;
        }
        
        @keyframes spin {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
      `}</style>
    </div>
  );
}

export default App;