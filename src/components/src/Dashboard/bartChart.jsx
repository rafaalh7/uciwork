// components/BarChart.js
import React from 'react';
import Chart from 'react-apexcharts';

export const BarChart = ({ data }) => {
  const categories = Object.keys(data);
  const seriesData = Object.values(data);

  const chartOptions = {
    chart: {
      type: 'bar',
      height: 350,
      toolbar: {
        show: false
      }
    },
    plotOptions: {
      bar: {
        borderRadius: 4,
        horizontal: false,
        columnWidth: '55%',
      }
    },
    dataLabels: {
      enabled: false
    },
    xaxis: {
      categories: categories,
    },
    colors: ['#3B82F6', '#10B981', '#8B5CF6', '#F59E0B', '#EF4444'],
    grid: {
      borderColor: '#f1f5f9'
    }
  };

  const chartSeries = [{
    name: 'Documentos',
    data: seriesData
  }];

  return (
    <Chart
      options={chartOptions}
      series={chartSeries}
      type="bar"
      height={350}
    />
  );
};