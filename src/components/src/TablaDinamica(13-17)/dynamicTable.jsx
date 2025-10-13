// components/DynamicTable.jsx
import { useState } from 'react';
import clsx from 'clsx';
import useDocumentStore, { STATUS_COLORS, ALLOWED_STATUSES } from '../store/documentStore';

const DynamicTable = () => {
  const { documents, updateDocumentStatus, validateDocument } = useDocumentStore();
  const [editingId, setEditingId] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleStatusChange = async (documentId, newStatus) => {
    try {
      setError('');
      setSuccess('');
      
      // Validar el estado
      if (!Object.values(ALLOWED_STATUSES).includes(newStatus)) {
        throw new Error(`Estado "${newStatus}" no está permitido`);
      }
      
      // Actualizar estado
      await updateDocumentStatus(documentId, newStatus);
      setEditingId(null);
      setSuccess('Estado actualizado correctamente');
      
      // Limpiar mensaje después de 3 segundos
      setTimeout(() => setSuccess(''), 3000);
      
    } catch (err) {
      setError(err.message);
      console.error('Error al actualizar estado:', err);
    }
  };

  const StatusBadge = ({ status, onClick, isEditing = false }) => (
    <span
      onClick={onClick}
      className={clsx(
        'inline-flex items-center px-3 py-1 rounded-full text-sm font-medium border cursor-pointer transition-all duration-200',
        STATUS_COLORS[status],
        isEditing && 'ring-2 ring-offset-2 ring-gray-400'
      )}
    >
      {status}
    </span>
  );

  const StatusSelector = ({ currentStatus, onSave, onCancel }) => {
    const [selectedStatus, setSelectedStatus] = useState(currentStatus);

    return (
      <div className="bg-white p-3 rounded-lg shadow-lg border border-gray-200">
        <select
          value={selectedStatus}
          onChange={(e) => setSelectedStatus(e.target.value)}
          className="w-full p-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          {Object.values(ALLOWED_STATUSES).map(status => (
            <option key={status} value={status}>
              {status}
            </option>
          ))}
        </select>
        
        <div className="flex gap-2 mt-3">
          <button
            onClick={() => onSave(selectedStatus)}
            className="flex-1 bg-blue-500 text-white py-1 px-3 rounded-md hover:bg-blue-600 transition-colors"
          >
            Guardar
          </button>
          <button
            onClick={onCancel}
            className="flex-1 bg-gray-500 text-white py-1 px-3 rounded-md hover:bg-gray-600 transition-colors"
          >
            Cancelar
          </button>
        </div>
      </div>
    );
  };

  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gray-50 px-6 py-4 border-b border-gray-200">
        <h2 className="text-xl font-semibold text-gray-800">Gestión de Documentos</h2>
        <p className="text-gray-600 text-sm mt-1">
          Total de documentos: {documents.length}
        </p>
      </div>

      {/* Mensajes de estado */}
      {error && (
        <div className="mx-6 mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center">
            <span className="text-red-600 text-sm">⚠️ {error}</span>
          </div>
        </div>
      )}
      
      {success && (
        <div className="mx-6 mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center">
            <span className="text-green-600 text-sm">✅ {success}</span>
          </div>
        </div>
      )}

      {/* Tabla */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Documento
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Autor
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fecha
              </th>
              <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Estado
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {documents.map((document) => (
              <tr 
                key={document.id} 
                className="hover:bg-gray-50 transition-colors duration-150"
              >
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm font-medium text-gray-900">
                    {document.title}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">{document.author}</div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="text-sm text-gray-600">
                    {new Date(document.date).toLocaleDateString('es-ES')}
                  </div>
                </td>
                <td className="px-6 py-4 whitespace-nowrap">
                  <div className="relative">
                    {editingId === document.id ? (
                      <StatusSelector
                        currentStatus={document.status}
                        onSave={(newStatus) => handleStatusChange(document.id, newStatus)}
                        onCancel={() => setEditingId(null)}
                      />
                    ) : (
                      <StatusBadge
                        status={document.status}
                        onClick={() => setEditingId(document.id)}
                      />
                    )}
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        
        {documents.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No hay documentos disponibles
          </div>
        )}
      </div>
    </div>
  );
};

export default DynamicTable;