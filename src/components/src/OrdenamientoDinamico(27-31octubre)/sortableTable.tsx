// components/SortableTable.tsx
import React from 'react';
import { User, ColumnConfig } from '../types/user';
import { useTableSort } from '../hooks/useTableSort';
import { useTableStore } from '../stores/tableStore';

interface SortableTableProps {
  data: User[];
  columns: ColumnConfig[];
}

export const SortableTable: React.FC<SortableTableProps> = ({ data, columns }) => {
  const { sortedData, handleSort, getSortDirection, sortConfig } = useTableSort(data, columns);
  const { clearSortConfig } = useTableStore();

  const getSortIcon = (key: string) => {
    const direction = getSortDirection(key);
    if (!direction) return '↕️';
    return direction === 'asc' ? '↑' : '↓';
  };

  const getSortIndex = (key: string) => {
    const index = sortConfig.findIndex(config => config.key === key);
    return index >= 0 ? index + 1 : null;
  };

  const formatValue = (value: any, type: ColumnConfig['type']) => {
    if (value == null) return '-';
    
    switch (type) {
      case 'date':
        return value instanceof Date 
          ? value.toLocaleDateString() 
          : new Date(value).toLocaleDateString();
      default:
        return String(value);
    }
  };

  return (
    <div className="sortable-table">
      <div className="table-controls">
        <button 
          onClick={clearSortConfig}
          disabled={sortConfig.length === 0}
          className="clear-sort-btn"
        >
          Limpiar ordenamiento
        </button>
        {sortConfig.length > 0 && (
          <div className="active-sorts">
            Ordenado por: {sortConfig.map((config, index) => (
              <span key={config.key} className="sort-tag">
                {columns.find(col => col.key === config.key)?.label} {config.direction === 'asc' ? '↑' : '↓'}
                {index < sortConfig.length - 1 && ', '}
              </span>
            ))}
          </div>
        )}
      </div>

      <table className="table">
        <thead>
          <tr>
            {columns.map((column) => (
              <th
                key={column.key}
                onClick={() => column.sortable && handleSort(column.key)}
                className={`
                  ${column.sortable ? 'sortable' : ''}
                  ${getSortDirection(column.key) ? 'sorted' : ''}
                `}
              >
                <div className="header-content">
                  <span>{column.label}</span>
                  {column.sortable && (
                    <div className="sort-indicator">
                      <span className="sort-icon">{getSortIcon(column.key)}</span>
                      {getSortIndex(column.key) && (
                        <span className="sort-index">{getSortIndex(column.key)}</span>
                      )}
                    </div>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((user) => (
            <tr key={user.id}>
              {columns.map((column) => (
                <td key={column.key}>
                  {formatValue(user[column.key], column.type)}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>

      <style jsx>{`
        .sortable-table {
          width: 100%;
        }
        
        .table-controls {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
          padding: 0.5rem;
        }
        
        .clear-sort-btn {
          padding: 0.5rem 1rem;
          background: #f0f0f0;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
        }
        
        .clear-sort-btn:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .active-sorts {
          font-size: 0.9rem;
          color: #666;
        }
        
        .sort-tag {
          background: #e3f2fd;
          padding: 0.2rem 0.5rem;
          border-radius: 3px;
          margin-left: 0.5rem;
        }
        
        .table {
          width: 100%;
          border-collapse: collapse;
          background: white;
        }
        
        th {
          background: #f8f9fa;
          padding: 0.75rem;
          text-align: left;
          border-bottom: 2px solid #dee2e6;
          cursor: default;
          user-select: none;
        }
        
        th.sortable {
          cursor: pointer;
          transition: background-color 0.2s;
        }
        
        th.sortable:hover {
          background: #e9ecef;
        }
        
        th.sorted {
          background: #e3f2fd;
          color: #1976d2;
        }
        
        .header-content {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .sort-indicator {
          display: flex;
          align-items: center;
          gap: 0.25rem;
        }
        
        .sort-icon {
          font-weight: bold;
        }
        
        .sort-index {
          background: #1976d2;
          color: white;
          border-radius: 50%;
          width: 16px;
          height: 16px;
          font-size: 0.7rem;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        
        td {
          padding: 0.75rem;
          border-bottom: 1px solid #dee2e6;
        }
        
        tr:hover {
          background: #f5f5f5;
        }
      `}</style>
    </div>
  );
};