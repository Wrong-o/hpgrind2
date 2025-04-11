import React, { useState, useCallback } from 'react';
import { useSound } from '../../contexts/SoundContext';

export const Calculator = ({ onClose }) => {
  const { isMuted } = useSound();
  const [display, setDisplay] = useState('0');
  const [firstNumber, setFirstNumber] = useState(null);
  const [operation, setOperation] = useState(null);
  const [newNumber, setNewNumber] = useState(true);
  const [expression, setExpression] = useState('');

  // Add sound effects
  const clickSound = useCallback(() => {
    if (isMuted) return;
    const audio = new Audio('/sounds/click.mp3');
    audio.volume = 0.3;
    audio.play();
  }, [isMuted]);

  const handleNumber = (num) => {
    clickSound();
    if (num === '.' && display.includes('.')) return; // Prevent multiple decimal points

    if (newNumber) {
      setDisplay(num === '.' ? '0.' : num);
      setNewNumber(false);
    } else {
      setDisplay(display + num);
    }
  };

  const handleOperator = (op) => {
    clickSound();
    const currentNumber = parseFloat(display);
    if (firstNumber === null) {
      setFirstNumber(currentNumber);
      setExpression(`${currentNumber} ${op} `);
    } else {
      calculate();
      setFirstNumber(parseFloat(display));
      setExpression(`${display} ${op} `);
    }
    setOperation(op);
    setNewNumber(true);
  };

  const calculate = () => {
    clickSound();
    if (firstNumber === null || operation === null) return;
    const secondNumber = parseFloat(display);
    let result = 0;
    switch (operation) {
      case '+':
        result = firstNumber + secondNumber;
        break;
      case '-':
        result = firstNumber - secondNumber;
        break;
      case '*':
        result = firstNumber * secondNumber;
        break;
      case '/':
        result = firstNumber / secondNumber;
        break;
    }
    setDisplay(result.toString());
    setExpression('');
    setFirstNumber(null);
    setOperation(null);
    setNewNumber(true);
  };

  const clear = () => {
    clickSound();
    setDisplay('0');
    setFirstNumber(null);
    setOperation(null);
    setNewNumber(true);
    setExpression('');
  };

  const buttons = [7, 8, 9, '+', 4, 5, 6, '-', 1, 2, 3, '*', 'C', 0, '.', '=', '/'];

  return (
    <div 
      className="bg-stone-400 p-4 rounded-xl shadow-lg backdrop-blur-sm z-40 min-w-[240px]"
      onClick={e => e.stopPropagation()}
    >
      <div className="bg-gray-200 p-2 rounded mb-1 text-right text- text-gray-600">
        {expression || '\u00A0'}
      </div>
      <div className="bg-gray-200 p-2 rounded mb-2 text-right text-xl font-bold">
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
              else handleOperator(btn);
            }}
            className={`
              p-2 rounded text-lg font-bold transition-all duration-100
              active:scale-95 active:brightness-90
              ${typeof btn === 'number' || btn === '.' 
                ? "text-gray-900 bg-amber-200 hover:text-white border-4 border-gray-800 hover:bg-gray-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg hover:shadow-[0_0_150px_rgba(17,24,39,0.5)] transition-shadow duration-300"
                : btn === 'C' 
                  ? "text-gray-900 bg-red-500 hover:text-white border-4 border-gray-800 hover:bg-red-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg hover:shadow-[0_0_150px_rgba(17,24,39,0.5)] transition-shadow duration-300" 
                  : btn === '=' 
                    ? "text-gray-900 bg-green-500 hover:text-white border-4 border-gray-800 hover:bg-green-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg hover:shadow-[0_0_150px_rgba(17,24,39,0.5)] transition-shadow duration-300" 
 
                    : "text-gray-900 bg-indigo-400 hover:text-white border-4 border-gray-800 hover:bg-indigo-900 focus:ring-4 focus:outline-none focus:ring-gray-300 font-medium rounded-lg hover:shadow-[0_0_150px_rgba(17,24,39,0.5)] transition-shadow duration-300" 
}
              ${operation === btn ? 'ring-2 ring-blue-300' : ''}
            `}
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  );
};
