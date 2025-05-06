import React, { useState, useEffect } from 'react';
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
import annotationPlugin from 'chartjs-plugin-annotation';
import 'chart.js/auto';
import MathJax from 'react-mathjax';

// Register the required Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  annotationPlugin
);

// Custom style for the component
const styles = {
  container: {
    background: 'linear-gradient(to bottom, #fafafa, #f5f5f5)',
    borderRadius: '12px',
    padding: '1.25rem',
    boxShadow: '0 4px 6px rgba(0, 0, 0, 0.05), 0 1px 3px rgba(0, 0, 0, 0.1)',
  },
  formulaContainer: {
    marginBottom: '1rem',
    padding: '0.5rem',
    backgroundColor: 'white',
    borderRadius: '8px',
    border: '1px solid rgba(0, 0, 0, 0.06)',
    textAlign: 'center',
    minHeight: '60px', // Minimum height for typical cases
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  chartContainer: {
    height: '320px',
    width: '100%',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    backgroundColor: 'white',
    padding: '8px',
    boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.05)',
  },
  explanation: {
    marginTop: '0.75rem',
    padding: '0.5rem',
    backgroundColor: 'rgba(75, 192, 192, 0.1)',
    borderRadius: '6px',
    fontSize: '0.875rem',
    color: '#4a5568',
    boxShadow: 'inset 0 1px 2px rgba(0, 0, 0, 0.05)',
  },
  explanationTitle: {
    fontWeight: 'bold',
    marginBottom: '0.25rem',
    color: '#2d3748',
  },
  explanationText: {
    margin: '0.25rem 0',
  },
  mathJaxWrapper: {
    width: '100%',
    overflowWrap: 'break-word',
    wordWrap: 'break-word',
    padding: '0.25rem',
  }
};

const LinearEquationQuestion = ({ latexString, momentType, graphData }) => {
  const [lineData, setLineData] = useState(null);
  
  // Function to detect if text is actually LaTeX content
  const isLaTeXContent = (str) => {
    if (!str || typeof str !== 'string') return false;
    
    // Patterns that suggest the content is LaTeX
    const latexPatterns = [
      /\\\(.*\\\)/,     // Inline math \( ... \)
      /\\\[.*\\\]/,     // Display math \[ ... \]
      /\$\$.*\$\$/,     // Display math $$ ... $$
      /\$.*\$/,         // Inline math $ ... $
      /\\begin\{.*\}/,  // Environment \begin{...}
      /\\end\{.*\}/,    // Environment \end{...}
      /\\frac\{.*\}/,   // Fraction \frac{...}
      /\\sqrt\{.*\}/,   // Square root \sqrt{...}
      /\\text\{.*\}/,   // Text \text{...}
      /\\sum/,          // Sum symbol
      /\\int/,          // Integral
      /\\alpha|\\beta|\\gamma|\\delta|\\epsilon|\\zeta|\\eta|\\theta|\\iota|\\kappa|\\lambda|\\mu|\\nu|\\xi|\\omicron|\\pi|\\rho|\\sigma|\\tau|\\upsilon|\\phi|\\chi|\\psi|\\omega/, // Greek letters
      /\\left|\\right/, // Delimiters
      /\\times|\\div|\\cdot|\\pm/, // Operators
    ];
    
    // Common math expressions that should be treated as LaTeX
    if (str.match(/\d+\s*[-+/*]\s*\d+/)) return true; // Simple arithmetic
    if (str.match(/\^2/)) return true; // Exponents
    if (str.match(/\(x\)/)) return true; // Function notation
    
    // Check if any LaTeX pattern is found in the string
    return latexPatterns.some(pattern => pattern.test(str));
  };
  
  // Process formula text to improve wrapping for long equations
  const processFormulaText = (text) => {
    if (!text || typeof text !== 'string') return text;
    
    // Don't process if already contains LaTeX line breaks
    if (text.includes('\\\\') || text.includes('\\newline')) return text;
    
    // For long formulas without natural breaks, add potential breaking points
    if (text.length > 40) {
      // Add space around operators to allow wrapping
      return text.replace(/([^\\])([\+\-\=])/g, '$1 $2 ');
    }
    
    return text;
  };
  
  // Process regular text to improve wrapping for non-LaTeX content
  const processPlainText = (str) => {
    if (!str || typeof str !== 'string') return str;
    
    // Don't process if very short
    if (str.length < 30) return str;
    
    // Add zero-width spaces after common word boundaries to help with breaking very long strings
    return str
      // Add potential break points after punctuation
      .replace(/([.,;:!?])/g, '$1\u200B')
      // Add breaks after long sequences of letters
      .replace(/([a-zA-Z]{6})/g, '$1\u200B');
  };
  
  useEffect(() => {
    console.log('LinearEquation received:', { 
      latexString, 
      momentType, 
      graphData 
    });
    
    // If we already have graph data, use it directly
    if (graphData && graphData.k !== undefined && graphData.m !== undefined) {
      console.log('Using provided graph data:', graphData);
      generateLineData(graphData.k, graphData.m, graphData.x, graphData.y);
      return;
    }

    // Otherwise parse the question text to extract the equation
    console.log('No graph data provided, parsing from text:', latexString);
    
    // Convert to string if it's an object
    const questionText = typeof latexString === 'object' ? latexString.question || '' : latexString;
    
    // Check if this is a find_y question (has format like "if x = ... find y")
    const findYRegex = /if\s*x\s*=\s*(-?\d+).*find\s*y.*y\s*=\s*(-?\d+)x\s*([+-])\s*(\d+)/i;
    const findYMatch = questionText.match(findYRegex);
    
    // Check if this is a find_x question (has format like "2x + 3 = 7")
    // Multiple regex patterns to handle different formats
    const findXRegex = /^(-?\d*)x\s*([+-])\s*(\d+)\s*=\s*(-?\d+)$/;
    const altRegex = /(-?\d*)x\s*([+-])\s*(\d+)\s*=\s*(-?\d+)/;
    const simpleRegex = /(-?\d*)x\s*=\s*(-?\d+)/;

    const findXMatch = questionText.match(findXRegex) || 
                       questionText.match(altRegex) || 
                       questionText.match(simpleRegex);
    
    console.log('Regex matches:', { findYMatch, findXMatch });
    
    // For debugging: try to extract all numbers from the string
    const allNumbers = questionText.match(/-?\d+/g);
    console.log('All numbers in string:', allNumbers);
    
    let k, m, x, y;
    let isFindX = false;
    
    if (findYMatch) {
      // For find_y questions, extract k and m from equation y = kx + m
      const k_str = findYMatch[2] || '1';
      const sign = findYMatch[3] || '+';
      const m_str = findYMatch[4] || '0';
      
      k = k_str === '' ? 1 : parseFloat(k_str);
      m = parseFloat(sign === '+' ? m_str : -m_str);
      x = parseFloat(findYMatch[1]);
      y = k * x + m;
      
      console.log('Parsed find_y equation:', { k, m, x, y });
    } 
    else if (findXMatch) {
      // For find_x questions, convert from kx + m = y to y = kx + m
      // Extract coefficients: k from kx part, m from constant part, y from right side
      let k_str = findXMatch[1] || '1';
      k_str = k_str === '-' ? '-1' : (k_str === '' ? '1' : k_str);
      
      const sign = findXMatch[2] || '+';
      const m_str = findXMatch[3] || '0';
      const y_str = findXMatch[4] || '0';
      
      k = parseFloat(k_str);
      const m_val = parseFloat(m_str);
      m = sign === '+' ? m_val : -m_val;
      y = parseFloat(y_str);
      
      // Calculate x = (y - m) / k
      x = (y - m) / k;
      isFindX = true;
      
      console.log('Parsed find_x equation:', { k, m, x, y });
    } 
    // Last resort: try to extract numbers directly from the string
    else if (allNumbers && allNumbers.length >= 3) {
      console.log('Using direct number extraction as fallback');
      // Assume first number is k, second is m, third is y
      k = parseFloat(allNumbers[0] || 1);
      m = parseFloat(allNumbers[1] || 0);
      y = parseFloat(allNumbers[2] || 0);
      x = (y - m) / k; // Calculate x value
      
      // If this is a find_x question (based on the moment type)
      if (momentType === 'find_x' || momentType === 'linear_find_x') {
        isFindX = true;
      }
      
      console.log('Extracted fallback values:', { k, m, x, y, isFindX });
    }
    else {
      console.error('Could not parse linear equation from:', questionText);
      // Default to simple line if parsing fails
      k = 1;
      m = 0;
      y = 0;
      x = 0;
    }
    
    // If moment type is "find_x" but we haven't parsed it correctly from the text,
    // try to use sensible defaults or check for "=" in the text
    if ((momentType === 'find_x' || momentType === 'linear_find_x') && !findXMatch) {
      console.log('Question is find_x type but regex did not match, using alternate method');
      // This is a workaround when regex fails but we know it's a find_x question
      if (allNumbers && allNumbers.length >= 3) {
        // Try to use the extracted numbers 
        if (!k || isNaN(k)) k = parseFloat(allNumbers[0] || 1);
        if (!m || isNaN(m)) m = parseFloat(allNumbers[1] || 0);
        if (!y || isNaN(y)) y = parseFloat(allNumbers[2] || 0);
        x = (y - m) / k; // Calculate x value
        isFindX = true;
      }
    }
    
    // Generate line data with solution point
    generateLineData(k, m, x, y);
  }, [latexString, momentType, graphData]);

  const generateLineData = (k, m, solutionX, solutionY) => {
    // Ensure k and m are valid numbers
    if (isNaN(k) || isNaN(m)) {
      console.error('Invalid k or m values:', { k, m });
      // Use defaults
      k = 1;
      m = 0;
    }
    
    // Generate points for the line y = kx + m with more points for smoother line
    // Use a larger range to ensure the line extends beyond the visible area
    const xValues = Array.from({ length: 41 }, (_, i) => i - 20); // More points for smoother line
    const yValues = xValues.map(x => k * x + m);
    
    // Create highlighted grid points for better visualization of steps
    const gridPoints = [];
    // Create integer coordinates for clear grid visualization
    for (let x = -10; x <= 10; x++) {
      for (let y = -10; y <= 10; y++) {
        if (Number.isInteger(x) && Number.isInteger(y)) {
          gridPoints.push({ x, y });
        }
      }
    }
    
    // Create step markers that highlight each unit increment
    const stepMarkers = [];
    // Add x-axis steps
    for (let x = -10; x <= 10; x++) {
      if (x !== 0) {  // Skip origin
        stepMarkers.push({ x, y: 0 });
      }
    }
    // Add y-axis steps
    for (let y = -10; y <= 10; y++) {
      if (y !== 0) {  // Skip origin
        stepMarkers.push({ x: 0, y });
      }
    }
    
    // Log the generated data
    console.log('Generated line data with:', { 
      k, m, 
      xPoints: xValues.length, 
      yPoints: yValues.length 
    });
    
    setLineData({
      labels: xValues,
      datasets: [
        // Grid background
        {
          label: 'Grid Points',
          data: gridPoints,
          backgroundColor: 'rgba(200,200,200,0.3)',
          borderColor: 'rgba(200,200,200,0.5)',
          pointRadius: 2,
          pointHoverRadius: 3,
          showLine: false,
          z: -10, // Send to back
        },
        // Step markers on axes
        {
          label: 'Step Markers',
          data: stepMarkers,
          backgroundColor: 'rgba(0,0,0,0.4)',
          borderColor: 'rgba(0,0,0,0.6)',
          pointRadius: 3,
          pointHoverRadius: 4,
          pointStyle: 'rect',
          showLine: false,
          z: -5,
        },
        // The main line: y = kx + m
        {
          label: `y = ${k}x ${m >= 0 ? '+ ' + m : '- ' + Math.abs(m)}`,
          data: yValues.map((y, i) => ({ x: xValues[i], y })),
          fill: false,
          backgroundColor: 'rgba(75,192,192,0.4)',
          borderColor: 'rgba(75,192,192,1)',
          borderWidth: 3,
          tension: 0.1,
          pointRadius: 0, // Hide individual points on the line
          z: 0,
        }
      ]
    });
  };

  // Fixed symmetric bounds centered exactly at the origin
  const axisBounds = { xMin: -10, xMax: 10, yMin: -10, yMax: 10 };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    animation: {
      duration: 1500, // Longer animations
    },
    scales: {
      x: {
        title: {
          display: true,
          text: 'x',
          font: {
            size: 16,
            weight: 'bold'
          },
          color: 'rgba(0, 0, 0, 0.8)'
        },
        grid: {
          color: function(context) {
            // Make origin lines darker
            if (context.tick && context.tick.value === 0) {
              return 'rgba(0, 0, 0, 0.5)'; // Darker line for origin
            }
            // Make integer grid lines darker
            if (context.tick && Number.isInteger(context.tick.value)) {
              return 'rgba(0, 0, 0, 0.15)';
            }
            return 'rgba(0, 0, 0, 0.05)';
          },
          lineWidth: function(context) {
            // Make origin lines thicker
            if (context.tick && context.tick.value === 0) {
              return 3; // Thicker line for origin
            }
            // Make integer grid lines thicker
            if (context.tick && Number.isInteger(context.tick.value)) {
              return 1.5;
            }
            return 0.5;
          },
          z: 1
        },
        border: {
          display: true,
          width: 1,
          color: 'rgba(0, 0, 0, 0.3)'
        },
        ticks: {
          stepSize: 1,
          font: {
            size: 12,
            weight: 'bold'
          },
          callback: function(value) {
            if (value === 0) return 'O'; // Mark origin with 'O'
            return value;
          },
          color: function(context) {
            // Highlight the origin with a different color
            if (context.tick && context.tick.value === 0) {
              return 'rgba(0, 0, 0, 0.9)';
            }
            return 'rgba(0, 0, 0, 0.7)';
          }
        },
        min: axisBounds.xMin,
        max: axisBounds.xMax,
        afterTickToLabelConversion: function(scaleInstance) {
          scaleInstance.ticks.forEach(tick => {
            tick.major = Number.isInteger(tick.value);
          });
        }
      },
      y: {
        title: {
          display: true,
          text: 'y',
          font: {
            size: 16,
            weight: 'bold'
          },
          color: 'rgba(0, 0, 0, 0.8)'
        },
        grid: {
          color: function(context) {
            // Make origin lines darker
            if (context.tick && context.tick.value === 0) {
              return 'rgba(0, 0, 0, 0.5)'; // Darker line for origin
            }
            // Make integer grid lines darker
            if (context.tick && Number.isInteger(context.tick.value)) {
              return 'rgba(0, 0, 0, 0.15)';
            }
            return 'rgba(0, 0, 0, 0.05)';
          },
          lineWidth: function(context) {
            // Make origin lines thicker
            if (context.tick && context.tick.value === 0) {
              return 3; // Thicker line for origin
            }
            // Make integer grid lines thicker
            if (context.tick && Number.isInteger(context.tick.value)) {
              return 1.5;
            }
            return 0.5;
          },
          z: 1
        },
        border: {
          display: true,
          width: 1,
          color: 'rgba(0, 0, 0, 0.3)'
        },
        ticks: {
          stepSize: 1,
          font: {
            size: 12,
            weight: 'bold'
          },
          callback: function(value) {
            if (value === 0) return ''; // Don't show 0 on y-axis since it's at the origin
            return value;
          },
          color: function(context) {
            // Highlight the origin with a different color
            if (context.tick && context.tick.value === 0) {
              return 'rgba(0, 0, 0, 0.9)';
            }
            return 'rgba(0, 0, 0, 0.7)';
          }
        },
        min: axisBounds.yMin,
        max: axisBounds.yMax,
        afterTickToLabelConversion: function(scaleInstance) {
          scaleInstance.ticks.forEach(tick => {
            tick.major = Number.isInteger(tick.value);
          });
        }
      },
    },
    plugins: {
      legend: {
        position: 'top',
        labels: {
          font: {
            size: 14,
            weight: 'bold'
          },
          boxWidth: 15,
          boxHeight: 15,
          padding: 15,
          filter: function(item) {
            // Hide Grid Points and Step Markers from legend
            return !['Grid Points', 'Step Markers'].includes(item.text);
          }
        }
      },
      tooltip: {
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
        titleFont: {
          size: 14,
          weight: 'bold'
        },
        bodyFont: {
          size: 14
        },
        padding: 10,
        cornerRadius: 4,
        callbacks: {
          label: function(context) {
            if (context.dataset.label === 'Grid Points') {
              return `Coordinate: (${context.parsed.x}, ${context.parsed.y})`;
            }
            return `${context.dataset.label}: (${context.parsed.x}, ${context.parsed.y})`;
          }
        }
      },
      // Add annotations for axis lines and origin point only
      annotation: {
        annotations: {
          // X-axis line (enhanced)
          xAxisLine: {
            type: 'line',
            yMin: 0,
            yMax: 0,
            borderColor: 'rgba(0, 0, 0, 0.7)',
            borderWidth: 2
          },
          // Y-axis line (enhanced)
          yAxisLine: {
            type: 'line',
            xMin: 0,
            xMax: 0,
            borderColor: 'rgba(0, 0, 0, 0.7)',
            borderWidth: 2
          },
          // Origin point highlight
          originPoint: {
            type: 'point',
            xValue: 0,
            yValue: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.7)',
            borderColor: 'rgba(0, 0, 0, 0.9)',
            borderWidth: 2,
            radius: 5
          }
        }
      }
    },
  };

  const formulaText = typeof latexString === 'object' ? latexString.question || '' : latexString;
  const shouldRenderAsLaTeX = isLaTeXContent(formulaText);
  const processedFormulaText = shouldRenderAsLaTeX 
    ? processFormulaText(formulaText)
    : processPlainText(formulaText);

  return (
    <div style={styles.container}>
      <div style={{
        ...styles.formulaContainer,
        wordBreak: 'break-word', 
        overflowWrap: 'break-word',
        height: 'auto', // Allow height to adjust to content
      }}>
        <div style={styles.mathJaxWrapper}>
          {shouldRenderAsLaTeX ? (
            <MathJax.Provider>
              <MathJax.Node formula={processedFormulaText} />
            </MathJax.Provider>
          ) : (
            <div className="py-1 px-2 text-md font-medium" style={{
              lineHeight: '1.4',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
              hyphens: 'auto',
              whiteSpace: 'pre-wrap'
            }}>{processedFormulaText}</div>
          )}
        </div>
      </div>
      {lineData && (
        <div style={styles.chartContainer}>
          <Line data={lineData} options={options} />
        </div>
      )}
      <div style={styles.explanation}>
        <div style={styles.explanationTitle}>How to read the graph:</div>
        <p style={styles.explanationText}>• The graph is centered at the origin (0,0), marked with "O"</p>
        <p style={styles.explanationText}>• Each grid point represents an integer coordinate (x, y)</p>
        <p style={styles.explanationText}>• The blue line represents the equation y = {lineData?.datasets[2]?.label.split('=')[1] || 'kx + m'}</p>
        <p style={styles.explanationText}>• The x and y axes are highlighted with darker lines</p>
      </div>
    </div>
  );
};

export default LinearEquationQuestion;