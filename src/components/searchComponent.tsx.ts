// SearchComponent.tsx
import React, { useEffect } from 'react';
import { useUserSearchStore } from './searchStore';

const SearchComponent = () => {
  const { searchTerm, filteredData, setSearchTerm, setData } = useUserSearchStore();
  
  // Datos de ejemplo (en una app real vendrían de una API)
  const exampleUsers = [
    { id: 1, name: 'Juan Pérez', email: 'juan@example.com' },
    { id: 2, name: 'María García', email: 'maria@example.com' },
    { id: 3, name: 'Carlos López', email: 'carlos@example.com' },
  ];
  
  useEffect(() => {
    setData(exampleUsers);
  }, [setData]);
  
  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };
  
  return (
    <div>
      <input
        type="text"
        placeholder="Buscar usuarios..."
        value={searchTerm}
        onChange={handleSearchChange}
      />
      
      <div className="results">
        {filteredData.length > 0 ? (
          <ul>
            {filteredData.map(user => (
              <li key={user.id}>
                <h3>{user.name}</h3>
                <p>{user.email}</p>
              </li>
            ))}
          </ul>
        ) : (
          <p>No se encontraron resultados</p>
        )}
      </div>
    </div>
  );
};

export default SearchComponent;