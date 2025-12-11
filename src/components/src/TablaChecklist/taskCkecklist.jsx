import React, { useState } from 'react';
import { useChecklistStore } from '../../stores/useChecklistStore';
import { useConfirmation } from '../../hooks/useConfirmation';
import { validateNewTask } from '../../utils/checklistValidator';
import ProgressBar from './ProgressBar';
import './ChecklistTable.css';

const TaskChecklist = ({ documentId, tasks: initialTasks }) => {
  const [newTaskDescription, setNewTaskDescription] = useState('');
  const [isAddingTask, setIsAddingTask] = useState(false);
  const [expanded, setExpanded] = useState(false);
  
  const { 
    getDocumentChecklist,
    updateTaskStatus,
    addTask,
    removeTask,
    completeAllTasks,
    resetAllTasks 
  } = useChecklistStore();
  
  const { showConfirmation, ConfirmationDialog } = useConfirmation();
  
  // Obtener checklist actual del store
  const checklist = getDocumentChecklist(documentId) || {
    tasks: initialTasks,
    progress: 0
  };
  
  const { tasks, progress } = checklist;
  
  const handleTaskToggle = (taskId, currentStatus) => {
    const task = tasks.find(t => t.id === taskId);
    
    if (!task) return;
    
    // Si es tarea requerida y se va a desmarcar, pedir confirmación
    if (task.required && currentStatus) {
      showConfirmation({
        title: 'Desmarcar tarea requerida',
        message: 'Esta tarea es requerida. ¿Está seguro de desmarcarla?',
        type: 'warning',
        onConfirm: () => {
          updateTaskStatus(documentId, taskId, !currentStatus, false);
        }
      });
      return;
    }
    
    updateTaskStatus(documentId, taskId, !currentStatus);
  };
  
  const handleAddTask = () => {
    if (!newTaskDescription.trim()) {
      alert('Por favor ingrese una descripción para la tarea');
      return;
    }
    
    try {
      validateNewTask({ description: newTaskDescription });
      
      addTask(documentId, {
        description: newTaskDescription.trim(),
        required: false
      });
      
      setNewTaskDescription('');
      setIsAddingTask(false);
    } catch (error) {
      alert(error.message);
    }
  };
  
  const handleRemoveTask = (taskId) => {
    const task = tasks.find(t => t.id === taskId);
    
    showConfirmation({
      title: 'Eliminar tarea',
      message: `¿Está seguro de eliminar la tarea "${task?.description}"?`,
      type: 'danger',
      onConfirm: () => {
        removeTask(documentId, taskId);
      }
    });
  };
  
  const handleCompleteAll = () => {
    showConfirmation({
      title: 'Completar todas las tareas',
      message: '¿Marcar todas las tareas como completadas?',
      onConfirm: () => {
        completeAllTasks(documentId);
      }
    });
  };
  
  const handleResetAll = () => {
    showConfirmation({
      title: 'Reiniciar progreso',
      message: '¿Restablecer todas las tareas a pendientes?',
      type: 'warning',
      onConfirm: () => {
        resetAllTasks(documentId);
      }
    });
  };
  
  // Calcular estadísticas
  const completedTasks = tasks.filter(t => t.completed).length;
  const requiredTasks = tasks.filter(t => t.required).length;
  const pendingTasks = tasks.length - completedTasks;
  
  const formatDueDate = (dateString) => {
    if (!dateString) return null;
    
    const date = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    const dueDate = new Date(date);
    dueDate.setHours(0, 0, 0, 0);
    
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays === 0) return 'Hoy';
    if (diffDays === 1) return 'Mañana';
    if (diffDays === -1) return 'Ayer';
    if (diffDays < 0) return `Hace ${Math.abs(diffDays)} días`;
    return `En ${diffDays} días`;
  };
  
  return (
    <div className={`task-checklist ${expanded ? 'expanded' : ''}`}>
      <div className="checklist-header" onClick={() => setExpanded(!expanded)}>
        <div className="header-left">
          <span className="expand-icon">
            {expanded ? '▼' : '▶'}
          </span>
          <h4>Checklist de Tareas</h4>
          <span className="task-count">
            ({completedTasks}/{tasks.length})
          </span>
        </div>
        
        <div className="header-right">
          <ProgressBar progress={progress} height={8} showLabel={false} />
        </div>
      </div>
      
      {expanded && (
        <div className="checklist-content">
          {/* Estadísticas rápidas */}
          <div className="quick-stats">
            <div className="stat-item">
              <span className="stat-value">{completedTasks}</span>
              <span className="stat-label">Completadas</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{pendingTasks}</span>
              <span className="stat-label">Pendientes</span>
            </div>
            <div className="stat-item">
              <span className="stat-value">{requiredTasks}</span>
              <span className="stat-label">Requeridas</span>
            </div>
          </div>
          
          {/* Barra de progreso principal */}
          <div className="main-progress">
            <ProgressBar progress={progress} showLabel={true} height={14} />
          </div>
          
          {/* Lista de tareas */}
          <div className="tasks-list">
            {tasks.length === 0 ? (
              <div className="no-tasks">
                <p>No hay tareas en este checklist</p>
                <small>Añada la primera tarea para comenzar</small>
              </div>
            ) : (
              tasks.map((task, index) => (
                <div 
                  key={task.id} 
                  className={`task-item ${task.completed ? 'completed' : ''} ${task.required ? 'required' : ''}`}
                >
                  <div className="task-checkbox-container">
                    <input
                      type="checkbox"
                      id={`task-${task.id}`}
                      checked={task.completed}
                      onChange={() => handleTaskToggle(task.id, task.completed)}
                      className="task-checkbox"
                      disabled={task.required && task.completed}
                    />
                    <label 
                      htmlFor={`task-${task.id}`}
                      className="task-label"
                    >
                      <span className="task-number">{index + 1}.</span>
                      <span className="task-description">{task.description}</span>
                      
                      {task.required && (
                        <span className="required-badge" title="Tarea requerida">
                          *
                        </span>
                      )}
                    </label>
                  </div>
                  
                  <div className="task-actions">
                    {task.dueDate && (
                      <span className="due-date" title={`Vence: ${new Date(task.dueDate).toLocaleDateString()}`}>
                        📅 {formatDueDate(task.dueDate)}
                      </span>
                    )}
                    
                    {!task.required && (
                      <button
                        className="remove-task-btn"
                        onClick={() => handleRemoveTask(task.id)}
                        title="Eliminar tarea"
                      >
                        🗑️
                      </button>
                    )}
                  </div>
                </div>
              ))
            )}
          </div>
          
          {/* Añadir nueva tarea */}
          <div className="add-task-section">
            {isAddingTask ? (
              <div className="add-task-form">
                <input
                  type="text"
                  value={newTaskDescription}
                  onChange={(e) => setNewTaskDescription(e.target.value)}
                  placeholder="Descripción de la nueva tarea"
                  className="task-input"
                  autoFocus
                  onKeyPress={(e) => e.key === 'Enter' && handleAddTask()}
                />
                <div className="form-actions">
                  <button
                    className="btn btn-success btn-sm"
                    onClick={handleAddTask}
                  >
                    Añadir
                  </button>
                  <button
                    className="btn btn-secondary btn-sm"
                    onClick={() => {
                      setIsAddingTask(false);
                      setNewTaskDescription('');
                    }}
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            ) : (
              <button
                className="btn btn-outline-primary btn-sm"
                onClick={() => setIsAddingTask(true)}
              >
                + Añadir tarea
              </button>
            )}
          </div>
          
          {/* Acciones masivas */}
          <div className="bulk-actions">
            <button
              className="btn btn-success btn-sm"
              onClick={handleCompleteAll}
              disabled={completedTasks === tasks.length}
            >
              ✅ Completar todas
            </button>
            <button
              className="btn btn-warning btn-sm"
              onClick={handleResetAll}
              disabled={completedTasks === 0}
            >
              🔄 Reiniciar todas
            </button>
          </div>
        </div>
      )}
      
      <ConfirmationDialog />
    </div>
  );
};

export default TaskChecklist;