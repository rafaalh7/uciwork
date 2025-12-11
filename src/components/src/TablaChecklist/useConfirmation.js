import { useState, useCallback } from 'react';

/**
 * Hook para manejar confirmaciones antes de acciones críticas
 */
export const useConfirmation = () => {
  const [confirmationState, setConfirmationState] = useState({
    isOpen: false,
    title: '',
    message: '',
    onConfirm: null,
    onCancel: null,
    type: 'warning'
  });

  const showConfirmation = useCallback(({
    title = 'Confirmar acción',
    message = '¿Está seguro de realizar esta acción?',
    onConfirm,
    onCancel,
    type = 'warning'
  }) => {
    setConfirmationState({
      isOpen: true,
      title,
      message,
      onConfirm: () => {
        if (onConfirm) onConfirm();
        setConfirmationState(prev => ({ ...prev, isOpen: false }));
      },
      onCancel: () => {
        if (onCancel) onCancel();
        setConfirmationState(prev => ({ ...prev, isOpen: false }));
      },
      type
    });
  }, []);

  const hideConfirmation = useCallback(() => {
    setConfirmationState(prev => ({ ...prev, isOpen: false }));
  }, []);

  const ConfirmationDialog = () => {
    if (!confirmationState.isOpen) return null;

    const { title, message, onConfirm, onCancel, type } = confirmationState;

    const getTypeStyles = () => {
      switch (type) {
        case 'danger':
          return {
            icon: '⚠️',
            confirmClass: 'btn-danger',
            titleClass: 'text-danger'
          };
        case 'warning':
          return {
            icon: '⚠️',
            confirmClass: 'btn-warning',
            titleClass: 'text-warning'
          };
        case 'info':
          return {
            icon: 'ℹ️',
            confirmClass: 'btn-info',
            titleClass: 'text-info'
          };
        default:
          return {
            icon: '❓',
            confirmClass: 'btn-primary',
            titleClass: 'text-primary'
          };
      }
    };

    const styles = getTypeStyles();

    return (
      <div className="confirmation-overlay">
        <div className="confirmation-dialog">
          <div className={`confirmation-header ${styles.titleClass}`}>
            <span className="confirmation-icon">{styles.icon}</span>
            <h3>{title}</h3>
          </div>
          
          <div className="confirmation-body">
            <p>{message}</p>
          </div>
          
          <div className="confirmation-footer">
            <button
              className="btn btn-secondary"
              onClick={onCancel}
              autoFocus
            >
              Cancelar
            </button>
            <button
              className={`btn ${styles.confirmClass}`}
              onClick={onConfirm}
            >
              Confirmar
            </button>
          </div>
        </div>
      </div>
    );
  };

  return {
    showConfirmation,
    hideConfirmation,
    ConfirmationDialog,
    isOpen: confirmationState.isOpen
  };
};