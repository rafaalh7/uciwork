// components/DocumentTable.js
import useStore from '../store';

const DocumentTable = () => {
  const { documents } = useStore();

  return (
    <div className="bg-white shadow-md rounded-lg overflow-hidden">
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border border-gray-200">
          <thead className="bg-gray-200">
            <tr>
              <th className="py-3 px-4 border-b border-gray-200 text-left text-gray-600 font-semibold">Nombre</th>
              <th className="py-3 px-4 border-b border-gray-200 text-left text-gray-600 font-semibold">Categoría</th>
              <th className="py-3 px-4 border-b border-gray-200 text-left text-gray-600 font-semibold">Fecha</th>
              <th className="py-3 px-4 border-b border-gray-200 text-left text-gray-600 font-semibold">Tamaño</th>
            </tr>
          </thead>
          <tbody>
            {documents.map((doc) => (
              <tr key={doc.id} className="hover:bg-gray-50 even:bg-gray-50">
                <td className="py-3 px-4 border-b border-gray-200 text-gray-800">{doc.name}</td>
                <td className="py-3 px-4 border-b border-gray-200 text-gray-800">{doc.category}</td>
                <td className="py-3 px-4 border-b border-gray-200 text-gray-800">{doc.date}</td>
                <td className="py-3 px-4 border-b border-gray-200 text-gray-800">{doc.size} KB</td>
              </tr>
            ))}
          </tbody>
        </table>
        {documents.length === 0 && (
          <p className="text-center py-8 text-gray-500">No hay documentos para mostrar.</p>
        )}
      </div>
    </div>
  );
};

export default DocumentTable;