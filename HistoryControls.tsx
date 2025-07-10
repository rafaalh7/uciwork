// HistoryControls.tsx
import React, { useEffect } from 'react';
import { useHotkeys } from 'react-hotkeys-hook';
import { toast } from 'react-toastify';
import { FiRotateCcw, FiRotateCw } from 'react-icons/fi';

interface HistoryControlsProps<T> {
  canUndo: boolean;
  canRedo: boolean;
  onUndo: () => void;
  onRedo: () => void;
  maxStates?: number;
  currentHistorySize: number;
}

const HistoryControls = <T,>({
  canUndo,
  canRedo,
  onUndo,
  onRedo,
  maxStates = 50,
  currentHistorySize,
}: HistoryControlsProps<T>) => {
  // Atajos de teclado
  useHotkeys('ctrl+z, cmd+z', (e) => {
    e.preventDefault();
    if (canUndo) onUndo();
  });
  
  useHotkeys('ctrl+y, cmd+shift+z', (e) => {
    e.preventDefault();
    if (canRedo) onRedo();
  });

  // Notificación cuando se acerca al límite
  useEffect(() => {
    if (currentHistorySize >= maxStates * 0.9) {
      toast.info(`Has alcanzado el ${Math.round((currentHistorySize / maxStates) * 100)}% de la capacidad del historial.`, {
        autoClose: 3000,
      });
    }
  }, [currentHistorySize, maxStates]);

  return (
    <div className="history-controls">
      <button
        className={`history-button ${!canUndo ? 'disabled' : ''}`}
        onClick={onUndo}
        disabled={!canUndo}
        aria-label="Deshacer"
        data-tooltip="Deshacer (Ctrl+Z)"
      >
        <FiRotateCcw />
        <span>Undo</span>
      </button>
      
      <button
        className={`history-button ${!canRedo ? 'disabled' : ''}`}
        onClick={onRedo}
        disabled={!canRedo}
        aria-label="Rehacer"
        data-tooltip="Rehacer (Ctrl+Y)"
      >
        <FiRotateCw />
        <span>Redo</span>
      </button>
      
      <style jsx>{`
        .history-controls {
          display: flex;
          gap: 8px;
          margin: 12px 0;
        }
        
        .history-button {
          display: flex;
          align-items: center;
          gap: 6px;
          padding: 6px 12px;
          background: #f0f0f0;
          border: 1px solid #ddd;
          border-radius: 4px;
          cursor: pointer;
          transition: all 0.2s;
          font-size: 14px;
        }
        
        .history-button:hover:not(.disabled) {
          background: #e0e0e0;
          border-color: #ccc;
        }
        
        .history-button.disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }
        
        .history-button span {
          margin-top: 1px;
        }
      `}</style>
    </div>
  );
};

export default HistoryControls;