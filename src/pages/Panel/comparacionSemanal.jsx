// src/components/ComparacionSemanal.jsx
import React, { useEffect, useState } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, BarElement, CategoryScale, LinearScale } from 'chart.js';

// Register necessary components of Chart.js
ChartJS.register(
    Title,
    Tooltip,
    Legend,
    BarElement,
    CategoryScale,
    LinearScale
);

const ComparacionSemanal = () => {
    const [data, setData] = useState({
        labels: ['Compras', 'Ventas', 'Ganancia'],
        datasets: [
            {
                label: 'Total Semanal',
                data: [0, 0, 0],
                backgroundColor: [
                    'rgba(75, 192, 192, 0.2)', // Color para compras
                    'rgba(153, 102, 255, 0.2)', // Color para ventas
                    'rgba(255, 159, 64, 0.2)'  // Color para comparación
                ],
                borderColor: [
                    'rgba(75, 192, 192, 1)',
                    'rgba(153, 102, 255, 1)',
                    'rgba(255, 159, 64, 1)'
                ],
                borderWidth: 1
            }
        ]
    });

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await fetch('http://localhost:5000/api/comprararsemanaCV'); 
                const result = await response.json();

                setData({
                    labels: ['Compras', 'Ventas', 'Ganancia'],
                    datasets: [
                        {
                            label: 'Total Semanal',
                            data: [result.sumaCompras, result.sumaVentas, result.comparacion],
                            backgroundColor: [
                                'rgba(75, 192, 192, 0.2)',
                                'rgba(153, 102, 255, 0.2)',
                                'rgba(255, 159, 64, 0.2)'
                            ],
                            borderColor: [
                                'rgba(75, 192, 192, 1)',
                                'rgba(153, 102, 255, 1)',
                                'rgba(255, 159, 64, 1)'
                            ],
                            borderWidth: 1
                        }
                    ]
                });
            } catch (error) {
                console.error("Error al obtener los datos de comparación semanal:", error);
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
                        text: 'Semanal'
                    }
                },
                y: {
                    beginAtZero: true,
                    title: {
                        display: true,
                        text: 'Total'
                    }
                }
            }
        }
    };

    return (
        <div style={{ width: '100%', height: '300px', maxWidth: '400px', margin: '0 auto' }}>
            <Bar data={data} options={config.options} />
        </div>
    );
};

export default ComparacionSemanal;
