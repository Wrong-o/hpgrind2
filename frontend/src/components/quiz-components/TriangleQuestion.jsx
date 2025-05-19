import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import 'katex/dist/katex.min.css';
import { InlineMath, BlockMath } from 'react-katex';

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
    minHeight: '60px',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  canvasContainer: {
    height: '320px',
    width: '100%',
    border: '1px solid rgba(0, 0, 0, 0.1)',
    borderRadius: '8px',
    backgroundColor: 'white',
    padding: '8px',
    boxShadow: 'inset 0 1px 3px rgba(0, 0, 0, 0.05)',
    position: 'relative',
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
  mathJaxWrapper: {
    width: '100%',
    overflowWrap: 'break-word',
    wordWrap: 'break-word',
    padding: '0.25rem',
  }
};

// Function to process LaTeX content
const processLatex = (text) => {
  if (!text || typeof text !== 'string') return text;

  // Check if the text contains LaTeX expressions
  const hasLaTeX = /\\[a-zA-Z]|[\$\\{\\}]/.test(text);
  
  if (hasLaTeX) {
    // If it's a full LaTeX expression (block math)
    if (text.startsWith('\\text') || text.startsWith('\\frac') || text.startsWith('\\sqrt')) {
      try {
        return <BlockMath math={text} />;
      } catch (error) {
        console.error('Error rendering LaTeX:', error);
        return text;
      }
    }
    
    // Handle mixed content with LaTeX expressions
    // We'll use a simple approach here - you might want a more sophisticated parser in production
    const parts = text.split(/(\$.*?\$)/g);
    return (
      <>
        {parts.map((part, index) => {
          if (part.startsWith('$') && part.endsWith('$')) {
            try {
              // Extract the LaTeX expression between $ signs
              const latex = part.substring(1, part.length - 1);
              return <InlineMath key={index} math={latex} />;
            } catch (error) {
              console.error('Error rendering LaTeX:', error);
              return part;
            }
          }
          return part;
        })}
      </>
    );
  }
  
  return text;
};

const TriangleQuestion = ({ questionText, triangleData }) => {
  const canvasRef = useRef(null);
  const [canvasWidth, setCanvasWidth] = useState(300);
  const [canvasHeight, setCanvasHeight] = useState(300);
  const [triangleInfo, setTriangleInfo] = useState({
    sides: [0, 0, 0],
    angles: [0, 0, 0],
    type: 'Unknown',
    // Store vertex to angle mapping
    vertexAngles: {}
  });

  // Calculate distance between two points
  const calculateDistance = (point1, point2) => {
    const dx = point2[0] - point1[0];
    const dy = point2[1] - point1[1];
    return Math.sqrt(dx * dx + dy * dy);
  };
  
  // Calculate angle between three points (in degrees)
  const calculateAngle = (p1, p2, p3) => {
    const a = calculateDistance(p2, p3);
    const b = calculateDistance(p1, p3);
    const c = calculateDistance(p1, p2);
    
    // Law of cosines: cos(angle) = (b² + c² - a²) / (2bc)
    const cosAngle = (b * b + c * c - a * a) / (2 * b * c);
    
    // Handle numerical precision issues
    const clampedCosAngle = Math.max(-1, Math.min(1, cosAngle));
    
    // Convert to degrees and round to the nearest integer
    return Math.round(Math.acos(clampedCosAngle) * (180 / Math.PI));
  };
  
  // Check for right angle using the Pythagorean theorem
  const isRightAngle = (sides, tolerance = 0.01) => {
    // Sort sides to put hypotenuse last (largest side)
    const sortedSides = [...sides].sort((a, b) => a - b);
    
    // Check if a² + b² = c² (Pythagorean theorem)
    const a2b2 = Math.pow(sortedSides[0], 2) + Math.pow(sortedSides[1], 2);
    const c2 = Math.pow(sortedSides[2], 2);
    
    // Return true if the difference is within tolerance
    return Math.abs(a2b2 - c2) / c2 < tolerance;
  };
  
  // Determine triangle type based on sides and angles
  const determineTriangleType = (sides, angles) => {
    // Check if it's a right-angled triangle first using the Pythagorean theorem
    if (isRightAngle(sides)) {
      return 'right-angled';
    }
    
    // Check if it's equilateral (all sides equal)
    const isEquilateral = sides.every(side => 
      Math.abs(side - sides[0]) < 0.01
    );
    
    if (isEquilateral) return 'equilateral';
    
    // Check if it's isosceles (at least two sides equal)
    const isIsosceles = (
      Math.abs(sides[0] - sides[1]) < 0.01 ||
      Math.abs(sides[1] - sides[2]) < 0.01 ||
      Math.abs(sides[0] - sides[2]) < 0.01
    );
    
    if (isIsosceles) return 'isosceles';
    
    return 'scalene';
  };
  
  // Scale points to fit canvas
  const scalePointsToCanvas = (points, padding = 40) => {
    // Find min and max values
    let minX = Infinity, minY = Infinity;
    let maxX = -Infinity, maxY = -Infinity;
    
    points.forEach(point => {
      minX = Math.min(minX, point[0]);
      minY = Math.min(minY, point[1]);
      maxX = Math.max(maxX, point[0]);
      maxY = Math.max(maxY, point[1]);
    });
    
    // Adjust to maintain aspect ratio
    const dataWidth = maxX - minX || 1;
    const dataHeight = maxY - minY || 1;
    
    const scaleX = (canvasWidth - padding * 2) / dataWidth;
    const scaleY = (canvasHeight - padding * 2) / dataHeight;
    
    // Use the smaller scale to maintain aspect ratio
    const scale = Math.min(scaleX, scaleY);
    
    // Center the triangle
    const centerX = (canvasWidth - dataWidth * scale) / 2;
    const centerY = (canvasHeight - dataHeight * scale) / 2;
    
    return points.map(point => [
      (point[0] - minX) * scale + padding,
      // Flip Y because canvas Y increases downward
      canvasHeight - ((point[1] - minY) * scale + padding)
    ]);
  };
  
  // Draw a triangle on the canvas
  const drawTriangle = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // Ensure we have three points
    if (!triangleData.points || triangleData.points.length !== 3) {
      console.error('Triangle needs exactly 3 points');
      return;
    }
    
    // Scale the points to fit the canvas
    const scaledPoints = scalePointsToCanvas(triangleData.points);
    
    // Draw the triangle
    ctx.beginPath();
    ctx.moveTo(scaledPoints[0][0], scaledPoints[0][1]);
    ctx.lineTo(scaledPoints[1][0], scaledPoints[1][1]);
    ctx.lineTo(scaledPoints[2][0], scaledPoints[2][1]);
    ctx.closePath();
    
    // Fill with a light color
    ctx.fillStyle = 'rgba(200, 230, 255, 0.5)';
    ctx.fill();
    
    // Draw border
    ctx.strokeStyle = '#3366cc';
    ctx.lineWidth = 2;
    ctx.stroke();
    
    // Calculate sides
    const sides = [
      calculateDistance(triangleData.points[1], triangleData.points[2]),
      calculateDistance(triangleData.points[0], triangleData.points[2]),
      calculateDistance(triangleData.points[0], triangleData.points[1])
    ];
    
    // Determine triangle type
    const type = triangleData.type || determineTriangleType(sides, []);
    
    // Get vertex labels
    const vertexLabels = {
      0: triangleData.labels ? triangleData.labels.point0 : 'A',
      1: triangleData.labels ? triangleData.labels.point1 : 'B',
      2: triangleData.labels ? triangleData.labels.point2 : 'C'
    };
    
    // Get angles - use angles from backend if available, otherwise calculate them
    let angles;
    // Map from vertex index to angle value
    let vertexAngles = {};
    
    if (triangleData.angles) {
      // Use the angles provided by the backend
      console.log("Using angles from backend:", triangleData.angles);
      
      // In the triangle_sum_of_angles function, angles array is [angle_A, angle_B, angle_C]
      // and these correspond directly to the vertices labeled A, B, C
      
      // Create a mapping from vertex labels to angles
      // In the backend, angle_A corresponds to vertex A (index 0)
      vertexAngles[0] = triangleData.angles[0]; // Angle at vertex A
      vertexAngles[1] = triangleData.angles[1]; // Angle at vertex B
      vertexAngles[2] = triangleData.angles[2]; // Angle at vertex C
      
      console.log("Vertex angles mapping:", vertexAngles);
      
      // Set angles array to match the order of vertices in the drawing
      angles = [
        vertexAngles[0],  // Angle at vertex A
        vertexAngles[1],  // Angle at vertex B
        vertexAngles[2]   // Angle at vertex C
      ];
    } else {
      // Calculate angles from coordinates
      console.log("Calculating angles in frontend");
      angles = [
        calculateAngle(triangleData.points[1], triangleData.points[0], triangleData.points[2]),
        calculateAngle(triangleData.points[0], triangleData.points[1], triangleData.points[2]),
        calculateAngle(triangleData.points[0], triangleData.points[2], triangleData.points[1])
      ];
      
      // Store the calculated angles in the vertexAngles map
      vertexAngles[0] = angles[0];
      vertexAngles[1] = angles[1];
      vertexAngles[2] = angles[2];
      
      // Special handling for right-angled triangles and normalization
      if (type === 'right-angled') {
        // Find which angle is closest to 90 degrees
        let rightAngleIndex = 0;
        let minDiff = Math.abs(angles[0] - 90);
        
        for (let i = 1; i < 3; i++) {
          const diff = Math.abs(angles[i] - 90);
          if (diff < minDiff) {
            minDiff = diff;
            rightAngleIndex = i;
          }
        }
        
        // Set the right angle to exactly 90 degrees
        angles[rightAngleIndex] = 90;
        
        // Calculate the other two angles to ensure they sum to 90
        const remainingSum = angles[(rightAngleIndex + 1) % 3] + angles[(rightAngleIndex + 2) % 3];
        const scaleFactor = 90 / remainingSum;
        
        angles[(rightAngleIndex + 1) % 3] = Math.round(angles[(rightAngleIndex + 1) % 3] * scaleFactor);
        angles[(rightAngleIndex + 2) % 3] = 90 - angles[(rightAngleIndex + 1) % 3];
      } else {
        // For non-right triangles, normalize angles to sum to 180 degrees
        const angleSum = angles.reduce((sum, angle) => sum + angle, 0);
        if (Math.abs(angleSum - 180) > 0.1) {
          // Scale all angles proportionally to sum to 180
          const scaleFactor = 180 / angleSum;
          for (let i = 0; i < 3; i++) {
            angles[i] = Math.round(angles[i] * scaleFactor);
          }
          
          // Ensure exactly 180 by adjusting the largest angle if needed
          const correctedSum = angles.reduce((sum, angle) => sum + angle, 0);
          if (correctedSum !== 180) {
            const largestAngleIndex = angles.indexOf(Math.max(...angles));
            angles[largestAngleIndex] += (180 - correctedSum);
          }
        }
      }
    }
    
    // Verify angles sum to 180 degrees
    const sumOfAngles = angles.reduce((sum, angle) => sum + angle, 0);
    console.log("Sum of angles:", sumOfAngles, "Should be 180");
    console.log("Final angles:", angles);
    console.log("Vertex to angle mapping:", vertexAngles);
    
    // Update triangle info state with the vertex angle mapping
    setTriangleInfo({
      sides: sides.map(s => Number(s.toFixed(2))),
      angles: angles.map(a => Number(a.toFixed(0))),
      type,
      vertexAngles
    });
    
    // Draw points
    scaledPoints.forEach((point, index) => {
      // Draw point
      ctx.beginPath();
      ctx.arc(point[0], point[1], 5, 0, Math.PI * 2);
      ctx.fillStyle = '#3366cc';
      ctx.fill();
      
      // Draw label
      ctx.font = '16px Arial';
      ctx.fillStyle = '#000';
      
      const label = triangleData.labels ? 
        triangleData.labels[`point${index}`] : 
        String.fromCharCode(65 + index); // Default to A, B, C
      
      // Position label slightly away from the point
      const xOffset = point[0] < canvasWidth / 2 ? -15 : 10;
      const yOffset = point[1] < canvasHeight / 2 ? -10 : 20;
      
      ctx.fillText(label, point[0] + xOffset, point[1] + yOffset);
    });
    
    // Draw side labels
    for (let i = 0; i < 3; i++) {
      const startPoint = scaledPoints[i];
      const endPoint = scaledPoints[(i + 1) % 3];
      
      // Calculate midpoint
      const midX = (startPoint[0] + endPoint[0]) / 2;
      const midY = (startPoint[1] + endPoint[1]) / 2;
      
      // Calculate perpendicular offset for label placement
      const dx = endPoint[0] - startPoint[0];
      const dy = endPoint[1] - startPoint[1];
      const length = Math.sqrt(dx * dx + dy * dy);
      
      // Normalize and rotate 90 degrees for perpendicular
      let perpX = -dy / length * 20;
      let perpY = dx / length * 20;
      
      // Adjust side label for right-angled triangle to avoid overlapping the right angle mark
      if (type === 'right-angled' && (
          (i === 0 && angles[2] === 90) ||
          (i === 1 && angles[0] === 90) ||
          (i === 2 && angles[1] === 90)
      )) {
        perpX = perpX * 1.5;
        perpY = perpY * 1.5;
      }
      
      // Draw label
      ctx.font = '16px Arial';
      ctx.fillStyle = '#000';
      
      const sideLabel = triangleData.labels ? 
        triangleData.labels[`side${i}`] : 
        String.fromCharCode(97 + i); // Default to a, b, c
      
      ctx.fillText(sideLabel, midX + perpX, midY + perpY);
      
      // Draw side length
      ctx.font = '12px Arial';
      ctx.fillStyle = '#666';
      const sideLength = sides[i].toFixed(1);
      ctx.fillText(`${sideLength}`, midX + perpX * 1.5, midY + perpY * 1.5);
    }
    
    // Draw angle markings
    for (let i = 0; i < 3; i++) {
      const vertex = scaledPoints[i];
      const prevPoint = scaledPoints[(i + 2) % 3];
      const nextPoint = scaledPoints[(i + 1) % 3];
      
      // Calculate vectors from vertex to adjacent points
      const v1x = prevPoint[0] - vertex[0];
      const v1y = prevPoint[1] - vertex[1];
      const v2x = nextPoint[0] - vertex[0];
      const v2y = nextPoint[1] - vertex[1];
      
      // Normalize vectors to same length for arc
      const v1Len = Math.sqrt(v1x * v1x + v1y * v1y);
      const v2Len = Math.sqrt(v2x * v2x + v2y * v2y);
      
      const arcRadius = 20;
      const normV1x = v1x / v1Len * arcRadius;
      const normV1y = v1y / v1Len * arcRadius;
      const normV2x = v2x / v2Len * arcRadius;
      const normV2y = v2y / v2Len * arcRadius;
      
      // Calculate angles for arc
      const startAngle = Math.atan2(-normV1y, normV1x);
      const endAngle = Math.atan2(-normV2y, normV2x);
      
      // Draw arc
      ctx.beginPath();
      
      // Angle at this vertex
      const angleAtVertex = vertexAngles[i];
      
      // For right angle, draw a square instead of an arc
      if (angleAtVertex === 90) {
        // Calculate points for small square to represent right angle
        const sqSize = 10;
        const mid1x = v1x / v1Len * sqSize + vertex[0];
        const mid1y = v1y / v1Len * sqSize + vertex[1];
        const mid2x = v2x / v2Len * sqSize + vertex[0];
        const mid2y = v2y / v2Len * sqSize + vertex[1];
        
        // Corner point to form square
        const cornerX = mid1x + mid2x - vertex[0];
        const cornerY = mid1y + mid2y - vertex[1];
        
        ctx.moveTo(mid1x, mid1y);
        ctx.lineTo(cornerX, cornerY);
        ctx.lineTo(mid2x, mid2y);
        
        ctx.strokeStyle = '#ff0000';
      } else {
        ctx.arc(vertex[0], vertex[1], arcRadius, startAngle, endAngle, (startAngle > endAngle));
        ctx.strokeStyle = '#3366cc';
      }
      
      ctx.lineWidth = 1;
      ctx.stroke();
      
      // Draw angle value
      let bisectorAngle = (startAngle + endAngle) / 2;
      if (startAngle > endAngle) {
        bisectorAngle += Math.PI;
      }
      
      // Use the angle from our vertex angle mapping
      const angleDisplay = angleAtVertex;
      const vertexLabel = vertexLabels[i];
      console.log(`Drawing angle at vertex ${vertexLabel}: ${angleDisplay}°`);
      
      const labelRadius = arcRadius * 1.5;
      const labelX = vertex[0] + Math.cos(bisectorAngle) * labelRadius;
      const labelY = vertex[1] - Math.sin(bisectorAngle) * labelRadius;
      
      ctx.font = '12px Arial';
      ctx.fillStyle = '#666';
      ctx.fillText(`${angleDisplay}°`, labelX - 10, labelY + 5);
    }
  };
  
  // Set canvas dimensions on component mount and resize
  useEffect(() => {
    const handleResize = () => {
      if (canvasRef.current) {
        const container = canvasRef.current.parentElement;
        if (container) {
          // Calculate ideal dimensions
          const containerWidth = container.clientWidth - 20; // Padding
          const containerHeight = Math.min(400, containerWidth); // Cap height
          
          setCanvasWidth(containerWidth);
          setCanvasHeight(containerHeight);
          
          // Update canvas attributes
          canvasRef.current.width = containerWidth;
          canvasRef.current.height = containerHeight;
          
          // Redraw after resize
          drawTriangle();
        }
      }
    };
    
    // Initial setup
    handleResize();
    
    // Add resize event listener
    window.addEventListener('resize', handleResize);
    
    // Clean up
    return () => {
      window.removeEventListener('resize', handleResize);
    };
  }, []);
  
  // Redraw triangle when data changes
  useEffect(() => {
    drawTriangle();
  }, [triangleData, canvasWidth, canvasHeight]);

  return (
    <div className="triangle-question-container">
      <div className="question-text mb-4 p-3 bg-gray-50 rounded-md">
        {processLatex(questionText)}
      </div>
      
      <div className="triangle-visualization mb-4">
        <canvas 
          ref={canvasRef} 
          className="w-full border border-gray-200 rounded-md shadow-sm" 
          style={{ maxHeight: '400px' }}
        />
      </div>
      
      <div className="triangle-info p-3 bg-gray-50 rounded-md">
        <h3 className="text-md font-medium mb-2">Triangle Information</h3>
        <div className="grid grid-cols-2 gap-2 text-sm">
          <div>
            <span className="font-semibold">Type:</span> {triangleInfo.type}
          </div>
          <div>
            <span className="font-semibold">Perimeter:</span> {triangleInfo.sides.reduce((sum, side) => sum + side, 0).toFixed(2)} units
          </div>
          <div>
            <span className="font-semibold">Sides:</span> {triangleInfo.sides.map((s, i) => {
              const label = triangleData.labels ? 
                triangleData.labels[`side${i}`] : 
                String.fromCharCode(97 + i); // Default to a, b, c
              return ` ${label}=${s}`;
            }).join(', ')}
          </div>
          <div>
            <span className="font-semibold">Angles:</span> {Object.entries(triangleInfo.vertexAngles).length > 0 ? 
              Object.entries(triangleInfo.vertexAngles).map(([vertexIndex, angle]) => {
                const vertexLabel = triangleData.labels ? 
                  triangleData.labels[`point${vertexIndex}`] : 
                  String.fromCharCode(65 + parseInt(vertexIndex)); // Default to A, B, C
                return ` ${vertexLabel}=${angle}°`;
              }).join(', ') : 
              triangleInfo.angles.map((a, i) => {
                const vertexLabel = triangleData.labels ? 
                  triangleData.labels[`point${i}`] : 
                  String.fromCharCode(65 + i); // Default to A, B, C
                return ` ${vertexLabel}=${a}°`;
              }).join(', ')}
          </div>
        </div>
      </div>
    </div>
  );
};

TriangleQuestion.propTypes = {
  questionText: PropTypes.string.isRequired,
  triangleData: PropTypes.shape({
    points: PropTypes.arrayOf(PropTypes.arrayOf(PropTypes.number)).isRequired,
    labels: PropTypes.shape({
      point0: PropTypes.string,
      point1: PropTypes.string,
      point2: PropTypes.string,
      side0: PropTypes.string,
      side1: PropTypes.string,
      side2: PropTypes.string
    }),
    type: PropTypes.string,
    angles: PropTypes.arrayOf(PropTypes.number),
    missing_angle_vertex: PropTypes.string
  }).isRequired
};

export default TriangleQuestion; 