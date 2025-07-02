// searchStore.test.ts
import { act } from 'react-test-renderer';
import { useUserSearchStore } from './searchStore';

describe('Search Store', () => {
  beforeEach(() => {
    useUserSearchStore.setState({
      searchTerm: '',
      data: [],
      filteredData: [],
    });
  });
  
  test('should filter data correctly', () => {
    const testUsers = [
      { id: 1, name: 'Juan Pérez', email: 'juan@example.com' },
      { id: 2, name: 'María García', email: 'maria@example.com' },
    ];
    
    act(() => {
      useUserSearchStore.getState().setData(testUsers);
      useUserSearchStore.getState().setSearchTerm('juan');
    });
    
    const { filteredData } = useUserSearchStore.getState();
    expect(filteredData).toHaveLength(1);
    expect(filteredData[0].name).toBe('Juan Pérez');
  });
  
  test('should return all data when search term is empty', () => {
    const testUsers = [
      { id: 1, name: 'Juan Pérez', email: 'juan@example.com' },
      { id: 2, name: 'María García', email: 'maria@example.com' },
    ];
    
    act(() => {
      useUserSearchStore.getState().setData(testUsers);
      useUserSearchStore.getState().setSearchTerm('');
    });
    
    const { filteredData } = useUserSearchStore.getState();
    expect(filteredData).toHaveLength(2);
  });
  
  test('should search in all fields', () => {
    const testUsers = [
      { id: 1, name: 'Juan Pérez', email: 'juan@example.com' },
      { id: 2, name: 'María García', email: 'maria@example.com' },
    ];
    
    act(() => {
      useUserSearchStore.getState().setData(testUsers);
      useUserSearchStore.getState().setSearchTerm('example.com');
    });
    
    const { filteredData } = useUserSearchStore.getState();
    expect(filteredData).toHaveLength(2);
  });
});