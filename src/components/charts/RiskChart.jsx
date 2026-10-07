import {
  Chart as ChartJS, RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend,
} from 'chart.js';
import { Radar } from 'react-chartjs-2';
import PropTypes from 'prop-types';

ChartJS.register(RadialLinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

export default function RiskChart({
  risk = 0, confidence = 0, complexity = 0,
}) {
  const data = {
    labels: ['Risk', 'Confidence', 'Complexity'],
    datasets: [
      {
        label: 'Scores',
        data: [risk, confidence, complexity],
        backgroundColor: 'rgba(37, 99, 235, 0.15)',
        borderColor: '#2563eb',
        borderWidth: 2,
        pointBackgroundColor: '#2563eb',
        pointBorderColor: '#fff',
        pointBorderWidth: 2,
        pointRadius: 5,
      },
    ],
  };

  const options = {
    responsive: true,
    maintainAspectRatio: true,
    scales: {
      r: {
        beginAtZero: true,
        max: 100,
        ticks: {
          stepSize: 25,
          display: false,
        },
        grid: {
          color: 'rgba(0,0,0,0.06)',
        },
        angleLines: {
          color: 'rgba(0,0,0,0.06)',
        },
        pointLabels: {
          font: {
            size: 12,
          },
        },
      },
    },
    plugins: {
      legend: {
        display: false,
      },
    },
  };

  return <Radar data={data} options={options} />;
}

RiskChart.propTypes = {
  risk: PropTypes.number,
  confidence: PropTypes.number,
  complexity: PropTypes.number,
};
