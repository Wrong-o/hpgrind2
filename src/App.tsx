import React, { useState } from 'react'
import { Hearts } from './components/Hearts'
import { QuizButton } from './components/QuizButton'
import { Quiz } from './components/Quiz'

function App() {
  const [isQuizActive, setIsQuizActive] = useState(false)
  const [quizComplete, setQuizComplete] = useState(false)
  const [finalScore, setFinalScore] = useState(0)

  const handleQuizStart = () => {
    setIsQuizActive(true)
    setQuizComplete(false)
  }

  const handleQuizComplete = (score: number) => {
    setFinalScore(score)
    setQuizComplete(true)
    setIsQuizActive(false)
  }

  return (
    <div className="bg-gradient-to-b from-pink-200 to-purple-300 min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <Hearts />
      <div className="text-center z-10 bg-white/50 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-white/50">
        {!isQuizActive && !quizComplete && (
          <>
            <h1 className="text-4xl font-bold text-pink-600 mb-4 animate-bounce">
              Set some goals
            </h1>
            <h2 className="text-xl text-red-700 italic font-light mb-8">
              be quiet about them
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <QuizButton text="10 Frågor" onClick={handleQuizStart} />
              <QuizButton text="Kategorier" onClick={() => {}} />
              <QuizButton text="Profil" onClick={() => {}} />
              <QuizButton text="Sparade Frågor" onClick={() => {}} />
            </div>
          </>
        )}
        
        {isQuizActive && (
          <Quiz onComplete={handleQuizComplete} />
        )}

        {quizComplete && (
          <div>
            <h2 className="text-2xl font-bold text-pink-600 mb-4">Quiz Complete!</h2>
            <p className="text-xl text-purple-700">Your score: {finalScore}/10</p>
            <button
              onClick={() => setQuizComplete(false)}
              className="mt-4 px-6 py-2 bg-white/50 rounded-lg hover:bg-white/70"
            >
              Back to Menu
            </button>
          </div>
        )}
      </div>
    </div>
  )
}

export default App 