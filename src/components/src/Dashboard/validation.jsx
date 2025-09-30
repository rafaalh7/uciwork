// utils/validation.js
export const validateChartData = (categoryCounts) => {
  const categories = Object.keys(categoryCounts || {});
  
  if (categories.length === 0) {
    return {
      isValid: false,
      message: 'No hay datos disponibles para generar estadísticas.'
    };
  }
  
  if (categories.length === 1) {
    return {
      isValid: false,
      message: 'Se necesitan al menos dos categorías diferentes para mostrar el gráfico comparativo.'
    };
  }

  const totalDocuments = Object.values(categoryCounts).reduce((sum, count) => sum + count, 0);
  if (totalDocuments < 3) {
    return {
      isValid: false,
      message: `Insuficientes documentos (${totalDocuments}) para un análisis estadístico significativo.`
    };
  }
  
  return { isValid: true };
};