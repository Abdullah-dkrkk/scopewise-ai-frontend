import {
  Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import PropTypes from 'prop-types';

ChartJS.register(ArcElement, ChartTooltip, Legend);

export default function ScoresChart({ confidence, complexity, risk }) {
  const data = {
    labels: ['Confidence', 'Complexity', 'Risk'],
    datasets: [
      {
        data: [confidence, complexity, risk],
        backgroundColor: ['#2563eb', '#f97316', '#ef4444'],
        borderWidth: 0,
        hoverOffset: 6,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        labels: {
          usePointStyle: true,
          boxWidth: 8,
          padding: 16,
        },
      },
      tooltip: {
        callbacks: {
          label: (ctx) => ` ${ctx.label}: ${ctx.raw}/100`,
        },
      },
    },
  };

  return <Doughnut data={data} options={options} />;
}

ScoresChart.propTypes = {
  confidence: PropTypes.number,
  complexity: PropTypes.number,
  risk: PropTypes.number,
};
