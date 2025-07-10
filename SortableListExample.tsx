// SortableListExample.tsx
import React, { useState } from 'react';
import { DragDropContext, Droppable, Draggable } from 'react-beautiful-dnd';
import createAdvancedHistoryStore from './advanced-history-store';
import HistoryControls from './HistoryControls';

type Item = {
  id: string;
  content: string;
};

const initialItems: Item[] = Array.from({ length: 10 }, (_, i) => ({
  id: `item-${i}`,
  content: `Item ${i + 1}`,
}));

const listStore = createAdvancedHistoryStore<Item[]>(initialItems);

const SortableListExample = () => {
  const { present, commitState, undo, redo, canUndo, canRedo, past } = listStore();
  const [items, setItems] = useState(present);

  // Sincronizar con el estado del historial
  React.useEffect(() => {
    setItems(present);
  }, [present]);

  const handleDragEnd = (result: any) => {
    if (!result.destination) return;
    
    const newItems = Array.from(items);
    const [removed] = newItems.splice(result.source.index, 1);
    newItems.splice(result.destination.index, 0, removed);
    
    setItems(newItems);
    commitState(newItems, 'major');
  };

  return (
    <div className="list-container">
      <h2>Lista Ordenable con Historial</h2>
      
      <HistoryControls
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        currentHistorySize={past.length}
      />
      
      <DragDropContext onDragEnd={handleDragEnd}>
        <Droppable droppableId="droppable">
          {(provided) => (
            <div
              {...provided.droppableProps}
              ref={provided.innerRef}
              className="droppable-area"
            >
              {items.map((item, index) => (
                <Draggable key={item.id} draggableId={item.id} index={index}>
                  {(provided) => (
                    <div
                      ref={provided.innerRef}
                      {...provided.draggableProps}
                      {...provided.dragHandleProps}
                      className="draggable-item"
                    >
                      {item.content}
                    </div>
                  )}
                </Draggable>
              ))}
              {provided.placeholder}
            </div>
          )}
        </Droppable>
      </DragDropContext>
      
      <style jsx>{`
        .list-container {
          max-width: 500px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .droppable-area {
          padding: 10px;
          border-radius: 4px;
          background: #f5f5f5;
          min-height: 200px;
        }
        
        .draggable-item {
          padding: 12px;
          margin-bottom: 8px;
          background: white;
          border-radius: 4px;
          box-shadow: 0 1px 3px rgba(0,0,0,0.1);
          user-select: none;
        }
      `}</style>
    </div>
  );
};

export default SortableListExample;