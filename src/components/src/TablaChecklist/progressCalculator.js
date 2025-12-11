/**
 * Calcula el progreso de un checklist
 */
export const calculateProgress = (tasks) => {
  if (!Array.isArray(tasks) || tasks.length === 0) {
    return 0;
  }
  
  const completedTasks = tasks.filter(task => task.completed).length;
  const progress = (completedTasks / tasks.length) * 100;
  
  return Math.round(progress);
};

/**
 * Calcula progreso con peso por tareas requeridas
 */
export const calculateWeightedProgress = (tasks) => {
  if (!Array.isArray(tasks) || tasks.length === 0) {
    return 0;
  }
  
  let totalWeight = 0;
  let completedWeight = 0;
  
  tasks.forEach(task => {
    const weight = task.required ? 2 : 1; // Tareas requeridas tienen más peso
    totalWeight += weight;
    
    if (task.completed) {
      completedWeight += weight;
    }
  });
  
  const progress = (completedWeight / totalWeight) * 100;
  return Math.round(progress);
};

/**
 * Calcula días restantes para tareas pendientes
 */
export const calculateRemainingDays = (tasks) => {
  if (!Array.isArray(tasks)) {
    return null;
  }
  
  const pendingTasks = tasks.filter(task => !task.completed && task.dueDate);
  
  if (pendingTasks.length === 0) {
    return null;
  }
  
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let totalDays = 0;
  let count = 0;
  
  pendingTasks.forEach(task => {
    const dueDate = new Date(task.dueDate);
    dueDate.setHours(0, 0, 0, 0);
    
    const diffTime = dueDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    
    if (diffDays > 0) {
      totalDays += diffDays;
      count++;
    }
  });
  
  return count > 0 ? Math.round(totalDays / count) : 0;
};

/**
 * Obtiene estadísticas detalladas del progreso
 */
export const getProgressStats = (tasks) => {
  const total = tasks.length;
  const completed = tasks.filter(t => t.completed).length;
  const pending = total - completed;
  const required = tasks.filter(t => t.required).length;
  const requiredCompleted = tasks.filter(t => t.required && t.completed).length;
  
  const progress = calculateProgress(tasks);
  const weightedProgress = calculateWeightedProgress(tasks);
  const avgDaysLeft = calculateRemainingDays(tasks);
  
  return {
    total,
    completed,
    pending,
    required,
    requiredCompleted,
    progress,
    weightedProgress,
    avgDaysLeft
  };
};