import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import TriangleQuestion from '../components/quiz-components/TriangleQuestion';

const TriangleTest = () => {
  const navigate = useNavigate();
  const [question, setQuestion] = useState("Calculate the hypotenuse of this right-angled triangle.");
  const [triangleConfig, setTriangleConfig] = useState({
    current: 'rightAngled',
    configs: {
      rightAngled: {
        points: [[0, 0], [4, 0], [0, 3]],
        labels: {
          point0: 'A',
          point1: 'B',
          point2: 'C',
          side0: 'c',
          side1: 'a',
          side2: 'b'
        },
        type: 'right-angled'
      },
      equilateral: {
        points: [[0, 0], [1, 0], [0.5, 0.866]],
        labels: {
          point0: 'P',
          point1: 'Q',
          point2: 'R',
          side0: 's',
          side1: 's',
          side2: 's'
        },
        type: 'equilateral'
      },
      isosceles: {
        points: [[0, 0], [2, 0], [1, 1.5]],
        labels: {
          point0: 'X',
          point1: 'Y',
          point2: 'Z',
          side0: 'b',
          side1: 'a',
          side2: 'a'
        },
        type: 'isosceles'
      },
      scalene: {
        points: [[0, 0], [3, 0], [1, 2]],
        labels: {
          point0: 'D',
          point1: 'E',
          point2: 'F',
          side0: 'p',
          side1: 'q',
          side2: 'r'
        },
        type: 'scalene'
      },
      custom: {
        points: [[0, 0], [3, 1], [1, 3]],
        type: 'scalene'
      }
    }
  });

  // Sample questions for different triangle types
  const questions = {
    rightAngled: [
      "Calculate the hypotenuse of this right-angled triangle using the Pythagorean theorem.",
      "If the area of this right-angled triangle is 6 square units, what is the hypotenuse length?",
      "\\text{Using the Pythagorean theorem, find the value of } c \\text{ in this right-angled triangle.}"
    ],
    equilateral: [
      "What is the area of this equilateral triangle with side length s?",
      "Calculate the height of this equilateral triangle.",
      "\\text{If the side length } s = 2 \\text{ units, what is the area of this equilateral triangle?}"
    ],
    isosceles: [
      "Calculate the area of this isosceles triangle.",
      "Find the height of this isosceles triangle from point Z to side XY.",
      "\\text{If } a = 5 \\text{ and } b = 8\\text{, what is the area of this isosceles triangle?}"
    ],
    scalene: [
      "Calculate the area of this scalene triangle using the coordinates of its vertices.",
      "Find the perimeter of this scalene triangle.",
      "\\text{Using Heron's formula, calculate the area of this scalene triangle.}"
    ]
  };

  const handleConfigChange = (e) => {
    const configName = e.target.value;
    setTriangleConfig(prev => ({
      ...prev,
      current: configName
    }));
    
    // Set a relevant question for this triangle type
    if (questions[configName] && questions[configName].length > 0) {
      setQuestion(questions[configName][0]);
    }
  };

  const handleQuestionChange = (e) => {
    const questionIndex = parseInt(e.target.value);
    const configName = triangleConfig.current;
    
    if (questions[configName] && questions[configName][questionIndex]) {
      setQuestion(questions[configName][questionIndex]);
    }
  };

  const handleCustomPointChange = (pointIndex, coordIndex, value) => {
    const newValue = parseFloat(value);
    
    if (isNaN(newValue)) return;
    
    setTriangleConfig(prev => {
      const newConfigs = { ...prev.configs };
      const newPoints = [...newConfigs.custom.points];
      const newPoint = [...newPoints[pointIndex]];
      
      newPoint[coordIndex] = newValue;
      newPoints[pointIndex] = newPoint;
      
      newConfigs.custom = {
        ...newConfigs.custom,
        points: newPoints
      };
      
      return {
        ...prev,
        configs: newConfigs
      };
    });
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold text-gray-800">Triangle Component Test</h1>
          <button
            onClick={() => navigate('/main-menu')}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Main Menu
          </button>
        </div>
        
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Triangle Configuration</h2>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Triangle Type
              </label>
              <select
                value={triangleConfig.current}
                onChange={handleConfigChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                <option value="rightAngled">Right-angled Triangle</option>
                <option value="equilateral">Equilateral Triangle</option>
                <option value="isosceles">Isosceles Triangle</option>
                <option value="scalene">Scalene Triangle</option>
                <option value="custom">Custom Triangle</option>
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question
              </label>
              <select
                onChange={handleQuestionChange}
                className="w-full p-2 border border-gray-300 rounded-md"
              >
                {questions[triangleConfig.current]?.map((q, index) => (
                  <option key={index} value={index}>
                    Question {index + 1}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Question Text
              </label>
              <textarea
                value={question}
                onChange={(e) => setQuestion(e.target.value)}
                className="w-full p-2 border border-gray-300 rounded-md"
                rows={3}
              />
            </div>
            
            {triangleConfig.current === 'custom' && (
              <div className="bg-gray-50 p-4 rounded-md mb-4">
                <h3 className="text-md font-medium mb-3">Custom Points (x, y)</h3>
                <div className="grid grid-cols-3 gap-4">
                  {triangleConfig.configs.custom.points.map((point, pointIndex) => (
                    <div key={pointIndex} className="space-y-2">
                      <label className="block text-sm font-medium text-gray-700">
                        Point {String.fromCharCode(65 + pointIndex)}
                      </label>
                      <div className="flex space-x-2">
                        <input
                          type="number"
                          value={point[0]}
                          onChange={(e) => handleCustomPointChange(pointIndex, 0, e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="x"
                          step={0.5}
                        />
                        <input
                          type="number"
                          value={point[1]}
                          onChange={(e) => handleCustomPointChange(pointIndex, 1, e.target.value)}
                          className="w-full p-2 border border-gray-300 rounded-md"
                          placeholder="y"
                          step={0.5}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-semibold mb-4">Preview</h2>
            <TriangleQuestion
              questionText={question}
              triangleData={triangleConfig.configs[triangleConfig.current]}
            />
          </div>
        </div>
        
        <div className="mt-8 bg-white rounded-lg shadow-md p-6">
          <h2 className="text-xl font-semibold mb-4">Using the Triangle Component</h2>
          <div className="bg-gray-50 p-4 rounded-md text-sm font-mono">
            {`import TriangleQuestion from '../components/quiz-components/TriangleQuestion';
            
// Example usage
<TriangleQuestion
  questionText="Calculate the hypotenuse of this right-angled triangle."
  triangleData={{
    points: [[0, 0], [4, 0], [0, 3]],
    labels: {
      point0: 'A',
      point1: 'B',
      point2: 'C',
      side0: 'c',
      side1: 'a',
      side2: 'b'
    },
    type: 'right-angled'
  }}
/>`}
          </div>
          
          <h3 className="text-lg font-semibold mt-6 mb-2">Props</h3>
          <div className="overflow-x-auto">
            <table className="min-w-full divide-y divide-gray-200">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Prop</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-gray-200">
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">questionText</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                  <td className="px-6 py-4 text-sm text-gray-500">The question text, can include LaTeX expressions</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">triangleData.points</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">array</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Array of three point coordinates as [x, y]</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">triangleData.labels</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">object</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Custom labels for points, sides, and angles</td>
                </tr>
                <tr>
                  <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">triangleData.type</td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">string</td>
                  <td className="px-6 py-4 text-sm text-gray-500">Triangle type (right-angled, equilateral, isosceles, scalene)</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TriangleTest; 