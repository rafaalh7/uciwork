import React from 'react';
import SearchBar from './components/SearchBar';
import UserTable from './components/UserTable';
import { Users, Search, Shield } from 'lucide-react';

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <header className="mb-10">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-3">
                <div className="p-3 bg-blue-100 rounded-xl">
                  <Users className="text-blue-600" size={28} />
                </div>
                <div>
                  <h1 className="text-3xl font-bold text-gray-900">Gestión de Usuarios</h1>
                  <p className="text-gray-600 mt-1">Busca y filtra usuarios de la organización</p>
                </div>
              </div>
              <div className="flex items-center gap-4 mt-4">
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Search size={14} />
                  <span>Búsqueda global en tiempo real</span>
                </div>
                <div className="flex items-center gap-2 text-sm text-gray-500">
                  <Shield size={14} />
                  <span>Validación y persistencia</span>
                </div>
              </div>
            </div>
          </div>
          
          {/* Barra de búsqueda */}
          <SearchBar />
        </header>
        
        {/* Contenido principal */}
        <main>
          <UserTable />
          
          {/* Información adicional */}
          <div className="mt-8 grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="p-5 bg-white rounded-xl border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">Búsqueda inteligente</h4>
              <p className="text-sm text-gray-600">
                Busca en todos los campos o selecciona uno específico. Los resultados se actualizan en tiempo real.
              </p>
            </div>
            <div className="p-5 bg-white rounded-xl border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">Persistencia</h4>
              <p className="text-sm text-gray-600">
                Tu última búsqueda y filtros se guardan automáticamente y se restauran al recargar la página.
              </p>
            </div>
            <div className="p-5 bg-white rounded-xl border border-gray-200">
              <h4 className="font-medium text-gray-900 mb-2">Validación</h4>
              <p className="text-sm text-gray-600">
                Se previenen consultas vacías y se limitan caracteres especiales para mayor seguridad.
              </p>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
}

export default App;