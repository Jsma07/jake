import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';
import axios from 'axios';

ChartJS.register(Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale);

const BarChart = () => {
  const [data, setData] = useState({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/agendamientospormes');
        const agendamientos = response.data;

        const labels = agendamientos.map(item => `${item.año}-${item.mes.toString().padStart(2, '0')}`);
        const values = agendamientos.map(item => item.totalAgendamientos);

        setData({
          labels,
          datasets: [
            {
              label: 'Total Agendamientos',
              data: values,
              backgroundColor: 'rgba(75, 192, 192, 0.2)',
              borderColor: 'rgba(75, 192, 192, 1)',
              borderWidth: 1
            }
          ]
        });
        setLoading(false);
      } catch (error) {
        console.error('Error al obtener los datos:', error);
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  return (
    <div style={{ width: '100%', height: '300px', maxWidth: '400px', margin: '0 auto' }}>
      {loading ? (
        <p>Cargando...</p>
      ) : (
        <Bar
          data={data}
          options={{
            responsive: true,
            maintainAspectRatio: false,
            plugins: {
              legend: {
                position: 'top',
              },
              tooltip: {
                callbacks: {
                  label: (context) => {
                    return `Total: ${context.raw}`;
                  }
                }
              }
            },
            scales: {
              x: {
                beginAtZero: true
              },
              y: {
                beginAtZero: true,
                ticks: {
                  precision: 0,  // Esto asegura que los valores sean enteros
                  stepSize: 1   // Puedes ajustar el stepSize para definir la separación entre los valores en el eje Y
                }
              }
            }
          }}
        />
      )}
    </div>
  );
};

export default BarChart;
