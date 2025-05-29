import React, { useState } from 'react';
import SearchComponent from './SearchComponent';

const App = () => {
  const [users] = useState([
    { id: 1, name: 'María Rodríguez', email: 'maria@example.com', department: 'Ventas' },
    { id: 2, name: 'Carlos Gómez', email: 'carlos@empresa.com', department: 'TI' },
    { id: 3, name: 'Ana Martínez', email: 'ana.m@correo.com', department: 'Marketing' }
  ]);

  const handleSelectUser = (user) => {
    console.log('Usuario seleccionado:', user);
    // Abrir perfil, redirigir, etc.
  };

  return (
    <div className="app-container">
      <h1>Buscador de Usuarios</h1>
      <SearchComponent 
        data={users}
        searchKeys={['name', 'email', 'department']}
        placeholder="Buscar usuarios..."
        onSelectItem={handleSelectUser}
        debounceTime={400}
      />
    </div>
  );
};

export default App;
