import React, { useEffect, useState } from 'react';
import { Pie } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement } from 'chart.js';

ChartJS.register(Title, Tooltip, Legend, ArcElement);

const PieChart = () => {
  const [data, setData] = useState({
    estado1: 0,
    estado2: 0,
    estado3: 0,
  });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/contarestadosAgenda'); 
        const result = await response.json();
        setData(result);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
      }
    };

    fetchData();
  }, []);

  const chartData = {
    labels: ['En proceso', 'Cancelado', 'Terminado'],
    datasets: [
      {
        label: 'Cantidad de Registros',
        data: [data.estado1, data.estado2, data.estado3],
        backgroundColor: ['#36A2EB','#FF6384', '#FFCE56'],
        borderColor: '#fff',
        borderWidth: 1,
      },
    ],
  };

  return (
    <div style={{ width: '100%', height: '300px', maxWidth: '400px', margin: '0 auto' }}>
      <Pie data={chartData} />
    </div>
  );
};

export default PieChart;
