import React from 'react';
import SearchComponent from './SearchComponent';

const DemoPage = () => {
  const emptyData = [];
  const demoData = [
    { id: 1, name: 'Resultado de ejemplo 1', category: 'Demo' },
    { id: 2, name: 'Resultado de ejemplo 2', category: 'Prueba' }
  ];

  return (
    <div className="demo-container">
      <h2>Estado: Búsqueda en curso</h2>
      <SearchComponent 
        data={demoData} 
        searchKeys={['name']}
        placeholder="Escribe para ver estado de carga..."
      />
      
      <h2>Estado: Sin resultados</h2>
      <SearchComponent 
        data={emptyData} 
        searchKeys={['name']}
        placeholder="Escribe algo..."
      />
      
      <h2>Estado: Con resultados</h2>
      <SearchComponent 
        data={demoData} 
        searchKeys={['name', 'category']}
        placeholder="Buscar en datos de demostración..."
      />
      
      <h2>Versión móvil</h2>
      <div style={{ width: '320px', border: '1px solid #eee', padding: '16px' }}>
        <SearchComponent 
          data={demoData} 
          searchKeys={['name']}
          placeholder="Buscar en móvil..."
        />
      </div>
    </div>
  );
};

export default DemoPage;
