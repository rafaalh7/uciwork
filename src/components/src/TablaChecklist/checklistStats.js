import React from 'react';
import { useChecklistStore } from '../../stores/useChecklistStore';
import ProgressBar from './ProgressBar';
import './ChecklistTable.css';

const ChecklistStats = () => {
  const { getStatistics, globalProgress } = useChecklistStore();
  const stats = getStatistics();
  
  const {
    totalDocuments,
    completedDocuments,
    totalTasks,
    completedTasks,
    completionRate
  } = stats;
  
  // Calcular documentos por estado
  const documentsInProgress = totalDocuments - completedDocuments;
  
  // Calcular tareas por día (si tuviéramos datos de fecha)
  const avgTasksPerDocument = totalDocuments > 0 ? (totalTasks / totalDocuments).toFixed(1) : 0;
  
  return (
    <div className="checklist-stats">
      <h3>📊 Estadísticas Globales</h3>
      
      <div className="stats-grid">
        {/* Progreso Global */}
        <div className="stat-card primary">
          <div className="stat-header">
            <span className="stat-icon">🎯</span>
            <h4>Progreso Global</h4>
          </div>
          <div className="stat-body">
            <div className="progress-display">
              <ProgressBar progress