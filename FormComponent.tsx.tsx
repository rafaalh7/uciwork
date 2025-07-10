// FormComponent.tsx
import React, { useState, useEffect } from 'react';
import { useHistory } from './use-history';

const FormComponent: React.FC = () => {
  const { state, commitState, undo, redo, canUndo, canRedo } = useHistory();
  const [formData, setFormData] = useState(state);
  
  // Sincronizar el estado del formulario cuando cambia el historial
  useEffect(() => {
    setFormData(state);
  }, [state]);
  
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };
  
  const handleBlur = () => {
    commitState(formData);
  };
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    commitState(formData);
    alert(`Form submitted: ${JSON.stringify(formData)}`);
  };
  
  return (
    <div style={{ maxWidth: '500px', margin: '0 auto' }}>
      <h2>Formulario con Historial</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="firstName">Nombre:</label>
          <input
            id="firstName"
            name="firstName"
            type="text"
            value={formData.firstName}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        
        <div style={{ marginBottom: '1rem' }}>
          <label htmlFor="lastName">Apellido:</label>
          <input
            id="lastName"
            name="lastName"
            type="text"
            value={formData.lastName}
            onChange={handleChange}
            onBlur={handleBlur}
            style={{ width: '100%', padding: '0.5rem' }}
          />
        </div>
        
        <div style={{ display: 'flex', gap: '1rem', marginBottom: '1rem' }}>
          <button 
            type="button" 
            onClick={undo} 
            disabled={!canUndo}
            style={{ padding: '0.5rem 1rem' }}
          >
            Deshacer (Undo)
          </button>
          
          <button 
            type="button" 
            onClick={redo} 
            disabled={!canRedo}
            style={{ padding: '0.5rem 1rem' }}
          >
            Rehacer (Redo)
          </button>
        </div>
        
        <button 
          type="submit" 
          style={{ padding: '0.5rem 1rem', backgroundColor: '#4CAF50', color: 'white' }}
        >
          Enviar
        </button>
      </form>
      
      <div style={{ marginTop: '2rem' }}>
        <h3>Estado actual:</h3>
        <pre>{JSON.stringify(state, null, 2)}</pre>
      </div>
    </div>
  );
};

export default FormComponent;