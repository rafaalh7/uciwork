// hooks/useTableSort.ts
import { useMemo } from 'react';
import { User, SortableUserField, ColumnConfig } from '../types/user';
import { useTableStore } from '../stores/tableStore';

export const useTableSort = (data: User[], columns: ColumnConfig[]) => {
  const { sortConfig, addSortConfig } = useTableStore();

  const sortedData = useMemo(() => {
    if (sortConfig.length === 0) return data;

    return [...data].sort((a, b) => {
      for (const config of sortConfig) {
        const column = columns.find(col => col.key === config.key);
        if (!column) continue;

        let aValue = a[config.key];
        let bValue = b[config.key];

        // Validación de tipos
        if (column.type === 'number') {
          aValue = Number(aValue);
          bValue = Number(bValue);
          if (isNaN(aValue as number) || isNaN(bValue as number)) {
            console.warn(`Invalid number values for sorting: ${aValue}, ${bValue}`);
            continue;
          }
        } else if (column.type === 'date') {
          aValue = aValue instanceof Date ? aValue.getTime() : new Date(aValue as string).getTime();
          bValue = bValue instanceof Date ? bValue.getTime() : new Date(bValue as string).getTime();
          if (isNaN(aValue as number) || isNaN(bValue as number)) {
            console.warn(`Invalid date values for sorting: ${aValue}, ${bValue}`);
            continue;
          }
        }

        // Comparación
        if (aValue < bValue) {
          return config.direction === 'asc' ? -1 : 1;
        }
        if (aValue > bValue) {
          return config.direction === 'asc' ? 1 : -1;
        }
      }
      return 0;
    });
  }, [data, sortConfig, columns]);

  const getSortDirection = (key: string) => {
    const config = sortConfig.find(config => config.key === key);
    return config?.direction || null;
  };

  const handleSort = (key: string) => {
    addSortConfig(key);
  };

  return {
    sortedData,
    sortConfig,
    handleSort,
    getSortDirection,
  };
};