import React from 'react'
import Table from './components/Table'

// Datos de ejemplo
const sampleData = [
  { id: 1, name: 'Ana García', date: '2023-05-15', department: 'Ventas', priority: 2 },
  { id: 2, name: 'Carlos Rodríguez', date: '2023-03-22', department: 'TI', priority: 1 },
  { id: 3, name: 'María López', date: '2023-07-10', department: 'Marketing', priority: 3 },
  { id: 4, name: 'Juan Martínez', date: '2023-01-05', department: 'Ventas', priority: 2 },
  { id: 5, name: 'Laura Sánchez', date: '2023-11-30', department: 'RH', priority: 1 },
  { id: 6, name: 'Pedro Fernández', date: '2023-08-17', department: 'TI', priority: 3 },
  { id: 7, name: 'Sofía Díaz', date: '2023-04-08', department: 'Marketing', priority: 2 },
  { id: 8, name: 'Diego Pérez', date: '2023-12-25', department: 'Ventas', priority: 1 }
]

// Configuración de columnas
const columns = [
  { key: 'id', title: 'ID' },
  { key: 'name', title: 'Nombre' },
  { key: 'date', title: 'Fecha' },
  { key: 'department', title: 'Departamento' },
  { key: 'priority', title: 'Prioridad' }
]

function App() {
  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h1>Tabla de Documentos</h1>
      <p>Haz clic en los encabezados para ordenar. Mantén Shift para ordenar por múltiples columnas.</p>
      <Table data={sampleData} columns={columns} />
    </div>
  )
}

export default App