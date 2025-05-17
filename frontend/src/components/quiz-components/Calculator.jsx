import React, { useState, useCallback } from 'react';
import { useSound } from '../../contexts/SoundContext';

export const Calculator = ({ onClose }) => {
  const { isMuted } = useSound();
  const [display, setDisplay] = useState('0');
  const [firstNumber, setFirstNumber] = useState(null);
  const [operation, setOperation] = useState(null);
  const [waitingForSecondNumber, setWaitingForSecondNumber] = useState(false);
  const [expression, setExpression] = useState('');

  // Add sound effects
  const clickSound = useCallback(() => {
    if (isMuted) return;
    const audio = new Audio('/sounds/click.mp3');
    audio.volume = 0.3;
    audio.play();
  }, [isMuted]);

  const handleNumber = (numStr) => {
    clickSound();
    if (numStr === '.' && display.includes('.')) return;

    if (waitingForSecondNumber) {
      setDisplay(numStr === '.' ? '0.' : numStr);
      setWaitingForSecondNumber(false);
    } else {
      setDisplay(display === '0' && numStr !== '.' ? numStr : display + numStr);
    }
  };

  const handleOperator = (op) => {
    clickSound();
    const currentDisplayValue = parseFloat(display);

    if (firstNumber !== null && operation && !waitingForSecondNumber) {
      // A previous operation is pending, and a second number has been entered.
      // Calculate the intermediate result.
      let result = 0;
      switch (operation) {
        case '+': result = firstNumber + currentDisplayValue; break;
        case '-': result = firstNumber - currentDisplayValue; break;
        case '*': result = firstNumber * currentDisplayValue; break;
        case '/': result = firstNumber / currentDisplayValue; break;
        default: result = currentDisplayValue;
      }
      setDisplay(result.toString());
      setFirstNumber(result);
      setExpression(`${result.toString()} ${op} `);
    } else {
      // This is the first operator, or an operator is pressed again (chaining before new number),
      // or starting a new calculation with the previous result.
      setFirstNumber(currentDisplayValue);
      setExpression(`${currentDisplayValue} ${op} `);
    }
    setOperation(op);
    setWaitingForSecondNumber(true);
  };

  const calculate = () => {
    clickSound();
    if (firstNumber === null || operation === null || waitingForSecondNumber) {
      // Not enough information to calculate, or waiting for the second number after an operator.
      return;
    }
    const secondNumber = parseFloat(display);
    let result = 0;
    switch (operation) {
      case '+': result = firstNumber + secondNumber; break;
      case '-': result = firstNumber - secondNumber; break;
      case '*': result = firstNumber * secondNumber; break;
      case '/': result = firstNumber / secondNumber; break;
      default: return; // Should not happen with a valid operation
    }
    setDisplay(result.toString());
    setExpression(`${firstNumber} ${operation} ${secondNumber} =`);
    setFirstNumber(result); // The result becomes the new firstNumber for potential further operations
    setOperation(null); // Clear the operation after hitting equals
    setWaitingForSecondNumber(true); // Ready for a new number if user starts typing, or new op
  };

  const clear = () => {
    clickSound();
    setDisplay('0');
    setFirstNumber(null);
    setOperation(null);
    setWaitingForSecondNumber(false); // Changed from true, display '0' is not waiting for second number
    setExpression('');
  };

  const buttons = [
    7, 8, 9, '/', 
    4, 5, 6, '*', 
    1, 2, 3, '-', 
    'C', 0, '.', '+', 
    '=' // Moved equals to its own row or a more prominent position if desired, or span it.
  ];

  return (
    <div 
      className="bg-stone-400 p-4 rounded-xl shadow-lg backdrop-blur-sm z-40 min-w-[240px]"
      onClick={e => e.stopPropagation()}
    >
      <div className="bg-gray-200 p-2 rounded mb-1 text-right text-sm text-gray-600 min-h-[24px]">
        {expression || '\u00A0'} 
      </div>
      <div className="bg-gray-200 p-2 rounded mb-2 text-right text-2xl font-bold min-h-[36px]">
        {display}
      </div>
      <div className="grid grid-cols-4 gap-2">
        {buttons.map((btn, i) => (
          <button
            key={i}
            onClick={() => {
              if (typeof btn === 'number' || btn === '.') handleNumber(btn.toString());
              else if (btn === '=') calculate();
              else if (btn === 'C') clear();
              else handleOperator(btn.toString());
            }}
            className={`
              p-3 rounded text-lg font-bold transition-all duration-100
              active:scale-95 active:brightness-90 
              ${btn === '=' ? 'col-span-4' : ''} // Make equals button span full width
              ${typeof btn === 'number' || btn === '.' 
                ? "text-gray-900 bg-amber-200 hover:text-white border-4 border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg hover:shadow-[0_0_150px_rgba(17,24,39,0.5)] transition-shadow duration-300"
                : btn === 'C' 
                  ? "text-gray-900 bg-red-500 hover:text-white border-4 border-gray-800 hover:bg-red-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg hover:shadow-[0_0_150px_rgba(17,24,39,0.5)] transition-shadow duration-300" 
                  : btn === '=' 
                    ? "text-gray-900 bg-green-500 hover:text-white border-4 border-gray-800 hover:bg-green-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg hover:shadow-[0_0_150px_rgba(17,24,39,0.5)] transition-shadow duration-300" 
                    : "text-gray-900 bg-indigo-400 hover:text-white border-4 border-gray-800 hover:bg-indigo-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg hover:shadow-[0_0_150px_rgba(17,24,39,0.5)] transition-shadow duration-300" 
              }
              ${operation === btn && typeof btn !== 'number' && btn !== '.' ? 'ring-2 ring-blue-600' : ''}
            `}
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
};
