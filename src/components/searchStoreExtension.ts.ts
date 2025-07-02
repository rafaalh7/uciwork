// searchStore.ts (extensión)
import { debounce } from 'lodash';

// ... en el store
setSearchTerm: debounce((term: string) => {
  set({ searchTerm: term });
  get().filterData((item, term) => 
    Object.values(item).some(
      value => value?.toString().toLowerCase().includes(term.toLowerCase())
    )
  );
}, 300), // Debounce de 300ms