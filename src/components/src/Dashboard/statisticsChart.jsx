// components/StatisticsChart.js
import useStore from '../store';
import { BarChart } from './BarChart';
import { validateChartData } from '../utils/validation';

const StatisticsChart = () => {
  const { stats } = useStore();
  const { categoryCounts } = stats;

  // Validar si hay suficientes datos para graficar
  const validationResult = validateChartData(categoryCounts);

  if (!validationResult.isValid) {
    return (
      <div className="bg-white shadow-md rounded-lg p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Estadísticas por Categoría</h2>
        <div className="bg-yellow-50 border border-yellow-200 rounded-md p-4 text-yellow-800">
          {validationResult.message}
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-4">Estadísticas por Categoría</h2>
      <BarChart data={categoryCounts} />
    </div>
  );
};