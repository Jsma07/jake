import React from 'react';
import { Doughnut } from 'react-chartjs-2';

const DoughnutChart = ({ data, options }) => {
    return (
        <div style={{ width: '100%', height: '300px', maxWidth: '400px', margin: '0 auto' }}>
            <Doughnut data={data} options={options} />
        </div>
    );
};

export default DoughnutChart;
