import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

ChartJS.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
);

const VentasPorMes = () => {
    const [data, setData] = useState({
        labels: [],
        datasets: [
            {
                label: 'Total Ventas por Mes',
                data: [],
                backgroundColor: 'rgba(75, 192, 192, 0.2)',
                borderColor: 'rgba(75, 192, 192, 1)',
                borderWidth: 1
            }
        ]
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/ventaspormes'); 
                const result = await response.json();

                const labels = result.map(item => `${item.año}-${item.mes.toString().padStart(2, '0')}`);
                const data = result.map(item => item.totalVentas);

                setData({
                    labels,
                    datasets: [
                        {
                            label: 'Total Ventas por Mes',
                            data,
                            backgroundColor: 'rgba(75, 192, 192, 0.2)',
                            borderColor: 'rgba(75, 192, 192, 1)',
                            borderWidth: 1
                        }
                    ]
                });
            } catch (error) {
                console.error("Error al obtener los datos de ventas:", error);
            }
        };

        fetchData();
    }, []);

    const config = {
        type: 'bar',
        data: data,
        options: {
            scales: {
                x: {
                    title: {
                        display: true,
                        text: 'Mes'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Total Ventas'
                    }
                }
            }
        }
    };

    return (
        <div style={{ width: '100%', height: '300px', maxWidth: '400px', margin: '0 auto' }}>
            <Bar data={data} options={{ 
                responsive: true, 
                maintainAspectRatio: true, // Cambiar a true para mantener proporciones 
                plugins: { 
                    legend: { position: 'top' }, 
                    tooltip: { callbacks: { label: (context) => `Total: ${context.raw}` } } 
                }, 
                scales: { 
                    x: { beginAtZero: true }, 
                    y: { 
                        beginAtZero: true, 
                        ticks: { precision: 0, stepSize: 1 } 
                    } 
                } 
            }} />
        </div>
    );
};

export default VentasPorMes;
