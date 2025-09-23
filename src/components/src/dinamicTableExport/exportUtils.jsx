// utils/exportUtils.js
// Función para exportar a CSV
export const exportToCSV = (data, filename) => {
  if (data.length === 0) {
    throw new Error('No hay datos para exportar');
  }

  // Encabezados
  const headers = ['ID', 'Nombre', 'Email', 'Departamento', 'Salario', 'Fecha de Contratación'];
  
  // Convertir datos a filas CSV
  const csvRows = [
    headers.join(','),
    ...data.map(item => [
      item.id,
      `"${item.name}"`, // Entre comillas para manejar posibles comas en el nombre
      item.email,
      item.department,
      item.salary,
      item.hireDate
    ].join(','))
  ];

  const csvContent = csvRows.join('\n');
  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  
  // Crear enlace de descarga
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  // Liberar URL
  URL.revokeObjectURL(url);
};

// Función para exportar a XLSX (simulada)
export const exportToXLSX = (data, filename) => {
  if (data.length === 0) {
    throw new Error('No hay datos para exportar');
  }

  // En una implementación real, aquí se usaría una biblioteca como SheetJS
  // Por ahora, simulamos la exportación mostrando un mensaje
  console.log('Exportando a XLSX:', {
    filename,
    recordCount: data.length,
    data: data.slice(0, 3) // Mostrar solo los primeros 3 registros en el log
  });

  // Simulamos la descarga creando un blob con contenido de ejemplo
  const exampleContent = `Esta es una simulación de exportación XLSX para ${data.length} registros.\nEn una implementación real, se usaría una biblioteca como SheetJS.`;
  const blob = new Blob([exampleContent], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
  
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', filename);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
  
  // En una implementación real, descomentar el código siguiente y comentar la simulación:
  /*
  const worksheet = XLSX.utils.json_to_sheet(data.map(item => ({
    ID: item.id,
    Nombre: item.name,
    Email: item.email,
    Departamento: item.department,
    Salario: item.salary,
    'Fecha de Contratación': item.hireDate
  })));
  
  const workbook = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(workbook, worksheet, 'Datos');
  XLSX.writeFile(workbook, filename);
  */
};