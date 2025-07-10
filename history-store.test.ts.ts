// history-store.test.ts
import createHistoryStore from './history-store';

describe('History Store', () => {
  const initialState = { count: 0 };
  const useStore = createHistoryStore<typeof initialState>(initialState);
  
  it('should initialize with correct state', () => {
    const state = useStore.getState();
    expect(state.present).toEqual(initialState);
    expect(state.past).toEqual([]);
    expect(state.future).toEqual([]);
  });
  
  it('should commit new state', () => {
    useStore.getState().commitState({ count: 1 });
    const state = useStore.getState();
    expect(state.present).toEqual({ count: 1 });
    expect(state.past).toEqual([{ count: 0 }]);
    expect(state.future).toEqual([]);
  });
  
  it('should undo and redo', () => {
    // Commit varios estados
    useStore.getState().commitState({ count: 2 });
    useStore.getState().commitState({ count: 3 });
    
    // Undo
    useStore.getState().undo();
    let state = useStore.getState();
    expect(state.present).toEqual({ count: 2 });
    expect(state.past).toEqual([{ count: 0 }, { count: 1 }]);
    expect(state.future).toEqual([{ count: 3 }]);
    
    // Redo
    useStore.getState().redo();
    state = useStore.getState();
    expect(state.present).toEqual({ count: 3 });
    expect(state.past).toEqual([{ count: 0 }, { count: 1 }, { count: 2 }]);
    expect(state.future).toEqual([]);
  });
  
  it('should limit history to 50 states', () => {
    // Limpiar el store
    useStore.setState({
      past: [],
      present: { count: 0 },
      future: [],
      lastUpdate: 0,
    });
    
    // Commit 51 estados
    for (let i = 1; i <= 51; i++) {
      useStore.getState().commitState({ count: i });
    }
    
    const state = useStore.getState();
    expect(state.past.length).toBe(50);
    expect(state.past[0].count).toBe(1); // El primer estado debería ser 1 (el 0 se descartó)
  });
  
  it('should merge rapid changes', () => {
    // Limpiar el store
    useStore.setState({
      past: [],
      present: { count: 0 },
      future: [],
      lastUpdate: 0,
    });
    
    const now = Date.now();
    
    // Primer commit
    useStore.setState({
      ...useStore.getState(),
      lastUpdate: now,
    });
    useStore.getState().commitState({ count: 1 });
    
    // Segundo commit dentro de 500ms (debería mergearse)
    useStore.setState({
      ...useStore.getState(),
      lastUpdate: now + 400,
    });
    useStore.getState().commitState({ count: 2 });
    
    const state = useStore.getState();
    expect(state.past.length).toBe(1); // Solo debería haber un estado en el pasado (el 0)
    expect(state.present).toEqual({ count: 2 });
    
    // Undo debería llevarnos directamente al estado inicial
    useStore.getState().undo();
    expect(useStore.getState().present).toEqual({ count: 0 });
  });
});