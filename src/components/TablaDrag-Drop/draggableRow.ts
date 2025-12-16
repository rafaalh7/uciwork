import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';
import { Document } from '../types/document';
import { GripVertical, FileText } from 'lucide-react';

interface DraggableRowProps {
  document: Document;
}

const DraggableRow: React.FC<DraggableRowProps> = ({ document }) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: document.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
  };

  const getStatusColor = (status: Document['status']) => {
    switch (status) {
      case 'approved': return 'bg-green-100 text-green-800';
      case 'reviewed': return 'bg-blue-100 text-blue-800';
      case 'pending': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`border-b hover:bg-gray-50 transition-colors duration-200 ${
        isDragging ? 'shadow-lg z-10' : ''
      }`}
    >
      <td className="py-4 px-6">
        <button
          className="cursor-grab active:cursor-grabbing text-gray-400 hover:text-gray-600 transition-colors"
          {...attributes}
          {...listeners}
        >
          <GripVertical size={20} />
        </button>
      </td>
      <td className="py-4 px-6 font-medium text-gray-900">
        <div className="flex items-center">
          <FileText size={18} className="mr-2 text-blue-500" />
          {document.title}
        </div>
      </td>
      <td className="py-4 px-6">
        <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-blue-100 text-blue-800 font-semibold">
          {document.priority}
        </span>
      </td>
      <td className="py-4 px-6 text-gray-700">{document.type}</td>
      <td className="py-4 px-6 text-gray-700">{document.lastUpdated}</td>
      <td className="py-4 px-6">
        <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(document.status)}`}>
          {document.status.charAt(0).toUpperCase() + document.status.slice(1)}
        </span>
      </td>
    </tr>
  );
};

export default DraggableRow;