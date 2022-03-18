/* eslint-disable react/prop-types */
/* eslint-disable quotes */
import React from 'react';
import { Doughnut } from 'react-chartjs-2';
import { chartColors } from './colors';

const Donut = ({ dataFetched }) => {
  const options = {
    legend: {
      display: false,
      position: 'right'
    },
    elements: {
      arc: {
        borderWidth: 0
      }
    }
  };

  const data = {
    maintainAspectRatio: false,
    responsive: true,
    labels: ['Completados', 'Revisión', 'Faltantes'],
    datasets: [
      {
        data: dataFetched,
        backgroundColor: chartColors,
        hoverBackgroundColor: chartColors
      }
    ]
  };

  return <Doughnut data={data} options={options} />;
};

export default Donut;
