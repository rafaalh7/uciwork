import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { User, SearchStore } from '../types/user';
import { initialUsers } from '../data/initialUsers';

export const useUserStore = create<SearchStore>()(
  persist(
    (set, get) => ({
      users: initialUsers,
      filteredUsers: initialUsers,
      searchTerm: '',
      searchField: 'all',
      isLoading: false,
      error: null,
      recentSearches: [],
      searchHistory: [],
      
      setUsers: (users) => set({ users, filteredUsers: users }),
      
      setSearchTerm: (term) => {
        // Validación básica en tiempo real
        const isValid = get().validateSearchTerm(term);
        
        set({ 
          searchTerm: term,
          error: isValid ? null : 'La búsqueda contiene caracteres especiales no permitidos'
        });
      },
      
      setSearchField: (field) => set({ searchField: field }),
      
      validateSearchTerm: (term: string): boolean => {
        if (term.trim() === '') return true; // Permite búsqueda vacía para limpiar
        
        // Permitir solo letras, números, espacios y algunos caracteres especiales comunes
        const specialCharRegex = /[<>{}[\]\\]/;
        if (specialCharRegex.test(term)) {
          return false;
        }
        
        // Limitar longitud
        if (term.length > 100) {
          return false;
        }
        
        return true;
      },
      
      performSearch: () => {
        const { users, searchTerm, searchField } = get();
        
        // Validar consulta vacía
        if (!searchTerm.trim()) {
          set({ 
            filteredUsers: users,
            error: null,
            isLoading: false 
          });
          return;
        }
        
        // Validar caracteres especiales
        const isValid = get().validateSearchTerm(searchTerm);
        if (!isValid) {
          set({ 
            error: 'La búsqueda contiene caracteres especiales no permitidos',
            isLoading: false 
          });
          return;
        }
        
        set({ isLoading: true, error: null });
        
        // Simular búsqueda asíncrona
        setTimeout(() => {
          const term = searchTerm.toLowerCase().trim();
          
          const filtered = users.filter(user => {
            if (searchField === 'all') {
              // Buscar en todos los campos relevantes
              return Object.entries(user).some(([key, value]) => {
                const userKey = key as keyof User;
                // Excluir campos no relevantes para búsqueda
                if (userKey === 'id' || userKey === 'phone') return false;
                
                const stringValue = String(value).toLowerCase();
                return stringValue.includes(term);
              });
            } else {
              // Buscar en campo específico
              const value = user[searchField];
              return String(value).toLowerCase().includes(term);
            }
          });
          
          const resultsCount = filtered.length;
          
          // Guardar en historial
          if (term && resultsCount > 0) {
            get().addToSearchHistory(term, searchField, resultsCount);
          }
          
          // Actualizar búsquedas recientes
          const recentSearches = get().recentSearches;
          const newRecentSearches = [term, ...recentSearches.filter(s => s !== term)].slice(0, 5);
          
          set({
            filteredUsers: filtered,
            isLoading: false,
            recentSearches: newRecentSearches,
            error: resultsCount === 0 ? 'No se encontraron resultados' : null
          });
        }, 300);
      },
      
      clearSearch: () => {
        set({
          searchTerm: '',
          filteredUsers: get().users,
          error: null
        });
      },
      
      addToSearchHistory: (term: string, field: keyof User | 'all', results: number) => {
        const history = get().searchHistory;
        const newEntry = {
          term,
          field,
          timestamp: new Date().toISOString(),
          results
        };
        
        // Limitar historial a 10 entradas
        const newHistory = [newEntry, ...history.slice(0, 9)];
        
        set({ searchHistory: newHistory });
      },
      
      clearSearchHistory: () => {
        set({ searchHistory: [], recentSearches: [] });
      }
    }),
    {
      name: 'user-search-store',
      version: 1,
      partialize: (state) => ({
        users: state.users,
        searchTerm: state.searchTerm,
        searchField: state.searchField,
        recentSearches: state.recentSearches,
        searchHistory: state.searchHistory.slice(0, 5) // Solo persistir las 5 más recientes
      }),
    }
  )
);