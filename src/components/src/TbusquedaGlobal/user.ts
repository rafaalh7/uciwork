export type UserRole = 'admin' | 'user' | 'moderator' | 'guest';
export type UserStatus = 'active' | 'inactive' | 'suspended' | 'pending';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  department: string;
  joinDate: string;
  lastActive: string;
  status: UserStatus;
  phone?: string;
  location: string;
}

export interface SearchStore {
  users: User[];
  filteredUsers: User[];
  searchTerm: string;
  searchField: keyof User | 'all';
  isLoading: boolean;
  error: string | null;
  recentSearches: string[];
  searchHistory: Array<{
    term: string;
    field: keyof User | 'all';
    timestamp: string;
    results: number;
  }>;
  
  setUsers: (users: User[]) => void;
  setSearchTerm: (term: string) => void;
  setSearchField: (field: keyof User | 'all') => void;
  performSearch: () => void;
  clearSearch: () => void;
  validateSearchTerm: (term: string) => boolean;
  addToSearchHistory: (term: string, field: keyof User | 'all', results: number) => void;
  clearSearchHistory: () => void;
}