// App.jsx
import React from 'react';
import { TableProvider, useTable } from './store/tableStore';
import TableComponent from './components/TableComponent';
import ExportControls from './components/ExportControls';
import ExportHistory from './components/ExportHistory';
import Alert from './components/Alert';
import './styles/App.css';

// Datos de ejemplo
const sampleData = [
  { id: 1, name: 'Ana García', email: 'ana@empresa.com', department: 'Ventas', salary: 45000, hireDate: '2022-03-15' },
  { id: 2, name: 'Carlos López', email: 'carlos@empresa.com', department: 'Marketing', salary: 52000, hireDate: '2021-07-22' },
  { id: 3, name: 'María Rodríguez', email: 'maria@empresa.com', department: 'TI', salary: 68000, hireDate: '2020-11-05' },
  { id: 4, name: 'José Martínez', email: 'jose@empresa.com', department: 'Finanzas', salary: 55000, hireDate: '2023-01-30' },
  { id: 5, name: 'Laura Pérez', email: 'laura@empresa.com', department: 'Recursos Humanos', salary: 48000, hireDate: '2022-09-12' },
  { id: 6, name: 'Miguel Sánchez', email: 'miguel@empresa.com', department: 'Ventas', salary: 47000, hireDate: '2023-05-18' },
  { id: 7, name: 'Elena Gómez', email: 'elena@empresa.com', department: 'Marketing', salary: 53000, hireDate: '2021-12-03' },
  { id: 8, name: 'David Fernández', email: 'david@empresa.com', department: 'TI', salary: 72000, hireDate: '2020-08-14' },
  { id: 9, name: 'Sofía Díaz', email: 'sofia@empresa.com', department: 'Finanzas', salary: 58000, hireDate: '2022-11-27' },
  { id: 10, name: 'Javier Ruiz', email: 'javier@empresa.com', department: 'Recursos Humanos', salary: 49000, hireDate: '2023-03-08' }
];

function AppContent() {
  const { alert } = useTable();

  return (
    <div className="app">
      <header className="app-header">
        <h1>Tabla Dinámica con Exportación</h1>
        <p>Gestión de datos con capacidad de exportación en diferentes formatos</p>
      </header>

      <main className="app-main">
        {alert && <Alert type={alert.type} message={alert.message} />}
        
        <div className="controls-section">
          <ExportControls />
        </div>

        <div className="table-section">
          <TableComponent data={sampleData} />
        </div>

        <div className="history-section">
          <ExportHistory />
        </div>
      </main>
    </div>
  );
}

function App() {
  return (
    <TableProvider>
      <AppContent />
    </TableProvider>
  );
}

export default App;