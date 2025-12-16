import React from 'react';
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
} from '@dnd-kit/core';
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  verticalListSortingStrategy,
} from '@dnd-kit/sortable';
import { restrictToVerticalAxis } from '@dnd-kit/modifiers';
import { useDocumentStore } from '../store/documentStore';
import DraggableRow from './DraggableRow';
import { Save, RotateCcw, AlertCircle } from 'lucide-react';

const DocumentTable: React.FC = () => {
  const { documents, reorderDocuments, saveNewOrder, resetOrder, isLoading, error } = useDocumentStore();
  
  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    }),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;

    if (over && active.id !== over.id) {
      const oldIndex = documents.findIndex((doc) => doc.id === active.id);
      const newIndex = documents.findIndex((doc) => doc.id === over.id);
      
      if (oldIndex !== -1 && newIndex !== -1) {
        reorderDocuments(oldIndex, newIndex);
      }
    }
  };

  return (
    <div className="max-w-6xl mx-auto p-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Prioridades de Documentos
        </h1>
        <p className="text-gray-600">
          Arrastra y suelta las filas para reordenar las prioridades. Guarda los cambios cuando termines.
        </p>
      </div>

      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg flex items-center">
          <AlertCircle className="text-red-500 mr-3" size={24} />
          <div>
            <p className="text-red-800 font-medium">{error}</p>
            <p className="text-red-600 text-sm mt-1">
              Los números de prioridad deben ser únicos y consecutivos.
            </p>
          </div>
        </div>
      )}

      <div className="bg-white rounded-xl shadow-lg overflow-hidden mb-8">
        <div className="overflow-x-auto">
          <DndContext
            sensors={sensors}
            collisionDetection={closestCenter}
            onDragEnd={handleDragEnd}
            modifiers={[restrictToVerticalAxis]}
          >
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-12">
                    Arrastrar
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Documento
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider w-24">
                    Prioridad
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Tipo
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Última Actualización
                  </th>
                  <th className="py-4 px-6 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                    Estado
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                <SortableContext
                  items={documents.map((doc) => doc.id)}
                  strategy={verticalListSortingStrategy}
                >
                  {documents.map((document) => (
                    <DraggableRow key={document.id} document={document} />
                  ))}
                </SortableContext>
              </tbody>
            </table>
          </DndContext>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
        <div className="text-sm text-gray-600">
          <p>Total de documentos: <span className="font-semibold">{documents.length}</span></p>
          <p className="text-xs text-gray-500 mt-1">
            Los cambios se guardan automáticamente en el navegador. Haz clic en "Guardar Orden" para confirmar.
          </p>
        </div>
        
        <div className="flex gap-3">
          <button
            onClick={resetOrder}
            className="px-5 py-2.5 border border-gray-300 rounded-lg text-gray-700 font-medium hover:bg-gray-50 transition-colors duration-200 flex items-center gap-2"
            disabled={isLoading}
          >
            <RotateCcw size={18} />
            Restablecer
          </button>
          
          <button
            onClick={saveNewOrder}
            disabled={isLoading}
            className="px-6 py-2.5 bg-blue-600 text-white font-medium rounded-lg hover:bg-blue-700 transition-colors duration-200 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2"
          >
            {isLoading ? (
              <>
                <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                Guardando...
              </>
            ) : (
              <>
                <Save size={18} />
                Guardar Orden
              </>
            )}
          </button>
        </div>
      </div>

      <div className="mt-8 p-4 bg-blue-50 rounded-lg border border-blue-200">
        <h3 className="font-medium text-blue-900 mb-2 flex items-center">
          <AlertCircle size={18} className="mr-2" />
          Información importante
        </h3>
        <ul className="text-blue-800 text-sm space-y-1">
          <li>• Las prioridades se actualizan automáticamente al reordenar</li>
          <li>• El estado se conserva al recargar la página</li>
          <li>• Se validan las posiciones antes de guardar</li>
          <li>• Se previenen ordenamientos duplicados</li>
        </ul>
      </div>
    </div>
  );
};

export default DocumentTable;