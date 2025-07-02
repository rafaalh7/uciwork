// searchStore.ts
import { create } from 'zustand';

interface SearchState<T> {
  searchTerm: string;
  data: T[];
  filteredData: T[];
  setSearchTerm: (term: string) => void;
  setData: (data: T[]) => void;
  filterData: (predicate: (item: T, term: string) => boolean) => void;
}

export const createSearchStore = <T>() => {
  return create<SearchState<T>>((set, get) => ({
    searchTerm: '',
    data: [],
    filteredData: [],
    
    setSearchTerm: (term: string) => {
      set({ searchTerm: term });
      // Filtramos los datos cuando cambia el término de búsqueda
      get().filterData((item, term) => 
        Object.values(item).some(
          value => value?.toString().toLowerCase().includes(term.toLowerCase())
        )
      );
    },
    
    setData: (data: T[]) => {
      set({ data, filteredData: data });
    },
    
    filterData: (predicate) => {
      const { searchTerm, data } = get();
      if (!searchTerm) {
        set({ filteredData: data });
        return;
      }
      
      const filtered = data.filter(item => predicate(item, searchTerm));
      set({ filteredData: filtered });
    }
  }));
};

// Ejemplo de uso con un tipo específico
interface User {
  id: number;
  name: string;
  email: string;
}

export const useUserSearchStore = createSearchStore<User>();