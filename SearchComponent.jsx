import React, { useState, useRef, useEffect } from 'react';
import useSearch from './useSearch'; // Asume que useSearch.js está en la misma carpeta

const SearchComponent = ({ 
  data = [], 
  searchKeys = [], 
  placeholder = 'Buscar...', 
  onSelectItem,
  debounceTime = 300
}) => {
  const [isResultsVisible, setIsResultsVisible] = useState(false);
  const inputRef = useRef(null);
  const resultsRef = useRef(null);
  
  const {
    searchTerm,
    setSearchTerm,
    filteredResults,
    isSearching,
    isEmpty
  } = useSearch({ data, searchKeys, debounceTime });

  // Manejar selección de elemento
  const handleSelectItem = (item) => {
    setSearchTerm('');
    setIsResultsVisible(false);
    if (onSelectItem) onSelectItem(item);
  };

  // Navegación por teclado
  const handleKeyDown = (e) => {
    if (!isResultsVisible || filteredResults.length === 0) return;

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      const firstItem = resultsRef.current.querySelector('.result-item');
      if (firstItem) firstItem.focus();
    }
  };

  // Cerrar resultados al hacer clic fuera
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (inputRef.current && !inputRef.current.contains(e.target) {
        setIsResultsVisible(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Renderizar resultados
  const renderResults = () => {
    if (!isResultsVisible) return null;

    if (isSearching) {
      return (
        <div className="results-dropdown">
          <div className="status-message">
            <div className="loader"></div>
            <span>Buscando...</span>
          </div>
        </div>
      );
    }

    if (isEmpty) {
      return (
        <div className="results-dropdown">
          <div className="status-message">
            <span>No se encontraron resultados</span>
          </div>
        </div>
      );
    }

    return (
      <div className="results-dropdown" ref={resultsRef}>
        {filteredResults.map((item, index) => (
          <button
            key={`${item.id}-${index}`}
            className="result-item"
            onClick={() => handleSelectItem(item)}
            onKeyDown={(e) => {
              if (e.key === 'ArrowDown') {
                e.preventDefault();
                const nextItem = e.target.nextElementSibling;
                if (nextItem) nextItem.focus();
              }
              if (e.key === 'ArrowUp') {
                e.preventDefault();
                const prevItem = e.target.previousElementSibling;
                if (prevItem) prevItem.focus();
                else inputRef.current.focus();
              }
              if (e.key === 'Enter') handleSelectItem(item);
            }}
          >
            {searchKeys.map(key => (
              <div key={key} className="result-field">
                {getNestedValue(item, key)}
              </div>
            ))}
          </button>
        ))}
      </div>
    );
  };

  // Función auxiliar para obtener valores anidados
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((acc, key) => 
      (acc && acc[key] !== undefined ? acc[key] : ''), obj
    );
  };

  return (
    <div className="search-container">
      <div className="search-input-wrapper">
        <svg 
          className="search-icon" 
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M15.5 14h-.79l-.28-.27A6.471 6.471 0 0 0 16 9.5 6.5 6.5 0 1 0 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/>
        </svg>
        
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          onFocus={() => setIsResultsVisible(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          aria-label="Buscar"
          aria-haspopup="listbox"
          aria-expanded={isResultsVisible}
        />
        
        {searchTerm && (
          <button 
            className="clear-button"
            onClick={() => setSearchTerm('')}
            aria-label="Limpiar búsqueda"
          >
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
            </svg>
          </button>
        )}
      </div>
      
      {renderResults()}
    </div>
  );
};

export default SearchComponent;
