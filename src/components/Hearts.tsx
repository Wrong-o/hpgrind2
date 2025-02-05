import React from 'react'

export const Hearts = () => {
  return (
    <>
      {[...Array(15)].map((_, i) => {
        const leftPosition = Math.floor(Math.random() * 100)
        return (
          <div
            key={i}
            style={{ left: `${leftPosition}%` }}
            className={`
              absolute animate-float
              text-pink-500/40
              ${getRandomDelay()}
              ${getRandomSize()}
            `}
          >
            ❤️
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
  const sizes = ['text-xl', 'text-2xl', 'text-3xl', 'text-4xl']
  return sizes[Math.floor(Math.random() * sizes.length)]
} 