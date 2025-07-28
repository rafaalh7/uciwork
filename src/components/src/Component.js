// Cambio importante (se guarda en historial)
updateForm({ name: 'Nuevo nombre' }, { isMajorChange: true });

// Cambio menor (no se guarda en historial)
updateForm({ name: 'Corrección ortográfica' }, { isMajorChange: false });