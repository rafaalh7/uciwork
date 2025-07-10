// TextEditorExample.tsx
import React, { useState, useEffect, useCallback } from 'react';
import { Quill } from 'react-quill';
import 'react-quill/dist/quill.snow.css';
import createAdvancedHistoryStore from './advanced-history-store';
import HistoryControls from './HistoryControls';
import { Delta } from 'quill';

// Definir tipos para el editor
type EditorContent = {
  text: string;
  delta?: Delta;
};

const initialContent: EditorContent = {
  text: '',
  delta: new Delta(),
};

const editorStore = createAdvancedHistoryStore<EditorContent>(initialContent, {
  debounceTime: 1000, // Mayor debounce para el editor
});

const TextEditorExample = () => {
  const { present, commitState, undo, redo, canUndo, canRedo, past } = editorStore();
  const [value, setValue] = useState(present.text);
  const [quill, setQuill] = useState<Quill | null>(null);
  
  // Sincronizar con el estado del historial
  useEffect(() => {
    if (quill && present.delta) {
      quill.setContents(present.delta);
      setValue(present.text);
    }
  }, [present, quill]);

  const handleChange = useCallback(
    (content: string, delta: Delta, source: string) => {
      if (source === 'user') {
        const newContent = {
          text: content,
          delta,
        };
        
        // Commit como cambio menor (se mergeará si hay cambios rápidos)
        commitState(newContent, 'minor');
      }
    },
    [commitState]
  );

  const handleSave = () => {
    if (quill) {
      const delta = quill.getContents();
      const text = quill.getText();
      commitState({ text, delta }, 'major');
    }
  };

  const editorRef = useCallback((node: Quill) => {
    if (node) {
      setQuill(node);
    }
  }, []);

  return (
    <div className="editor-container">
      <h2>Editor de Texto con Historial</h2>
      
      <HistoryControls
        canUndo={canUndo}
        canRedo={canRedo}
        onUndo={undo}
        onRedo={redo}
        currentHistorySize={past.length}
      />
      
      <div className="editor-wrapper">
        <Quill
          ref={editorRef}
          value={value}
          onChange={handleChange}
          modules={{
            toolbar: [
              [{ header: [1, 2, false] }],
              ['bold', 'italic', 'underline', 'strike'],
              [{ list: 'ordered'}, { list: 'bullet' }],
              ['link', 'image'],
              ['clean'],
            ],
            history: {
              // Deshabilitar el historial nativo de Quill
              userOnly: true,
              delay: 0,
              maxStack: 0,
            },
          }}
          theme="snow"
        />
      </div>
      
      <button onClick={handleSave} className="save-button">
        Guardar Versión
      </button>
      
      <style jsx>{`
        .editor-container {
          max-width: 800px;
          margin: 0 auto;
          padding: 20px;
        }
        
        .editor-wrapper {
          height: 300px;
          margin-bottom: 20px;
        }
        
        .save-button {
          background-color: #1890ff;
          color: white;
          border: none;
          padding: 8px 16px;
          border-radius: 4px;
          cursor: pointer;
          font-size: 14px;
        }
      `}</style>
    </div>
  );
};

export default TextEditorExample;