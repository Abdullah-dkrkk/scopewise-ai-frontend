import {
  Chart as ChartJS, ArcElement, Tooltip as ChartTooltip, Legend,
} from 'chart.js';
import { Doughnut } from 'react-chartjs-2';
import PropTypes from 'prop-types';

ChartJS.register(ArcElement, ChartTooltip, Legend);

function complexityColor(score) {
  if (score <= 40) return '#22c55e';
  if (score <= 70) return '#f59e0b';
  return '#ef4444';
}

export default function ComplexityChart({ score = 0, label = 'Complexity' }) {
  const color = complexityColor(score);

  const data = {
    labels: [label, ''],
    datasets: [
      {
        data: [score, 100 - score],
        backgroundColor: [color, '#e2e8f0'],
        borderWidth: 0,
        hoverOffset: 0,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    cutout: '75%',
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        enabled: false,
      },
    },
  };

  return (
    <div className="relative flex flex-col items-center">
      <Doughnut data={data} options={options} />
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <span className="font-heading text-3xl font-semibold" style={{ color }}>
          {score}
        </span>
        <span className="text-xs text-muted-foreground">{label}</span>
      </div>
    </div>
  );
}

ComplexityChart.propTypes = {
  score: PropTypes.number,
  label: PropTypes.string,
};
