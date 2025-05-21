import React, { useCallback } from 'react';
import { useSound } from '../contexts/SoundContext';

const MenuButton = ({ 
  text,
  className = "", 
  isCorrect = false, 
  isSelected = false, 
  onClick = () => {},
  textSize = "text-lg",
  icon = null
}) => {
  const { isMuted, playSound } = useSound();
  
  const playHoverSound = useCallback(() => {
    if (isMuted) return;
    playSound('hover', 0.2);
  }, [isMuted, playSound]);

  // Base classes that will always be applied
  const baseClasses = "transition-colors p-4 md:p-6 rounded-lg cursor-pointer border shadow-md flex items-center justify-center min-h-[100px] w-full";
  
  // Determine background and border classes based on the state
  let stateClasses = "";
  
  if (isSelected && isCorrect) {
    // Selected and correct answer
    stateClasses = "bg-emerald-100 hover:bg-emerald-200 border-emerald-500 text-emerald-800";
  } else if (isSelected && !isCorrect) {
    // Selected but incorrect answer
    stateClasses = "bg-indigo-100 hover:bg-indigo-200 border-indigo-500 text-indigo-800";
  } else if (isCorrect) {
    // Correct answer (revealed state)
    stateClasses = "bg-green-50 hover:bg-green-100 border-green-300 text-green-700";
  } else {
    // Default state (neither selected nor revealed as correct)
    stateClasses = "text-gray-900 hover:text-white border-4 border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg hover:shadow-[0_0_50px_rgba(29,24,124,0.8)] transition-shadow duration-100";
  }
  
  return (
    <div 
      className={`${baseClasses} ${stateClasses} ${className}`}
      onClick={onClick}
      onMouseEnter={playHoverSound}
    >
      {icon && <span className="mr-2">{icon}</span>}
      {text}
    </div>
  );
};

export default MenuButton;