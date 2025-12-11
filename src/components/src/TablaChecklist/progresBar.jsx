import React from 'react';
import './ChecklistTable.css';

const ProgressBar = ({ 
  progress, 
  showLabel = true, 
  height = 12, 
  animate = true,
  color = null,
  showPercentage = true 
}) => {
  // Determinar color basado en progreso
  const getProgressColor = (progressValue) => {
    if (color) return color;
    
    if (progressValue < 30) return '#f44336'; // Rojo
    if (progressValue < 70) return '#ff9800'; // Naranja
    if (progressValue < 90) return '#2196f3'; // Azul
    return '#4caf50'; // Verde
  };
  
  // Determinar clase de estado
  const getStatusClass = (progressValue) => {
    if (progressValue < 30) return 'low';
    if (progressValue < 70) return 'medium';
    if (progressValue < 90) return 'high';
    return 'complete';
  };
  
  const progressValue = Math.min(100, Math.max(0, progress));
  const progressColor = getProgressColor(progressValue);
  const statusClass = getStatusClass(progressValue);
  
  const progressBarStyle = {
    height: `${height}px`,
    borderRadius: `${height / 2}px`
  };
  
  const progressFillStyle = {
    width: `${progressValue}%`,
    backgroundColor: progressColor,
    borderRadius: `${height / 2}px`,
    transition: animate ? 'width 0.5s ease-in-out' : 'none'
  };
  
  const getStatusText = () => {
    if (progressValue === 0) return 'Sin empezar';
    if (progressValue < 100) return 'En progreso';
    return 'Completado';
  };
  
  return (
    <div className="progress-bar-container">
      {showLabel && (
        <div className="progress-labels">
          <span className="progress-status">{getStatusText()}</span>
          {showPercentage && (
            <span className="progress-percentage">
              {progressValue}%
            </span>
          )}
        </div>
      )}
      
      <div 
        className={`progress-bar ${statusClass}`}
        style={progressBarStyle}
        role="progressbar"
        aria-valuenow={progressValue}
        aria-valuemin="0"
        aria-valuemax="100"
      >
        <div 
          className="progress-fill"
          style={progressFillStyle}
        />
        
        {/* Marcas de referencia opcionales */}
        {progressValue > 0 && progressValue < 100 && (
          <div className="progress-marker" style={{ left: `${progressValue}%` }}>
            <div className="marker-dot" />
          </div>
        )}
      </div>
      
      {/* Indicador de progreso detallado */}
      <div className="progress-details">
        <span className="detail-item">
          <span className="detail-dot" style={{ backgroundColor: progressColor }} />
          <small>{progressValue}% completado</small>
        </span>
      </div>
    </div>
  );
};

export default ProgressBar;