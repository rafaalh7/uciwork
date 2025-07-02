// searchStore.ts (alternativa con selectores)
import { create } from 'zustand';
import { shallow } from 'zustand/shallow';

interface SearchState<T> {
  searchTerm: string;
  data: T[];
  setSearchTerm: (term: string) => void;
  setData: (data: T[]) => void;
}

export const createSearchStore = <T>() => {
  return create<SearchState<T>>((set) => ({
    searchTerm: '',
    data: [],
    setSearchTerm: (term: string) => set({ searchTerm: term }),
    setData: (data: T[]) => set({ data }),
  }));
};

// Selector memoizado para los datos filtrados
export const useFilteredData = <T>(store: any, predicate: (item: T, term: string) => boolean) => {
  return store(
    (state: SearchState<T>) => {
      if (!state.searchTerm) return state.data;
      return state.data.filter(item => predicate(item, state.searchTerm));
    },
    shallow // Evita rerenders innecesarios
  );
};

// Ejemplo de uso en un componente
const filteredUsers = useFilteredData(
  useUserSearchStore,
  (user, term) => 
    user.name.toLowerCase().includes(term.toLowerCase()) ||
    user.email.toLowerCase().includes(term.toLowerCase())
);