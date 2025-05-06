import React from 'react';
import LinearEquationQuestion from './LinearEquationQuestion';

const LinearEquationTest = () => {
  // Sample questions in the format the backend would send
  const testQuestions = [
    // Find x question with graph_data (new format)
    {
      question: "2x + 3 = 7",
      options: [
        { id: 0, latex: "2", isCorrect: true },
        { id: 1, latex: "3", isCorrect: false },
        { id: 2, latex: "4", isCorrect: false },
        { id: 3, latex: "5", isCorrect: false }
      ],
      graph_data: {
        k: 2,  // coefficient of x
        m: 3,  // y-intercept
        x: 2,  // solution x
        y: 7   // y value
      }
    },
    // Find y question with graph_data (new format)
    {
      question: "If x = 3, find y in the equation: -2x + 4 = y",
      options: [
        { id: 0, latex: "-2", isCorrect: true },
        { id: 1, latex: "-1", isCorrect: false },
        { id: 2, latex: "0", isCorrect: false },
        { id: 3, latex: "1", isCorrect: false }
      ],
      graph_data: {
        k: -2,  // coefficient of x
        m: 4,   // y-intercept
        x: 3,   // given x
        y: -2   // solution y: (-2 * 3) + 4 = -6 + 4 = -2
      }
    },
    // Legacy format (without graph_data) - equation will be parsed from question text
    {
      question: "x + 5 = 10",
      options: [
        { id: 0, latex: "3", isCorrect: false },
        { id: 1, latex: "4", isCorrect: false },
        { id: 2, latex: "5", isCorrect: true },
        { id: 3, latex: "6", isCorrect: false }
      ]
    }
  ];

  return (
    <div className="p-6 bg-gray-100">
      <h1 className="text-2xl font-bold mb-6">Linear Equation Visualization Test</h1>
      
      <div className="space-y-12">
        {testQuestions.map((question, index) => (
          <div key={index} className="bg-white rounded-lg p-6 shadow-md">
            <h2 className="text-xl font-semibold mb-4">Example {index + 1}</h2>
            
            <div className="mb-4 p-3 bg-blue-50 rounded-lg border border-blue-100">
              <h3 className="text-lg font-medium mb-2">Question Details:</h3>
              <p><strong>Text:</strong> {question.question}</p>
              <p>
                <strong>Type:</strong> {question.question.includes("find y") ? "Find Y" : "Find X"}
              </p>
              {question.graph_data && (
                <div className="mt-2">
                  <p><strong>Graph Data:</strong></p>
                  <ul className="list-disc pl-5">
                    <li>k (slope): {question.graph_data.k}</li>
                    <li>m (y-intercept): {question.graph_data.m}</li>
                    <li>x: {question.graph_data.x}</li>
                    <li>y: {question.graph_data.y}</li>
                  </ul>
                </div>
              )}
            </div>
            
            <LinearEquationQuestion questionData={question} />
            
            <div className="mt-6">
              <h3 className="font-medium mb-2">Answer Options:</h3>
              <div className="grid grid-cols-2 gap-4">
                {question.options.map(option => (
                  <div 
                    key={option.id}
                    className={`p-3 rounded-lg border ${option.isCorrect ? 'border-green-500 bg-green-50' : 'border-gray-300'}`}
                  >
                    {option.latex} {option.isCorrect && '✓'}
                  </div>
                ))}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default LinearEquationTest; 