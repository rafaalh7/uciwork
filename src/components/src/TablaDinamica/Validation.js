export const isValidDate = (dateString) => {
  if (!dateString) return false
  
  // Intentar parsear la fecha
  const timestamp = Date.parse(dateString)
  if (isNaN(timestamp)) return false
  
  // Verificar que el formato coincida (para evitar que "2021-02-30" sea válido)
  const date = new Date(dateString)
  const formatted = date.toISOString().split('T')[0]
  return formatted === dateString
}

export const validateSortable = (data, key) => {
  if (!data || data.length === 0) return true
  
  const sampleValue = data[0][key]
  
  // Si el valor es undefined o null, no es ordenable
  if (sampleValue === undefined || sampleValue === null) {
    return false
  }
  
  // Verificar si todos los valores son del mismo tipo básico
  const types = new Set()
  for (const item of data) {
    const value = item[key]
    if (value === undefined || value === null) {
      continue
    }
    
    if (typeof value === 'string' && isValidDate(value)) {
      types.add('date')
    } else {
      types.add(typeof value)
    }
    
    if (types.size > 1) {
      return false // Mixed types
    }
  }
  
  return true
}