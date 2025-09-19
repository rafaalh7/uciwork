import React from 'react'

const TableHeader = ({ column, onSort, sortConfig }) => {
  const getSortDirection = () => {
    if (!sortConfig || !sortConfig.criteria) return null
    
    const criterion = sortConfig.criteria.find(c => c.key === column.key)
    return criterion ? criterion.direction : null
  }

  const getPriority = () => {
    if (!sortConfig || !sortConfig.criteria) return null
    
    const index = sortConfig.criteria.findIndex(c => c.key === column.key)
    return index >= 0 ? index + 1 : null
  }

  const handleClick = (e) => {
    if (column.sortable === false) return
    
    if (e.shiftKey) {
      onSort(column.key, true) // Multi-sort
    } else {
      onSort(column.key, false) // Single-sort
    }
  }

  const direction = getSortDirection()
  const priority = getPriority()
  
  return (
    <th 
      onClick={handleClick}
      style={{ 
        cursor: column.sortable === false ? 'default' : 'pointer',
        userSelect: 'none'
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <span>{column.title}</span>
        {direction && (
          <span style={{ marginLeft: '5px' }}>
            {direction === 'ascending' ? '↑' : '↓'}
            {priority && priority > 1 && (
              <sup style={{ fontSize: '0.7em', marginLeft: '2px' }}>{priority}</sup>
            )}
          </span>
        )}
      </div>
    </th>
  )
}

export default TableHeader