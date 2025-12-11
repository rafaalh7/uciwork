import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useActionsHistoryStore = create(
  persist(
    (set, get) => ({
      actionsHistory: [],
      
      addAction: (action) => {
        const { actionsHistory } = get();
        const newAction = {
          ...action,
          id: `action-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString(),
          status: 'completed'
        };
        
        // Mantener solo las últimas 50 acciones
        const updatedHistory = [newAction, ...actionsHistory].slice(0, 50);
        
        set({ actionsHistory: updatedHistory });
        
        return newAction;
      },
      
      addFailedAction: (action, error) => {
        const { actionsHistory } = get();
        const newAction = {
          ...action,
          id: `action-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
          timestamp: new Date().toISOString(),
          status: 'failed',
          error: error?.message || 'Error desconocido'
        };
        
        const updatedHistory = [newAction, ...actionsHistory].slice(0, 50);
        set({ actionsHistory: updatedHistory });
      },
      
      getRecentActions: (limit = 10) => {
        return get().actionsHistory.slice(0, limit);
      },
      
      getActionsByType: (actionType) => {
        return get().actionsHistory.filter(action => action.type === actionType);
      },
      
      getActionsByDocument: (documentId) => {
        return get().actionsHistory.filter(action => action.documentId === documentId);
      },
      
      clearHistory: () => {
        set({ actionsHistory: [] });
      },
      
      getStats: () => {
        const { actionsHistory } = get();
        const total = actionsHistory.length;
        const completed = actionsHistory.filter(a => a.status === 'completed').length;
        const failed = actionsHistory.filter(a => a.status === 'failed').length;
        
        return { total, completed, failed };
      }
    }),
    {
      name: 'actions-history-storage',
    }
  )
);