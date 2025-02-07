import React, { useState, useCallback } from 'react'
import { useSound } from '../contexts/SoundContext'

interface CalculatorProps {
  onClose: () => void
}

export const Calculator: React.FC<CalculatorProps> = ({ onClose }) => {
  const { isMuted } = useSound()
  const [display, setDisplay] = useState('0')
  const [firstNumber, setFirstNumber] = useState<number | null>(null)
  const [operation, setOperation] = useState<string | null>(null)
  const [newNumber, setNewNumber] = useState(true)
  const [expression, setExpression] = useState<string>('')

  // Add sound effects
  const clickSound = useCallback(() => {
    if (isMuted) return
    const audio = new Audio('/sounds/click.mp3')
    audio.volume = 0.3
    audio.play()
  }, [isMuted])

  const handleNumber = (num: string) => {
    clickSound()
    if (num === '.' && display.includes('.')) return // Prevent multiple decimal points
    
    if (newNumber) {
      setDisplay(num === '.' ? '0.' : num)
      setNewNumber(false)
    } else {
      setDisplay(display + num)
    }
  }

  const handleOperator = (op: string) => {
    clickSound()
    const currentNumber = parseFloat(display)
    
    if (firstNumber === null) {
      setFirstNumber(currentNumber)
      setExpression(`${currentNumber} ${op} `)
    } else {
      calculate()
      setFirstNumber(parseFloat(display))
      setExpression(`${display} ${op} `)
    }
    
    setOperation(op)
    setNewNumber(true)
  }

  const calculate = () => {
    clickSound()
    if (firstNumber === null || operation === null) return

    const secondNumber = parseFloat(display)
    let result = 0

    switch (operation) {
      case '+':
        result = firstNumber + secondNumber
        break
      case '-':
        result = firstNumber - secondNumber
        break
      case '*':
        result = firstNumber * secondNumber
        break
      case '/':
        result = firstNumber / secondNumber
        break
    }

    setDisplay(result.toString())
    setExpression('')
    setFirstNumber(null)
    setOperation(null)
    setNewNumber(true)
  }

  const clear = () => {
    clickSound()
    setDisplay('0')
    setFirstNumber(null)
    setOperation(null)
    setNewNumber(true)
    setExpression('')
  }

  return (
    <div 
      className="absolute right-4 top-20 bg-white/95 p-4 rounded-xl shadow-lg
                 backdrop-blur-sm z-40 min-w-[240px]"
      onClick={(e) => e.stopPropagation()}
    >
      <div className="bg-gray-100 p-2 rounded mb-1 text-right text-sm text-gray-600">
        {expression || '\u00A0'}
      </div>
      
      <div className="bg-gray-100 p-2 rounded mb-2 text-right text-xl font-bold">
        {display}
      </div>
      
      <div className="grid grid-cols-4 gap-2">
        {[7,8,9,'+',4,5,6,'-',1,2,3,'*','C',0,'.','=','/'].map((btn, i) => (
          <button
            key={i}
            onClick={() => {
              if (typeof btn === 'number' || btn === '.') handleNumber(btn.toString())
              else if (btn === '=') calculate()
              else if (btn === 'C') clear()
              else handleOperator(btn)
            }}
            className={`
              p-2 rounded text-lg font-bold transition-all duration-100
              active:scale-95 active:brightness-90
              ${typeof btn === 'number' || btn === '.' 
                ? 'bg-yellow-50 hover:bg-yellow-100 text-yellow-800' 
                : btn === 'C'
                  ? 'bg-red-500 text-white hover:bg-red-600'
                  : btn === '='
                    ? 'bg-green-500 text-white hover:bg-green-600'
                    : 'bg-blue-500 text-white hover:bg-blue-600'}
              ${operation === btn ? 'ring-2 ring-blue-300' : ''}
            `}
          >
            {btn}
          </button>
        ))}
      </div>
    </div>
  )
} 