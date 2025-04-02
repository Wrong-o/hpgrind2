import React from 'react';

/**
 * Skip Button Component
 * 
 * A button that allows users to skip the current question.
 * 
 * @param {Object} props
 * @param {Function} props.onClick - Function to call when the button is clicked
 * @param {boolean} props.disabled - Whether the button is disabled
 * @param {string} props.className - Additional CSS classes to apply
 * @param {boolean} props.showAnswer - Whether the answer is currently being shown
 * @returns {JSX.Element}
 */
const SkipButton = ({ 
  onClick, 
  disabled = false, 
  className = "",
  showAnswer = false
}) => {
  // If we're showing the answer, don't show the skip button
  if (showAnswer) {
    return null;
  }
  
  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`
        px-4 py-2 
        rounded-lg 
        font-medium 
        transition-all 
        duration-200
        ${disabled 
          ? 'bg-gray-200 text-gray-400 cursor-not-allowed' 
          : 'bg-gray-100 text-gray-600 hover:bg-gray-200 hover:text-gray-800'
        }
        flex items-center justify-center gap-2
        ${className}
      `}
      aria-label="Skip this question"
      title="Skip this question"
    >
      <span>Hoppa över</span>
      <svg 
        xmlns="http://www.w3.org/2000/svg" 
        className="h-4 w-4" 
        fill="none" 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path 
          strokeLinecap="round" 
          strokeLinejoin="round" 
          strokeWidth={2} 
          d="M13 5l7 7-7 7M5 5l7 7-7 7" 
        />
      </svg>
    </button>
  );
};

export default SkipButton;