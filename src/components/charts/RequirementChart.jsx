import {
  Chart as ChartJS, CategoryScale, LinearScale, BarElement, Tooltip as ChartTooltip, Legend,
} from 'chart.js';
import { Bar } from 'react-chartjs-2';
import PropTypes from 'prop-types';

ChartJS.register(CategoryScale, LinearScale, BarElement, ChartTooltip, Legend);

export default function RequirementChart({ functional = 0, technical = 0, nonFunctional = 0 }) {
  const data = {
    labels: ['Functional', 'Technical', 'Non-Functional'],
    datasets: [
      {
        label: 'Requirements',
        data: [functional, technical, nonFunctional],
        backgroundColor: ['#2563eb', '#f97316', '#22c55e'],
        borderRadius: 6,
        barThickness: 32,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.raw} requirements`,
        },
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          precision: 0,
        },
        grid: {
          color: 'rgba(0,0,0,0.05)',
        },
      },
      x: {
        grid: {
          display: false,
        },
      },
    },
  };

  return <Bar data={data} options={options} />;
}

RequirementChart.propTypes = {
  functional: PropTypes.number,
  technical: PropTypes.number,
  nonFunctional: PropTypes.number,
};
