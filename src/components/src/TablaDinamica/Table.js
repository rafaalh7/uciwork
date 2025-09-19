import React, { useState } from 'react'
import { useTableStore } from '../stores/useTableStore'
import { sortData } from '../utils/sortData'
import { validateSortable } from '../utils/validation'
import TableHeader from './TableHeader'
import TableRow from './TableRow'

const Table = ({ data, columns }) => {
  const { sortConfig, setSortConfig } = useTableStore()
  const [error, setError] = useState(null)

  const handleSort = (key, isMultiSort) => {
    try {
      // Validar si la columna es ordenable
      if (!validateSortable(data, key)) {
        throw new Error(`La columna "${key}" contiene datos no comparables`)
      }

      let newCriteria = []
      
      if (isMultiSort && sortConfig && sortConfig.criteria) {
        // Modo multi-orden: añadir o actualizar criterio
        newCriteria = [...sortConfig.criteria]
        const existingIndex = newCriteria.findIndex(c => c.key === key)
        
        if (existingIndex >= 0) {
          // Cambiar dirección si ya existe
          newCriteria[existingIndex].direction = 
            newCriteria[existingIndex].direction === 'ascending' ? 'descending' : 'ascending'
        } else {
          // Añadir nuevo criterio
          newCriteria.push({ key, direction: 'ascending' })
        }
      } else {
        // Modo orden simple: reemplazar criterios
        const existingCriterion = sortConfig && sortConfig.criteria 
          ? sortConfig.criteria.find(c => c.key === key)
          : null
        
        if (existingCriterion) {
          // Cambiar dirección si es la misma columna
          newCriteria = [{
            key,
            direction: existingCriterion.direction === 'ascending' ? 'descending' : 'ascending'
          }]
        } else {
          // Nueva columna para ordenar
          newCriteria = [{ key, direction: 'ascending' }]
        }
      }

      setSortConfig({ criteria: newCriteria })
      setError(null)
    } catch (err) {
      setError(err.message)
      setTimeout(() => setError(null), 3000) // Auto-ocultar error después de 3 segundos
    }
  }

  const sortedData = sortData(data, sortConfig)

  return (
    <div>
      {error && (
        <div style={{
          color: '#d32f2f',
          backgroundColor: '#ffebee',
          padding: '10px',
          borderRadius: '4px',
          marginBottom: '10px'
        }}>
          Error: {error}
        </div>
      )}
      
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr>
            {columns.map(column => (
              <TableHeader
                key={column.key}
                column={column}
                onSort={handleSort}
                sortConfig={sortConfig}
              />
            ))}
          </tr>
        </thead>
        <tbody>
          {sortedData.map((row, index) => (
            <TableRow
              key={index}
              rowData={row}
              columns={columns}
            />
          ))}
        </tbody>
      </table>
    </div>
  )
}

export default Table