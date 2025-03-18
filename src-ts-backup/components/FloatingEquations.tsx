import React from 'react'

const equations = [
  'x²',
  '∑',
  '∫',
  'π',
  '√',
  '±',
  '÷',
  '∞',
  'θ',
  'Δ',
  'μ',
  'σ',
  '%',
  '≈',
  'XYZ'
]

export const FloatingEquations = () => {
  return (
    <>
      {equations.map((equation, i) => {
        const leftPosition = Math.floor(Math.random() * 100)
        return (
          <div
            key={i}
            style={{ left: `${leftPosition}%` }}
            className={`
              absolute animate-float
              text-blue-500/20 font-bold
              ${getRandomDelay()}
              ${getRandomSize()}
              select-none
            `}
          >
            {equation}
          </div>
        )
      })}
    </>
  )
}

const getRandomDelay = () => {
  const delays = [
    'animation-delay-0',
    'animation-delay-1000',
    'animation-delay-2000',
    'animation-delay-3000',
    'animation-delay-4000',
  ]
  return delays[Math.floor(Math.random() * delays.length)]
}

const getRandomSize = () => {
  const sizes = ['text-2xl', 'text-3xl', 'text-4xl', 'text-5xl']
  return sizes[Math.floor(Math.random() * sizes.length)]
} 