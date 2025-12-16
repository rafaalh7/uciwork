import React, { useState, useEffect, useCallback } from 'react';
import { useUserStore } from '../store/userStore';
import { Search, X, Filter, History, Clock, AlertCircle } from 'lucide-react';

const SearchBar: React.FC = () => {
  const { 
    searchTerm, 
    searchField, 
    setSearchTerm, 
    setSearchField, 
    performSearch, 
    clearSearch, 
    validateSearchTerm,
    isLoading,
    recentSearches,
    searchHistory 
  } = useUserStore();
  
  const [showFilters, setShowFilters] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [localTerm, setLocalTerm] = useState(searchTerm);
  
  // Debounced search para búsqueda en tiempo real
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localTerm !== searchTerm) {
        setSearchTerm(localTerm);
        if (validateSearchTerm(localTerm)) {
          performSearch();
        }
      }
    }, 500);
    
    return () => clearTimeout(timer);
  }, [localTerm, searchTerm, setSearchTerm, performSearch, validateSearchTerm]);
  
  // Restaurar búsqueda desde store al cargar
  useEffect(() => {
    if (searchTerm) {
      performSearch();
    }
  }, []);
  
  const handleSearch = useCallback(() => {
    if (!localTerm.trim()) {
      clearSearch();
      return;
    }
    
    if (validateSearchTerm(localTerm)) {
      performSearch();
    }
  }, [localTerm, validateSearchTerm, performSearch, clearSearch]);
  
  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSearch();
    }
  };
  
  const handleClear = () => {
    setLocalTerm('');
    clearSearch();
    setShowHistory(false);
  };
  
  const handleSelectRecent = (term: string) => {
    setLocalTerm(term);
    setSearchTerm(term);
    performSearch();
    setShowHistory(false);
  };
  
  const searchFields = [
    { value: 'all', label: 'Todos los campos' },
    { value: 'name', label: 'Nombre' },
    { value: 'email', label: 'Email' },
    { value: 'department', label: 'Departamento' },
    { value: 'role', label: 'Rol' },
    { value: 'status', label: 'Estado' },
    { value: 'location', label: 'Ubicación' },
  ];
  
  return (
    <div className="relative mb-8">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1 relative">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              value={localTerm}
              onChange={(e) => setLocalTerm(e.target.value)}
              onKeyPress={handleKeyPress}
              onFocus={() => setShowHistory(true)}
              placeholder="Buscar usuarios por nombre, email, departamento..."
              className="w-full pl-12 pr-12 py-3 border border-gray-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              maxLength={100}
            />
            {localTerm && (
              <button
                onClick={handleClear}
                className="absolute right-4 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
              >
                <X size={20} />
              </button>
            )}
          </div>
          
          {/* Sugerencias de búsqueda reciente */}
          {showHistory && (recentSearches.length > 0 || searchHistory.length > 0) && (
            <div className="absolute top-full left-0 right-0 mt-2 bg-white border border-gray-200 rounded-xl shadow-lg z-50 animate-slide-down">
              <div className="p-4">
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2 text-sm font-medium text-gray-700">
                    <History size={16} />
                    Búsquedas recientes
                  </div>
                  <button
                    onClick={() => setShowHistory(false)}
                    className="text-gray-400 hover:text-gray-600"
                  >
                    <X size={16} />
                  </button>
                </div>
                
                {recentSearches.length > 0 && (
                  <div className="mb-4">
                    <h4 className="text-xs font-semibold text-gray-500 mb-2">RECIENTES</h4>
                    <div className="space-y-1">
                      {recentSearches.map((term, index) => (
                        <button
                          key={index}
                          onClick={() => handleSelectRecent(term)}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 flex items-center gap-2 group"
                        >
                          <Clock size={14} className="text-gray-400 group-hover:text-blue-500" />
                          <span className="text-gray-700 group-hover:text-blue-600">{term}</span>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
                
                {searchHistory.length > 0 && (
                  <div>
                    <h4 className="text-xs font-semibold text-gray-500 mb-2">HISTORIAL</h4>
                    <div className="space-y-2">
                      {searchHistory.slice(0, 3).map((item, index) => (
                        <button
                          key={index}
                          onClick={() => handleSelectRecent(item.term)}
                          className="w-full text-left px-3 py-2 rounded-lg hover:bg-gray-50 flex justify-between items-center group"
                        >
                          <div>
                            <div className="font-medium text-gray-900 group-hover:text-blue-600">
                              {item.term}
                            </div>
                            <div className="text-xs text-gray-500">
                              En {item.field === 'all' ? 'todos los campos' : item.field} • {item.results} resultados
                            </div>
                          </div>
                          <div className="text-xs text-gray-400">
                            {new Date(item.timestamp).toLocaleDateString()}
                          </div>
                        </button>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={() => setShowFilters(!showFilters)}
            className={`px-5 py-3 border rounded-xl flex items-center gap-2 transition-colors ${
              showFilters 
                ? 'border-blue-500 bg-blue-50 text-blue-700' 
                : 'border-gray-300 hover:border-gray-400 text-gray-700'
            }`}
          >
            <Filter size={18} />
            Filtro
          </button>
          
          <button
            onClick={handleSearch}
            disabled={isLoading}
            className="px-6 py-3 bg-blue-600 text-white font-medium rounded-xl hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Buscando...
              </>
            ) : (
              <>
                <Search size={18} />
                Buscar
              </>
            )}
          </button>
        </div>
      </div>
      
      {/* Panel de filtros */}
      {showFilters && (
        <div className="mt-4 p-5 bg-gray-50 border border-gray-200 rounded-xl animate-fade-in">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium text-gray-900 flex items-center gap-2">
              <Filter size={18} />
              Filtrar por campo específico
            </h3>
            <span className="text-sm text-gray-500">
              {searchField === 'all' ? 'Buscando en todos los campos' : `Buscando en: ${searchField}`}
            </span>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
            {searchFields.map((field) => (
              <button
                key={field.value}
                onClick={() => setSearchField(field.value as keyof typeof initialUsers[0] | 'all')}
                className={`px-4 py-3 rounded-lg text-sm font-medium transition-colors ${
                  searchField === field.value
                    ? 'bg-blue-100 text-blue-700 border border-blue-300'
                    : 'bg-white text-gray-700 border border-gray-200 hover:border-gray-300'
                }`}
              >
                {field.label}
              </button>
            ))}
          </div>
        </div>
      )}
      
      {/* Información de validación */}
      {!validateSearchTerm(localTerm) && localTerm && (
        <div className="mt-3 p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-3 animate-fade-in">
          <AlertCircle className="text-red-500 flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p className="text-red-800 font-medium">Caracteres no permitidos</p>
            <p className="text-red-600 text-sm mt-1">
              Evita usar caracteres especiales como: {'<>{}[]\\'}
            </p>
          </div>
        </div>
      )}
    </div>
  );
};

export default SearchBar;