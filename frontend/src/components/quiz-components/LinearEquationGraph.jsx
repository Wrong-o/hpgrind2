import React from 'react';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

/**
 * Component for displaying linear equation graphs
 * This is a compatibility wrapper around Chart.js
 */
const LinearEquationGraph = ({ k, m, equation, x, y, min = -10, max = 10, title = "Linear Equation" }) => {
  // Ensure k and m are valid numbers
  const kValue = isNaN(k) ? 1 : k;
  const mValue = isNaN(m) ? 0 : m;
  
  // Generate points for the line y = kx + m
  const xValues = Array.from({ length: 21 }, (_, i) => min + (i * (max - min) / 20));
  const yValues = xValues.map(x => kValue * x + mValue);
  
  // Format the equation as a label for the chart
  const equationLabel = `y = ${kValue}x ${mValue >= 0 ? '+ ' + mValue : '- ' + Math.abs(mValue)}`;
  
  // Determine point marker for solution (x,y)
  const pointData = [];
  if (x !== undefined && y !== undefined && !isNaN(x) && !isNaN(y)) {
    pointData.push({
      x,
      y
    });
  }
  
  const data = {
    labels: xValues,
    datasets: [
      {
        label: equationLabel,
        data: xValues.map((x_val, i) => ({ x: x_val, y: yValues[i] })),
        borderColor: 'rgba(75, 192, 192, 1)',
        backgroundColor: 'rgba(75, 192, 192, 0.2)',
        borderWidth: 2,
        tension: 0,
        fill: false,
      },
      {
        label: 'Solution Point',
        data: pointData,
        borderColor: 'rgba(255, 99, 132, 1)',
        backgroundColor: 'rgba(255, 99, 132, 1)',
        pointRadius: 8,
        pointHoverRadius: 10,
        showLine: false,
      }
    ]
  };
  
  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      title: {
        display: true,
        text: title,
        font: {
          size: 16
        }
      },
      legend: {
        position: 'top',
      },
      tooltip: {
        callbacks: {
          label: function(context) {
            const datasetLabel = context.dataset.label || '';
            const value = context.parsed.y;
            return datasetLabel + ': (' + context.parsed.x + ', ' + value + ')';
          }
        }
      }
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'x',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        suggestedMin: min,
        suggestedMax: max,
      },
      y: {
        title: {
          display: true,
          text: 'y',
        },
        grid: {
          color: 'rgba(0, 0, 0, 0.1)',
        },
        suggestedMin: Math.min(...yValues, y || 0) - 2,
        suggestedMax: Math.max(...yValues, y || 0) + 2,
      },
    },
  };

  return (
    <div className="w-full h-full">
      <Line data={data} options={options} />
    </div>
  );
};

export default LinearEquationGraph; 