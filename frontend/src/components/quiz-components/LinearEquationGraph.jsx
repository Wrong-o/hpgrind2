import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
} from 'chart.js';
import 'katex/dist/katex.min.css';
import { BlockMath } from 'react-katex';

// Register required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

function SimpleLinearEquation({ k = 1, m = 0, question = 'y = x' }) {
  // Generate points for the line
  const generateLineData = () => {
    // Using a smaller range (-5 to 5)
    const xValues = Array.from({ length: 11 }, (_, i) => i - 5);
    const yValues = xValues.map(x => k * x + m);
    
    return {
      labels: xValues,
      datasets: [
        // Background grid lines
        {
          label: 'Grid',
          data: Array.from({ length: 121 }, (_, i) => {
            const x = Math.floor(i / 11) - 5;
            const y = (i % 11) - 5;
            return { x, y };
          }),
          showLine: false,
          pointRadius: 1,
          pointBackgroundColor: 'rgba(200, 200, 200, 0.3)',
          pointBorderColor: 'transparent',
        },
        // The main line: y = kx + m
        {
          label: `y = ${k}x ${m >= 0 ? '+ ' + m : '- ' + Math.abs(m)}`,
          data: yValues.map((y, i) => ({ x: xValues[i], y })),
          fill: false,
          backgroundColor: 'rgba(75, 192, 192, 0.4)',
          borderColor: 'rgba(75, 192, 192, 1)',
          borderWidth: 2,
          tension: 0.1,
          pointRadius: 3,
        }
      ]
    };
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    scales: {
      x: {
        type: 'linear',
        position: 'center',
        min: -5,
        max: 5,
        title: {
          display: true,
          text: 'x',
          font: { weight: 'bold' }
        },
        grid: {
          color: function(context) {
            return context.tick.value === 0 ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.1)';
          },
          lineWidth: function(context) {
            return context.tick.value === 0 ? 2 : 1;
          }
        },
        ticks: { stepSize: 1 }
      },
      y: {
        type: 'linear',
        position: 'center',
        min: -5,
        max: 5,
        title: {
          display: true,
          text: 'y',
          font: { weight: 'bold' }
        },
        grid: {
          color: function(context) {
            return context.tick.value === 0 ? 'rgba(0, 0, 0, 0.5)' : 'rgba(0, 0, 0, 0.1)';
          },
          lineWidth: function(context) {
            return context.tick.value === 0 ? 2 : 1;
          }
        },
        ticks: { stepSize: 1 }
      }
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          filter: function(item) {
            // Hide grid from legend
            return item.text !== 'Grid';
          }
        }
      }
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-4">
      {/* Question/Equation Display */}
      <div className="p-3 mb-4 bg-gray-50 rounded-md text-center">
        <BlockMath math={question} />
      </div>
      
      {/* Graph */}
      <div className="h-80 w-full border border-gray-200 rounded-md p-2">
        <Line data={generateLineData()} options={options} />
      </div>
      
      {/* Simple explanation */}
      <div className="mt-3 text-sm text-gray-600 p-2 bg-blue-50 rounded-md">
        <p>• Grafen visar linjen {`y = ${k}x ${m >= 0 ? '+ ' + m : '- ' + Math.abs(m)}`}</p>
        <p>• Koordinatsystemet har x- och y-värden från -5 till 5</p>
      </div>
    </div>
  );
}

// Example usage for a Question component
function LinearEquationQuestion({ equation }) {
  // Parse equation parameters (basic parsing)
  const parseEquation = (eq) => {
    // Default values
    let k = 1;
    let m = 0;
    let question = eq;
    
    // Simple regex to extract k and m from "y = kx + m" format
    const match = eq.match(/y\s*=\s*(-?\d*\.?\d*)x\s*([+-])\s*(\d*\.?\d*)/);
    if (match) {
      const kStr = match[1];
      k = kStr === '-' ? -1 : kStr === '' ? 1 : parseFloat(kStr);
      const sign = match[2];
      const mStr = match[3];
      m = parseFloat(mStr);
      if (sign === '-') m = -m;
    }
    
    return { k, m, question };
  };
  
  const { k, m, question } = parseEquation(equation);
  
  return (
    <div className="max-w-lg mx-auto my-8">
      <h2 className="text-xl font-semibold mb-4">Linjär ekvation</h2>
      <SimpleLinearEquation k={k} m={m} question={question} />
    </div>
  );
}

export default LinearEquationQuestion;
