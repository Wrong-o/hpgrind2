import React from 'react'

interface QuizButtonProps {
  text: string
  onClick: () => void
}

export const QuizButton: React.FC<QuizButtonProps> = ({ text, onClick }) => {
  return (
    <button
      onClick={onClick}
      className="px-6 py-3 bg-white/50 backdrop-blur-sm rounded-xl 
                 shadow-lg border border-white/50 text-pink-600 font-bold
                 hover:bg-white/60 transition-all transform hover:scale-105
                 active:scale-95"
    >
      {text}
    </button>
  )
} 