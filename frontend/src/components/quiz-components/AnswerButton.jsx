import React, { useCallback, useState, useEffect, useRef } from 'react';
import 'katex/dist/katex.min.css';
import Latex from '@matejmazur/react-katex';
import { useSound } from '../../contexts/SoundContext';

const AnswerButton = ({ 
  latexString, 
  className = "", 
  isCorrect = false, 
  isSelected = false, 
  onClick = () => {},
  textSize = "text-lg"
}) => {
  const { isMuted } = useSound();
  const [dynamicTextSize, setDynamicTextSize] = useState(textSize);
  const containerRef = useRef(null);
  const contentRef = useRef(null);
  
  const playHoverSound = useCallback(() => {
    if (isMuted) return;
    const audio = new Audio('/sounds/hover.wav');
    audio.volume = 0.2;
    audio.play().catch(err => console.log('Audio playback failed:', err));
  }, [isMuted]);

  useEffect(() => {
    const adjustTextSize = () => {
      if (!containerRef.current || !contentRef.current) return;
      
      const containerWidth = containerRef.current.clientWidth;
      const contentWidth = contentRef.current.scrollWidth;
      
      // Start with the provided text size
      setDynamicTextSize(textSize);
      
      // Check if content overflows and reduce size incrementally
      setTimeout(() => {
        if (contentWidth > containerWidth * 0.95) {
          // If default size is text-lg, try text-base
          if (textSize === 'text-lg') setDynamicTextSize('text-base');
          else if (textSize === 'text-xl') setDynamicTextSize('text-lg');
          else if (textSize === 'text-2xl') setDynamicTextSize('text-xl');
          
          setTimeout(() => {
            if (contentRef.current && containerRef.current) {
              const updatedContentWidth = contentRef.current.scrollWidth;
              if (updatedContentWidth > containerRef.current.clientWidth * 0.95) {
                // Reduce further if still overflowing
                setDynamicTextSize('text-sm');
                
                setTimeout(() => {
                  if (contentRef.current && containerRef.current) {
                    if (contentRef.current.scrollWidth > containerRef.current.clientWidth * 0.95) {
                      setDynamicTextSize('text-xs');
                    }
                  }
                }, 0);
              }
            }
          }, 0);
        }
      }, 0);
    };

    // Run after render to measure sizes
    adjustTextSize();
    
    // Also run on window resize
    window.addEventListener('resize', adjustTextSize);
    return () => window.removeEventListener('resize', adjustTextSize);
  }, [latexString, textSize]);

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
      ref={containerRef}
      className={`${baseClasses} ${stateClasses} ${className}`}
      onClick={onClick}
      onMouseEnter={playHoverSound}
    >
      <div ref={contentRef} className="overflow-hidden">
        <Latex className={dynamicTextSize}>{latexString}</Latex>
      </div>
    </div>
  );
};

export default AnswerButton;