import { useState, useEffect, useCallback } from 'react';

const getNestedValue = (obj, path) => {
  return path.split('.').reduce((acc, key) => (acc && acc[key] !== undefined ? acc[key] : null), obj);
};

const fuzzyMatch = (text, searchTerm) => {
  if (!text || !searchTerm) return false;
  return text.toString().toLowerCase().includes(searchTerm.toLowerCase());
};

const useSearch = ({ data = [], searchKeys = [], debounceTime = 300 }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredResults, setFilteredResults] = useState(data);
  const [isSearching, setIsSearching] = useState(false);
  const [isEmpty, setIsEmpty] = useState(false);

  const filterData = useCallback(() => {
    if (!searchTerm.trim()) {
      setFilteredResults(data);
      setIsEmpty(data.length === 0);
      return;
    }

    setIsSearching(true);
    
    try {
      const results = data.filter(item => 
        searchKeys.some(key => {
          const value = getNestedValue(item, key);
          return fuzzyMatch(value, searchTerm);
        })
      );

      setFilteredResults(results);
      setIsEmpty(results.length === 0);
    } catch (error) {
      console.error('Error during search:', error);
      setFilteredResults([]);
      setIsEmpty(true);
    } finally {
      setIsSearching(false);
    }
  }, [data, searchKeys, searchTerm]);

  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredResults(data);
      setIsEmpty(data.length === 0);
      return;
    }

    setIsSearching(true);
    const handler = setTimeout(filterData, debounceTime);

    return () => {
      clearTimeout(handler);
      setIsSearching(false);
    };
  }, [searchTerm, data, debounceTime, filterData]);

  return {
    searchTerm,
    setSearchTerm,
    filteredResults,
    isSearching,
    isEmpty,
  };
};

export default useSearch;
