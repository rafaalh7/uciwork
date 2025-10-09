// App.tsx
import React from 'react';
import { SortableTable } from './components/SortableTable';
import { SortIndicator } from './components/SortIndicator';
import { User, ColumnConfig } from './types/user';

// Datos de ejemplo
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Juan Pérez',
    email: 'juan@example.com',
    role: 'admin',
    status: 'active',
    createdAt: '2023-01-15',
    lastLogin: '2024-01-20',
    age: 28
  },
  {
    id: '2',
    name: 'María García',
    email: 'maria@example.com',
    role: 'user',
    status: 'pending',
    createdAt: '2023-03-22',
    lastLogin: '2024-01-18',
    age: 32
  },
  {
    id: '3',
    name: 'Carlos López',
    email: 'carlos@example.com',
    role: 'moderator',
    status: 'active',
    createdAt: '2023-02-10',
    lastLogin: '2024-01-19',
    age: 25
  },
  {
    id: '4',
    name: 'Ana Martínez',
    email: 'ana@example.com',
    role: 'user',
    status: 'inactive',
    createdAt: '2023-04-05',
    lastLogin: '2023-12-15',
    age: 35
  }
];

const columns: ColumnConfig[] = [
  { key: 'name', label: 'Nombre', sortable: true, type: 'string' },
  { key: 'email', label: 'Email', sortable: true, type: 'string' },
  { key: 'role', label: 'Rol', sortable: true, type: 'string' },
  { key: 'status', label: 'Estado', sortable: true, type: 'string' },
  { key: 'age', label: 'Edad', sortable: true, type: 'number' },
  { key: 'createdAt', label: 'Fecha Creación', sortable: true, type: 'date' },
  { key: 'lastLogin', label: 'Último Login', sortable: true, type: 'date' },
];

export const App: React.FC = () => {
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-2xl font-bold mb-6">Tabla de Usuarios - Ordenamiento Multi-columna</h1>
      
      <SortIndicator />
      
      <SortableTable 
        data={mockUsers} 
        columns={columns} 
      />
      
      <div className="mt-6 text-sm text-gray-600">
        <p><strong>Instrucciones:</strong></p>
        <ul className="list-disc list-inside mt-2">
          <li>Haz clic en cualquier encabezado para ordenar</li>
          <li>Haz clic múltiples veces para cambiar dirección o agregar ordenamiento múltiple</li>
          <li>Los números indican el orden de prioridad del ordenamiento</li>
          <li>El estado se mantiene al recargar la página</li>
        </ul>
      </div>
    </div>
  );
};

export default App;