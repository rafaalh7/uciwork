// App.jsx
import DynamicTable from './components/DynamicTable';
import AddDocumentForm from './components/AddDocumentForm';

function App() {
  return (
    <div className="min-h-screen bg-gray-100 py-8">
      <div className="container mx-auto px-4 max-w-6xl">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800 mb-2">
            Sistema de Gestión de Documentos
          </h1>
          <p className="text-gray-600">
            Gestione los estados de sus documentos en tiempo real
          </p>
        </div>

        {/* Formulario para agregar documentos */}
        <AddDocumentForm />

        {/* Tabla dinámica */}
        <DynamicTable />

        {/* Leyenda de estados */}
        <div className="mt-8 p-4 bg-white rounded-lg shadow-md">
          <h3 className="text-lg font-semibold text-gray-800 mb-3">Leyenda de Estados</h3>
          <div className="flex flex-wrap gap-4">
            {Object.entries(ALLOWED_STATUSES).map(([key, status]) => (
              <div key={key} className="flex items-center gap-2">
                <div className={`w-3 h-3 rounded-full ${
                  status === ALLOWED_STATUSES.PENDING ? 'bg-yellow-400' :
                  status === ALLOWED_STATUSES.APPROVED ? 'bg-green-400' :
                  status === ALLOWED_STATUSES.REJECTED ? 'bg-red-400' :
                  'bg-blue-400'
                }`} />
                <span className="text-sm text-gray-600">{status}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default App;