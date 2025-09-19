export const sortData = (data, sortConfig) => {
  if (!sortConfig || !sortConfig.criteria || sortConfig.criteria.length === 0) {
    return data
  }

  return [...data].sort((a, b) => {
    for (const criterion of sortConfig.criteria) {
      const { key, direction } = criterion
      let valueA = a[key]
      let valueB = b[key]

      // Manejar valores undefined o null
      if (valueA == null) valueA = ''
      if (valueB == null) valueB = ''

      // Comparar según el tipo de dato
      if (typeof valueA === 'string' && typeof valueB === 'string') {
        // Para strings, comparación case-insensitive
        const compareResult = valueA.localeCompare(valueB, undefined, { sensitivity: 'base' })
        if (compareResult !== 0) {
          return direction === 'ascending' ? compareResult : -compareResult
        }
      } else if (valueA instanceof Date && valueB instanceof Date) {
        // Para fechas
        const timeA = valueA.getTime()
        const timeB = valueB.getTime()
        if (timeA !== timeB) {
          return direction === 'ascending' ? timeA - timeB : timeB - timeA
        }
      } else {
        // Para números y otros tipos
        if (valueA < valueB) {
          return direction === 'ascending' ? -1 : 1
        }
        if (valueA > valueB) {
          return direction === 'ascending' ? 1 : -1
        }
      }
    }
    return 0
  })
}