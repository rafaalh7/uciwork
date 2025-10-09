// components/SortIndicator.tsx
import React from 'react';
import { useTableStore } from '../stores/tableStore';

export const SortIndicator: React.FC = () => {
  const { sortConfigs, clearSortConfigs } = useTableStore();

  if (sortConfigs.length === 0) return null;

  return (
    <div className="mb-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
      <div className="flex items-center justify-between">
        <div>
          <span className="text-sm font-medium text-blue-800">Orden actual:</span>
          <div className="flex flex-wrap gap-2 mt-1">
            {sortConfigs.map((config, index) => (
              <span
                key={config.key}
                className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium bg-blue-100 text-blue-800"
              >
                {config.key} {config.direction === 'asc' ? '↑' : '↓'} 
                <span className="ml-1 text-blue-600">({index + 1})</span>
              </span>
            ))}
          </div>
        </div>
        <button
          onClick={clearSortConfigs}
          className="text-sm text-blue-600 hover:text-blue-800 underline"
        >
          Limpiar
        </button>
      </div>
    </div>
  );
};