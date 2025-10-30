// App.tsx
import React from 'react';
import { SortableTable } from './components/SortableTable';
import { User, ColumnConfig } from './types/user';

// Datos de ejemplo
const mockUsers: User[] = [
  {
    id: '1',
    name: 'Juan Pérez',
    email: 'juan@example.com',
    role: 'admin',
    status: 'active',
    createdAt: new Date('2023-01-15'),
    lastLogin: new Date('2024-01-20'),
    age: 28
  },
  {
    id: '2',
    name: 'María García',
    email: 'maria@example.com',
    role: 'user',
    status: 'pending',
    createdAt: new Date('2023-03-20'),
    lastLogin: new Date('2024-01-18'),
    age: 32
  },
  {
    id: '3',
    name: 'Carlos López',
    email: 'carlos@example.com',
    role: 'moderator',
    status: 'active',
    createdAt: new Date('2023-02-10'),
    lastLogin: new Date('2024-01-19'),
    age: 25
  },
  {
    id: '4',
    name: 'Ana Martínez',
    email: 'ana@example.com',
    role: 'user',
    status: 'inactive',
    createdAt: new Date('2023-04-05'),
    lastLogin: new Date('2023-12-15'),
    age: 41
  }
];

// Configuración de columnas
const columns: ColumnConfig[] = [
  { key: 'name', label: 'Nombre', sortable: true, type: 'string' },
  { key: 'email', label: 'Email', sortable: true, type: 'string' },
  { key: 'role', label: 'Rol', sortable: true, type: 'string' },
  { key: 'status', label: 'Estado', sortable: true, type: 'string' },
  { key: 'age', label: 'Edad', sortable: true, type: 'number' },
  { key: 'createdAt', label: 'Fecha Creación', sortable: true, type: 'date' },
  { key: 'lastLogin', label: 'Último Login', sortable: true, type: 'date' },
];

export default function App() {
  return (
    <div className="app">
      <h1>Tabla de Usuarios - Ordenamiento Multi-columna</h1>
      <SortableTable data={mockUsers} columns={columns} />
    </div>
  );
}