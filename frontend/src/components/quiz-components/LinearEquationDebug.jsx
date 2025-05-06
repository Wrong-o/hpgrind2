import React, { useState, useEffect } from 'react';

/**
 * Special debug component to help diagnose linear equation issues
 * This can be added temporarily to the Quiz.jsx component
 */
const LinearEquationDebug = ({ questions, currentIndex }) => {
  const [isExpanded, setIsExpanded] = useState(false);
  const [logs, setLogs] = useState([]);
  
  // Get the current question
  const currentQuestion = questions[currentIndex];
  
  // Log important data whenever the question changes
  useEffect(() => {
    if (currentQuestion) {
      const newLog = {
        timestamp: new Date().toISOString(),
        questionType: currentQuestion.category,
        hasGraphData: !!currentQuestion.graph_data,
        questionText: currentQuestion.question,
        isDetectedAsLinear: isLinearEquation(currentQuestion)
      };
      
      setLogs(prev => [newLog, ...prev.slice(0, 4)]);
      
      // Also log to console for reference
      console.log("LinearEquationDebug - New question:", newLog);
    }
  }, [currentIndex, currentQuestion]);
  
  // Function to check if a question is detected as a linear equation
  function isLinearEquation(questionObj) {
    if (!questionObj) return false;
    
    // Check for graph_data field first
    if (questionObj.graph_data) return true;
    
    // Check category
    if (questionObj.category === "Linear Equations") return true;
    
    // Check question text
    if (typeof questionObj.question === 'string') {
      const findXRegex = /^-?\d*x\s*[+-]\s*\d+\s*=\s*-?\d+$/;
      const findYRegex = /if\s*x\s*=.*find\s*y/i;
      return findXRegex.test(questionObj.question) || findYRegex.test(questionObj.question);
    }
    
    return false;
  }
  
  // Only render in development mode
  if (process.env.NODE_ENV === 'production') return null;
  
  return (
    <div className="fixed bottom-2 right-2 z-50 bg-yellow-50 border border-yellow-400 rounded shadow-lg p-2 max-w-sm">
      <button 
        onClick={() => setIsExpanded(!isExpanded)}
        className="text-xs font-bold text-yellow-800 flex items-center"
      >
        {isExpanded ? '▼' : '▶'} Linear Equation Debug {isExpanded ? '(Click to hide)' : '(Click to show)'}
      </button>
      
      {isExpanded && (
        <div className="mt-2 text-xs">
          <h3 className="font-bold">Current Question ({currentIndex + 1}/{questions.length}):</h3>
          <div className="mt-1 p-1 bg-white rounded">
            <p><strong>Category:</strong> {currentQuestion?.category || 'Unknown'}</p>
            <p><strong>Has graph_data:</strong> {currentQuestion?.graph_data ? 'Yes' : 'No'}</p>
            <p><strong>Detected as linear:</strong> {isLinearEquation(currentQuestion) ? 'Yes' : 'No'}</p>
            <p className="truncate"><strong>Question:</strong> {currentQuestion?.question || 'None'}</p>
            
            {currentQuestion?.graph_data && (
              <div>
                <p><strong>Graph data:</strong></p>
                <pre className="text-xs bg-gray-100 p-1 overflow-auto max-h-20">
                  {JSON.stringify(currentQuestion.graph_data, null, 2)}
                </pre>
              </div>
            )}
          </div>
          
          <h3 className="font-bold mt-2">Recent Logs:</h3>
          <div className="mt-1 max-h-40 overflow-auto">
            {logs.map((log, i) => (
              <div key={i} className="mb-1 p-1 bg-white rounded border-l-2 border-yellow-500">
                <p><strong>Time:</strong> {log.timestamp.split('T')[1].split('.')[0]}</p>
                <p><strong>Type:</strong> {log.questionType}</p>
                <p><strong>Has graph data:</strong> {log.hasGraphData ? 'Yes' : 'No'}</p>
                <p><strong>Detected as linear:</strong> {log.isDetectedAsLinear ? 'Yes' : 'No'}</p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default LinearEquationDebug; 