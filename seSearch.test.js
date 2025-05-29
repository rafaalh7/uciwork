import { renderHook, act } from '@testing-library/react-hooks';
import useSearch from './useSearch';

describe('useSearch hook', () => {
  const testData = [
    { id: 1, name: 'John Doe', email: 'john@example.com', address: { city: 'New York' } },
    { id: 2, name: 'Jane Smith', email: 'jane@example.com', address: { city: 'Los Angeles' } },
    { id: 3, name: 'Alice Johnson', email: 'alice@example.com', address: { city: 'Miami' } },
  ];

  it('should return all data when search term is empty', () => {
    const { result } = renderHook(() => 
      useSearch({ data: testData, searchKeys: ['name', 'email'] })
    );
    
    expect(result.current.filteredResults).toEqual(testData);
    expect(result.current.isEmpty).toBe(false);
  });

  it('should filter data by direct field', () => {
    const { result } = renderHook(() => 
      useSearch({ data: testData, searchKeys: ['name'] })
    );
    
    act(() => result.current.setSearchTerm('john'));
    expect(result.current.filteredResults.length).toBe(2);
    expect(result.current.filteredResults.map(item => item.id)).toEqual([1, 3]);
  });

  it('should filter by nested field', () => {
    const { result } = renderHook(() => 
      useSearch({ data: testData, searchKeys: ['address.city'] })
    );
    
    act(() => result.current.setSearchTerm('new'));
    expect(result.current.filteredResults.length).toBe(1);
    expect(result.current.filteredResults[0].id).toBe(1);
  });

  it('should perform case-insensitive fuzzy search', () => {
    const { result } = renderHook(() => 
      useSearch({ data: testData, searchKeys: ['name'] })
    );
    
    act(() => result.current.setSearchTerm('AlIcE'));
    expect(result.current.filteredResults.length).toBe(1);
    expect(result.current.filteredResults[0].id).toBe(3);
  });

  it('should apply debounce correctly', () => {
    jest.useFakeTimers();
    const { result } = renderHook(() => 
      useSearch({ data: testData, searchKeys: ['name'], debounceTime: 300 })
    );
    
    act(() => result.current.setSearchTerm('smith'));
    expect(result.current.isSearching).toBe(true);
    
    act(() => jest.advanceTimersByTime(300));
    expect(result.current.isSearching).toBe(false);
    expect(result.current.filteredResults.length).toBe(1);
  });

  it('should handle empty results', () => {
    const { result } = renderHook(() => 
      useSearch({ data: testData, searchKeys: ['name'] })
    );
    
    act(() => result.current.setSearchTerm('xyz'));
    act(() => jest.advanceTimersByTime(300));
    
    expect(result.current.filteredResults.length).toBe(0);
    expect(result.current.isEmpty).toBe(true);
  });

  it('should update when data changes', () => {
    const { result, rerender } = renderHook(
      ({ data }) => useSearch({ data, searchKeys: ['name'] }),
      { initialProps: { data: testData } }
    );
    
    const newData = [...testData, { id: 4, name: 'Bob Brown' }];
    rerender({ data: newData });
    
    expect(result.current.filteredResults.length).toBe(4);
  });
});
