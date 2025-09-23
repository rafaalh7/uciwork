// components/ExportControls.jsx
import React from 'react';
import { useTable } from '../store/tableStore';
import { exportToCSV, exportToXLSX } from '../utils/exportUtils';

const ExportControls = () => {
  const {
    data,
    filteredData,
    selectedRows,
    exportFormat,
    exportScope,
    setExportFormat,
    setExportScope,
    addToExportHistory,
    setAlert
  } = useTable();

  const handleExport = () => {
    // Determinar qué datos exportar según el alcance seleccionado
    let dataToExport = [];
    let scopeDescription = '';

    switch (exportScope) {
      case 'all':
        dataToExport = data;
        scopeDescription = 'todos los datos';
        break;
      case 'filtered':
        dataToExport = filteredData;
        scopeDescription = 'datos filtrados';
        break;
      case 'selected':
        dataToExport = data.filter(item => selectedRows.has(item.id));
        scopeDescription = 'registros seleccionados';
        break;
      default:
        dataToExport = filteredData;
        scopeDescription = 'datos filtrados';
    }

    // Validar que haya datos para exportar
    if (dataToExport.length === 0) {
      setAlert('error', `No hay ${scopeDescription} para exportar`);
      return;
    }

    // Validar específicamente para el caso de registros seleccionados
    if (exportScope === 'selected' && selectedRows.size === 0) {
      setAlert('error', 'No hay registros seleccionados para exportar');
      return;
    }

    try {
      // Generar nombre de archivo con timestamp
      const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
      const filename = `exportacion_${timestamp}.${exportFormat}`;

      // Exportar según el formato seleccionado
      if (exportFormat === 'csv') {
        exportToCSV(dataToExport, filename);
      } else {
        exportToXLSX(dataToExport, filename);
      }

      // Registrar la exportación en el historial
      const exportRecord = {
        timestamp: new Date().toISOString(),
        format: exportFormat,
        scope: exportScope,
        recordCount: dataToExport.length,
        filename: filename
      };

      addToExportHistory(exportRecord);
      setAlert('success', `Se exportaron ${dataToExport.length} registros en formato ${exportFormat.toUpperCase()}`);

    } catch (error) {
      setAlert('error', `Error al exportar: ${error.message}`);
    }
  };

  return (
    <div className="export-controls">
      <div className="export-options">
        <div className="option-group">
          <label htmlFor="formatSelect">Formato:</label>
          <select 
            id="formatSelect"
            value={exportFormat} 
            onChange={(e) => setExportFormat(e.target.value)}
          >
            <option value="csv">CSV</option>
            <option value="xlsx">XLSX</option>
          </select>
        </div>

        <div className="option-group">
          <label htmlFor="scopeSelect">Alcance:</label>
          <select 
            id="scopeSelect"
            value={exportScope} 
            onChange={(e) => setExportScope(e.target.value)}
          >
            <option value="filtered">Datos filtrados</option>
            <option value="all">Todos los datos</option>
            <option value="selected">Registros seleccionados</option>
          </select>
        </div>
      </div>

      <button 
        className="export-btn"
        onClick={handleExport}
        disabled={exportScope === 'selected' && selectedRows.size === 0}
      >
        Exportar Datos
      </button>
    </div>
  );
};

export default ExportControls;