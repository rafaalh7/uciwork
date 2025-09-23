// components/ExportHistory.jsx
import React from 'react';
import { useTable } from '../store/tableStore';

const ExportHistory = () => {
  const { exportHistory } = useTable();

  const formatTimestamp = (timestamp) => {
    return new Date(timestamp).toLocaleString('es-ES');
  };

  if (exportHistory.length === 0) {
    return (
      <div className="export-history">
        <h3>Historial de Exportaciones</h3>
        <div className="history-empty">
          No hay exportaciones recientes
        </div>
      </div>
    );
  }

  return (
    <div className="export-history">
      <h3>Historial de Exportaciones</h3>
      <div className="history-list">
        {exportHistory.map((record, index) => (
          <div key={index} className="history-item">
            <div className="history-info">
              <div className="history-timestamp">{formatTimestamp(record.timestamp)}</div>
              <div className="history-details">
                {record.recordCount} registros ({record.scope}) - {record.format.toUpperCase()}
              </div>
            </div>
            <div className="history-filename">{record.filename}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ExportHistory;