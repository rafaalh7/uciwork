// App.js o Dashboard.js
import { useEffect } from 'react';
import useStore from './store';
import DocumentTable from './components/DocumentTable';
import StatisticsChart from './components/StatisticsChart';
import { fetchDocuments } from './api/mockApi';

const Dashboard = () => {
  const { documents, setDocuments, stats, calculateStats } = useStore();

  useEffect(() => {
    const loadDocuments = async () => {
      try {
        const data = await fetchDocuments();
        setDocuments(data);
      } catch (error) {
        console.error('Error fetching documents:', error);
      }
    };
    loadDocuments();
  }, [setDocuments]);

  useEffect(() => {
    if (documents.length > 0) {
      calculateStats();
    }
  }, [documents, calculateStats]);

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Dashboard de Documentos</h1>
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Tabla - Ocupa 2 columnas en pantallas grandes */}
        <div className="lg:col-span-2">
          <DocumentTable />
        </div>
        
        {/* Gráfico - Ocupa 1 columna en pantallas grandes */}
        <div className="lg:col-span-1">
          <StatisticsChart />
        </div>
      </div>
    </div>
  );
};

export default Dashboard;