// components/SortableTable.tsx
import React from 'react';
import { User, ColumnConfig } from '../types/user';
import { useTableStore } from '../stores/tableStore';
import { useTableSort } from '../hooks/useTableSort';

interface SortableTableProps {
  data: User[];
  columns: ColumnConfig[];
}

export const SortableTable: React.FC<SortableTableProps> = ({ data, columns }) => {
  const { sortConfigs, addSortConfig } = useTableStore();
  const sortedData = useTableSort(data, columns);

  const getSortIcon = (key: string) => {
    const config = sortConfigs.find(config => config.key === key);
    if (!config) return '↕️';
    return config.direction === 'asc' ? '↑' : '↓';
  };

  const getSortIndex = (key: string) => {
    const index = sortConfigs.findIndex(config => config.key === key);
    return index >= 0 ? index + 1 : null;
  };

  const handleSort = (column: ColumnConfig) => {
    if (!column.sortable) return;
    addSortConfig(column.key);
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white border border-gray-200">
        <thead>
          <tr className="bg-gray-50">
            {columns.map((column) => (
              <th
                key={column.key as string}
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider border-b ${
                  column.sortable 
                    ? 'cursor-pointer hover:bg-gray-100 select-none' 
                    : ''
                }`}
                onClick={() => handleSort(column)}
              >
                <div className="flex items-center space-x-1">
                  <span>{column.label}</span>
                  {column.sortable && (
                    <div className="flex items-center space-x-1">
                      <span className="text-sm">{getSortIcon(column.key)}</span>
                      {getSortIndex(column.key) && (
                        <span className="text-xs bg-blue-500 text-white rounded-full w-4 h-4 flex items-center justify-center">
                          {getSortIndex(column.key)}
                        </span>
                      )}
                    </div>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {sortedData.map((user) => (
            <tr key={user.id} className="hover:bg-gray-50">
              {columns.map((column) => (
                <td key={column.key as string} className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                  {renderCell(user[column.key], column.type)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const renderCell = (value: any, type: ColumnConfig['type']) => {
  switch (type) {
    case 'date':
      return new Date(value).toLocaleDateString();
    default:
      return value;
  }
};