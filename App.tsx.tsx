// App.tsx
import React from 'react';
import FormComponent from './FormComponent';

const App: React.FC = () => {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Aplicación con Historial Undo/Redo</h1>
      <FormComponent />
    </div>
  );
};

export default App;