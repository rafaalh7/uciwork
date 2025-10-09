// hooks/useTableSort.ts
import { useMemo } from 'react';
import { User, ColumnConfig } from '../types/user';
import { SortConfig, useTableStore } from '../stores/tableStore';

export const useTableSort = (data: User[], columns: ColumnConfig[]) => {
  const { sortConfigs } = useTableStore();

  const sortedData = useMemo(() => {
    if (sortConfigs.length === 0) return data;

    return [...data].sort((a, b) => {
      for (const config of sortConfigs) {
        const column = columns.find(col => col.key === config.key);
        if (!column) continue;

        const aValue = a[config.key];
        const bValue = b[config.key];

        // Validación de tipos
        if (typeof aValue !== typeof bValue) {
          console.warn(`Tipos inconsistentes para la columna ${config.key}`);
          return 0;
        }

        let comparison = 0;

        switch (column.type) {
          case 'number':
            comparison = (aValue as number) - (bValue as number);
            break;
          case 'date':
            comparison = new Date(aValue as string).getTime() - new Date(bValue as string).getTime();
            break;
          case 'string':
          default:
            comparison = (aValue as string).localeCompare(bValue as string);
            break;
        }

        if (comparison !== 0) {
          return config.direction === 'asc' ? comparison : -comparison;
        }
      }
      return 0;
    });
  }, [data, sortConfigs, columns]);

  return sortedData;
};