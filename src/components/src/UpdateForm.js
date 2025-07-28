updateForm: (updater, { isMajorChange = true } = {}) => {
  const now = Date.now();
  const { past, present, lastActionTime } = get();
  
  // Solo agregar al historial si es un cambio importante
  if (!isMajorChange) {
    set((state) => {
      state.present = typeof updater === 'function' ? updater(state.present) : { ...state.present, ...updater };
      state.lastActionTime = now;
    });
    return;
  }
  
  // Resto de la lógica para cambios importantes...
}