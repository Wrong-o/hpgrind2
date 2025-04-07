import React from 'react';
import 'katex/dist/katex.min.css';
import Latex from '@matejmazur/react-katex';

const AnswerButton = ({ 
  latexString, 
  className = "", 
  isCorrect = false, 
  isSelected = false, 
  onClick = () => {},
  textSize = "text-lg"
}) => {
  // Base classes that will always be applied
  const baseClasses = "transition-colors p-4 md:p-6 rounded-lg cursor-pointer border shadow-md flex items-center justify-center min-h-[100px] w-full";
  
  // Determine background and border classes based on the state
  let stateClasses = "";
  
  if (isSelected && isCorrect) {
    // Selected and correct answer
    stateClasses = "bg-green-100 hover:bg-green-200 border-green-500 text-green-800";
  } else if (isSelected && !isCorrect) {
    // Selected but incorrect answer
    stateClasses = "bg-indigo-100 hover:bg-indigo-200 border-indigo-500 text-indigo-800";
  } else if (isCorrect) {
    // Correct answer (revealed state)
    stateClasses = "bg-green-50 hover:bg-green-100 border-green-300 text-green-700";
  } else {
    // Default state (neither selected nor revealed as correct)
    stateClasses = "bg-white/10 hover:bg-white/20 border-white/20 text-black";
  }
  
  return (
    <div 
      className={`${baseClasses} ${stateClasses} ${className}`}
      onClick={onClick}
    >
      <Latex className={`${textSize}`}>{latexString}</Latex>
    </div>
  );
};

export default AnswerButton;