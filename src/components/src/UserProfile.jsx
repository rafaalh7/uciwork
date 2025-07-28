// components/UserProfileForm.jsx
import { useEffect, useState } from 'react';
import { useFormStore, useUndoRedo } from '../stores/formStore';
import { toast } from 'react-toastify';

const UserProfileForm = () => {
  const { present, updateForm } = useFormStore();
  const { canUndo, canRedo, undo, redo } = useUndoRedo();
  const [localForm, setLocalForm] = useState(present);
  
  // Sincronizar el estado local cuando cambia el estado global
  useEffect(() => {
    setLocalForm(present);
  }, [present]);
  
  // Manejar cambios en los campos del formulario
  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // Manejar campos anidados
    const path = name.split('.');
    
    if (path.length > 1) {
      updateForm((draft) => {
        let current = draft;
        for (let i = 0; i < path.length - 1; i++) {
          current = current[path[i]];
        }
        current[path[path.length - 1]] = type === 'checkbox' ? checked : value;
      });
    } else {
      updateForm({ [name]: type === 'checkbox' ? checked : value });
    }
  };
  
  // Manejar atajos de teclado
  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'z') {
        e.preventDefault();
        if (canUndo) undo();
      } else if ((e.ctrlKey || e.metaKey) && e.key === 'y') {
        e.preventDefault();
        if (canRedo) redo();
      }
    };
    
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [canUndo, canRedo, undo, redo]);
  
  return (
    <div className="max-w-2xl mx-auto p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Perfil de Usuario</h2>
      
      <div className="flex justify-end gap-2 mb-4">
        <button
          onClick={() => {
            if (canUndo) undo();
            else toast.info('No hay acciones para deshacer');
          }}
          disabled={!canUndo}
          className={`px-4 py-2 rounded ${canUndo ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
          Deshacer (Ctrl+Z)
        </button>
        <button
          onClick={() => {
            if (canRedo) redo();
            else toast.info('No hay acciones para rehacer');
          }}
          disabled={!canRedo}
          className={`px-4 py-2 rounded ${canRedo ? 'bg-blue-500 hover:bg-blue-600 text-white' : 'bg-gray-300 text-gray-500 cursor-not-allowed'}`}
        >
          Rehacer (Ctrl+Y)
        </button>
      </div>
      
      <form className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Nombre</label>
          <input
            type="text"
            name="name"
            value={localForm.name}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700">Email</label>
          <input
            type="email"
            name="email"
            value={localForm.email}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          />
        </div>
        
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Dirección</h3>
          
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Calle</label>
              <input
                type="text"
                name="address.street"
                value={localForm.address.street}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Ciudad</label>
              <input
                type="text"
                name="address.city"
                value={localForm.address.city}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Código Postal</label>
              <input
                type="text"
                name="address.zip"
                value={localForm.address.zip}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">País</label>
              <input
                type="text"
                name="address.country"
                value={localForm.address.country}
                onChange={handleChange}
                className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </div>
        </div>
        
        <div className="border-t pt-4">
          <h3 className="text-lg font-medium text-gray-900 mb-3">Preferencias</h3>
          
          <div className="space-y-3">
            <div className="flex items-center">
              <input
                type="checkbox"
                id="newsletter"
                name="preferences.newsletter"
                checked={localForm.preferences.newsletter}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="newsletter" className="ml-2 block text-sm text-gray-700">
                Recibir newsletter
              </label>
            </div>
            
            <div className="flex items-center">
              <input
                type="checkbox"
                id="notifications"
                name="preferences.notifications"
                checked={localForm.preferences.notifications}
                onChange={handleChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="notifications" className="ml-2 block text-sm text-gray-700">
                Notificaciones por email
              </label>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700">Tema</label>
              <select
                name="preferences.theme"
                value={localForm.preferences.theme}
                onChange={handleChange}
                className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                <option value="light">Claro</option>
                <option value="dark">Oscuro</option>
                <option value="system">Sistema</option>
              </select>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
};

export default UserProfileForm;