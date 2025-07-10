// use-history.ts
import { useCallback } from 'react';
import createHistoryStore from './history-store';

// Tipo genérico para el estado
interface FormState {
  firstName: string;
  lastName: string;
}

const initialState: FormState = {
  firstName: '',
  lastName: '',
};

const useHistoryStore = createHistoryStore<FormState>(initialState);

export const useHistory = () => {
  const { present, past, future, commitState, undo, redo, clearHistory } = useHistoryStore();
  
  const canUndo = past.length > 0;
  const canRedo = future.length > 0;
  
  return {
    state: present,
    commitState: useCallback((state: FormState) => commitState(state), [commitState]),
    undo: useCallback(() => undo(), [undo]),
    redo: useCallback(() => redo(), [redo]),
    clearHistory: useCallback(() => clearHistory(), [clearHistory]),
    canUndo,
    canRedo,
    history: {
      past,
      future,
    },
  };
};