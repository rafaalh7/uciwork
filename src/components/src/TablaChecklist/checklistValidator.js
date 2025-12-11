/**
 * Valida que un checklist tenga al menos una tarea
 */
export const validateChecklist = (tasks) => {
  if (!Array.isArray(tasks)) {
    console.error('Checklist debe ser un array');
    return false;
  }
  
  if (tasks.length === 0) {
    console.error('Checklist debe contener al menos una tarea');
    return false;
  }
  
  // Validar que todas las tareas tengan descripción
  const invalidTasks = tasks.filter(task => 
    !task.description || task.description.trim() === ''
  );
  
  if (invalidTasks.length > 0) {
    console.error('Todas las tareas deben tener una descripción válida');
    return false;
  }
  
  return true;
};

/**
 * Valida una actualización de tarea
 */
export const validateTaskUpdate = (task, newCompletedStatus) => {
  if (!task) {
    console.error('Tarea no proporcionada');
    return false;
  }
  
  // Si la tarea ya está en el estado deseado, no es necesario actualizar
  if (task.completed === newCompletedStatus) {
    console.warn('La tarea ya está en el estado deseado');
    return false;
  }
  
  // Validaciones adicionales según reglas de negocio
  if (task.required && !newCompletedStatus) {
    console.warn('No se puede desmarcar una tarea requerida sin confirmación');
    return false;
  }
  
  return true;
};

/**
 * Valida datos de tarea antes de añadir
 */
export const validateNewTask = (taskData) => {
  if (!taskData) {
    throw new Error('Datos de tarea no proporcionados');
  }
  
  if (!taskData.description || taskData.description.trim() === '') {
    throw new Error('La tarea debe tener una descripción');
  }
  
  // Validar fecha si existe
  if (taskData.dueDate) {
    const dueDate = new Date(taskData.dueDate);
    if (isNaN(dueDate.getTime())) {
      throw new Error('Fecha de vencimiento inválida');
    }
    
    // No permitir fechas pasadas (opcional)
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    
    if (dueDate < today) {
      console.warn('La fecha de vencimiento está en el pasado');
    }
  }
  
  return true;
};

/**
 * Valida que se pueda eliminar una tarea
 */
export const validateTaskRemoval = (tasks, taskId) => {
  if (tasks.length <= 1) {
    throw new Error('No se puede eliminar la única tarea del checklist');
  }
  
  const taskToRemove = tasks.find(t => t.id === taskId);
  if (!taskToRemove) {
    throw new Error('Tarea no encontrada');
  }
  
  if (taskToRemove.required) {
    throw new Error('No se pueden eliminar tareas requeridas');
  }
  
  return true;
};