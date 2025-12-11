import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { validateChecklist, validateTaskUpdate } from '../utils/checklistValidator';
import { calculateProgress } from '../utils/progressCalculator';

export const useChecklistStore = create(
  persist(
    (set, get) => ({
      // Estado de checklists por documento
      documentChecklists: {},
      
      // Estado global de progreso
      globalProgress: 0,
      
      // Historial de cambios
      changeHistory: [],
      
      // Inicializar checklist para un documento
      initializeChecklist: (documentId, tasks = []) => {
        set((state) => {
          const existingChecklist = state.documentChecklists[documentId];
          
          if (existingChecklist) {
            return state;
          }
          
          // Validar que haya al menos una tarea
          if (!validateChecklist(tasks)) {
            console.warn(`Checklist inválido para documento ${documentId}`);
            return state;
          }
          
          const newChecklist = {
            id: documentId,
            tasks: tasks.map(task => ({
              id: task.id || `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
              description: task.description || 'Tarea sin descripción',
              completed: task.completed || false,
              required: task.required || false,
              dueDate: task.dueDate,
              assignedTo: task.assignedTo,
              createdAt: new Date().toISOString()
            })),
            lastUpdated: new Date().toISOString(),
            progress: calculateProgress(tasks)
          };
          
          const updatedChecklists = {
            ...state.documentChecklists,
            [documentId]: newChecklist
          };
          
          // Calcular progreso global
          const globalProgress = calculateGlobalProgress(updatedChecklists);
          
          return {
            documentChecklists: updatedChecklists,
            globalProgress
          };
        });
      },
      
      // Actualizar estado de una tarea
      updateTaskStatus: (documentId, taskId, completed, requireConfirmation = true) => {
        set((state) => {
          const checklist = state.documentChecklists[documentId];
          
          if (!checklist) {
            console.warn(`Checklist no encontrado para documento ${documentId}`);
            return state;
          }
          
          const taskIndex = checklist.tasks.findIndex(t => t.id === taskId);
          
          if (taskIndex === -1) {
            console.warn(`Tarea ${taskId} no encontrada`);
            return state;
          }
          
          // Validar el cambio
          if (!validateTaskUpdate(checklist.tasks[taskIndex], completed)) {
            console.warn(`Cambio inválido para tarea ${taskId}`);
            return state;
          }
          
          // Crear copia actualizada
          const updatedTasks = [...checklist.tasks];
          const oldTask = { ...updatedTasks[taskIndex] };
          updatedTasks[taskIndex] = {
            ...oldTask,
            completed,
            updatedAt: new Date().toISOString()
          };
          
          // Crear entrada en historial
          const historyEntry = {
            id: `change-${Date.now()}`,
            documentId,
            taskId,
            taskDescription: oldTask.description,
            oldStatus: oldTask.completed,
            newStatus: completed,
            timestamp: new Date().toISOString(),
            userId: 'current-user', // En una app real, esto vendría del auth
            requiresConfirmation: requireConfirmation && oldTask.required
          };
          
          const updatedChecklist = {
            ...checklist,
            tasks: updatedTasks,
            lastUpdated: new Date().toISOString(),
            progress: calculateProgress(updatedTasks)
          };
          
          const updatedChecklists = {
            ...state.documentChecklists,
            [documentId]: updatedChecklist
          };
          
          // Calcular progreso global
          const globalProgress = calculateGlobalProgress(updatedChecklists);
          
          return {
            documentChecklists: updatedChecklists,
            globalProgress,
            changeHistory: [historyEntry, ...state.changeHistory].slice(0, 100) // Mantener últimas 100
          };
        });
      },
      
      // Actualizar múltiples tareas
      updateMultipleTasks: (documentId, taskUpdates) => {
        set((state) => {
          const checklist = state.documentChecklists[documentId];
          
          if (!checklist) {
            console.warn(`Checklist no encontrado para documento ${documentId}`);
            return state;
          }
          
          const updatedTasks = checklist.tasks.map(task => {
            const update = taskUpdates.find(u => u.taskId === task.id);
            if (update) {
              return {
                ...task,
                completed: update.completed,
                updatedAt: new Date().toISOString()
              };
            }
            return task;
          });
          
          const updatedChecklist = {
            ...checklist,
            tasks: updatedTasks,
            lastUpdated: new Date().toISOString(),
            progress: calculateProgress(updatedTasks)
          };
          
          const updatedChecklists = {
            ...state.documentChecklists,
            [documentId]: updatedChecklist
          };
          
          const globalProgress = calculateGlobalProgress(updatedChecklists);
          
          return {
            documentChecklists: updatedChecklists,
            globalProgress
          };
        });
      },
      
      // Marcar todas las tareas como completadas
      completeAllTasks: (documentId) => {
        set((state) => {
          const checklist = state.documentChecklists[documentId];
          
          if (!checklist) {
            return state;
          }
          
          const updatedTasks = checklist.tasks.map(task => ({
            ...task,
            completed: true,
            updatedAt: new Date().toISOString()
          }));
          
          const updatedChecklist = {
            ...checklist,
            tasks: updatedTasks,
            lastUpdated: new Date().toISOString(),
            progress: 100
          };
          
          const updatedChecklists = {
            ...state.documentChecklists,
            [documentId]: updatedChecklist
          };
          
          const globalProgress = calculateGlobalProgress(updatedChecklists);
          
          return {
            documentChecklists: updatedChecklists,
            globalProgress
          };
        });
      },
      
      // Reiniciar todas las tareas
      resetAllTasks: (documentId) => {
        set((state) => {
          const checklist = state.documentChecklists[documentId];
          
          if (!checklist) {
            return state;
          }
          
          const updatedTasks = checklist.tasks.map(task => ({
            ...task,
            completed: false,
            updatedAt: new Date().toISOString()
          }));
          
          const updatedChecklist = {
            ...checklist,
            tasks: updatedTasks,
            lastUpdated: new Date().toISOString(),
            progress: 0
          };
          
          const updatedChecklists = {
            ...state.documentChecklists,
            [documentId]: updatedChecklist
          };
          
          const globalProgress = calculateGlobalProgress(updatedChecklists);
          
          return {
            documentChecklists: updatedChecklists,
            globalProgress
          };
        });
      },
      
      // Añadir nueva tarea
      addTask: (documentId, taskData) => {
        set((state) => {
          const checklist = state.documentChecklists[documentId];
          
          if (!checklist) {
            return state;
          }
          
          const newTask = {
            id: `task-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
            description: taskData.description || 'Nueva tarea',
            completed: false,
            required: taskData.required || false,
            dueDate: taskData.dueDate,
            assignedTo: taskData.assignedTo,
            createdAt: new Date().toISOString()
          };
          
          const updatedTasks = [...checklist.tasks, newTask];
          
          const updatedChecklist = {
            ...checklist,
            tasks: updatedTasks,
            lastUpdated: new Date().toISOString(),
            progress: calculateProgress(updatedTasks)
          };
          
          const updatedChecklists = {
            ...state.documentChecklists,
            [documentId]: updatedChecklist
          };
          
          const globalProgress = calculateGlobalProgress(updatedChecklists);
          
          return {
            documentChecklists: updatedChecklists,
            globalProgress
          };
        });
      },
      
      // Eliminar tarea
      removeTask: (documentId, taskId) => {
        set((state) => {
          const checklist = state.documentChecklists[documentId];
          
          if (!checklist) {
            return state;
          }
          
          // No permitir eliminar si solo queda una tarea
          if (checklist.tasks.length <= 1) {
            console.warn('No se puede eliminar la única tarea del checklist');
            return state;
          }
          
          const updatedTasks = checklist.tasks.filter(task => task.id !== taskId);
          
          const updatedChecklist = {
            ...checklist,
            tasks: updatedTasks,
            lastUpdated: new Date().toISOString(),
            progress: calculateProgress(updatedTasks)
          };
          
          const updatedChecklists = {
            ...state.documentChecklists,
            [documentId]: updatedChecklist
          };
          
          const globalProgress = calculateGlobalProgress(updatedChecklists);
          
          return {
            documentChecklists: updatedChecklists,
            globalProgress
          };
        });
      },
      
      // Obtener checklist de un documento
      getDocumentChecklist: (documentId) => {
        return get().documentChecklists[documentId];
      },
      
      // Obtener estadísticas
      getStatistics: () => {
        const { documentChecklists } = get();
        const documentIds = Object.keys(documentChecklists);
        
        let totalTasks = 0;
        let completedTasks = 0;
        let totalDocuments = documentIds.length;
        let completedDocuments = 0;
        
        documentIds.forEach(docId => {
          const checklist = documentChecklists[docId];
          totalTasks += checklist.tasks.length;
          completedTasks += checklist.tasks.filter(t => t.completed).length;
          
          if (checklist.progress === 100) {
            completedDocuments++;
          }
        });
        
        return {
          totalDocuments,
          completedDocuments,
          totalTasks,
          completedTasks,
          globalProgress: get().globalProgress,
          completionRate: totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0
        };
      },
      
      // Limpiar todos los checklists
      clearAllChecklists: () => {
        set({
          documentChecklists: {},
          globalProgress: 0,
          changeHistory: []
        });
      }
    }),
    {
      name: 'checklist-storage',
      partialize: (state) => ({
        documentChecklists: state.documentChecklists,
        globalProgress: state.globalProgress
      })
    }
  )
);

// Función auxiliar para calcular progreso global
const calculateGlobalProgress = (documentChecklists) => {
  const documentIds = Object.keys(documentChecklists);
  
  if (documentIds.length === 0) {
    return 0;
  }
  
  const totalProgress = documentIds.reduce((sum, docId) => {
    return sum + (documentChecklists[docId]?.progress || 0);
  }, 0);
  
  return Math.round(totalProgress / documentIds.length);
};