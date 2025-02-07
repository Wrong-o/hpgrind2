import React, { useState, useEffect } from 'react'
import 'katex/dist/katex.min.css'
import Latex from '@matejmazur/react-katex'
import { Triangle } from './Triangle'
import { DrawingBoard } from './DrawingBoard'
import { Calculator } from './Calculator'
import { useSound } from '../contexts/SoundContext'
import { useAuth } from '../contexts/AuthContext'

interface Question {
  question: string
  options: string[]
  correct_answer: string
  equation_parts?: any
  subcategory: string
  difficulty: number
  explanation: string
  id: number
}

interface QuizProps {
  onComplete: (score: number) => void
}

const formatQuestion = (question: string, equationParts: any): JSX.Element => {
  // Convert power rule questions to LaTeX
  if (question.includes('^') || question.includes('\\frac')) {
    return (
      <div className="space-y-6 text-center">
        <div className="text-2xl">Vad blir exponenten när du förenklar:</div>
        <div className="text-4xl flex justify-center py-4">
          <Latex>
            {question.replace('What is the exponent when simplifying: ', '')}
          </Latex>
        </div>
      </div>
    )
  }
  
  // Convert Pythagorean theorem questions to visual
  if (question.includes('triangle')) {
    const { a, b, c, missing_side } = equationParts
    console.log('Raw question data:', equationParts)
    
    // Create props object - keep null values as null
    const triangleProps = {
      a: a === null || a === undefined ? null : Number(a),
      b: b === null || b === undefined ? null : Number(b),
      c: c === null || c === undefined ? null : Number(c),
      missingLabel: missing_side as 'a' | 'b' | 'c'
    }
    
    console.log('Processed triangle props:', triangleProps)
    
    return (
      <div>
        <Triangle {...triangleProps} />
        <div className="text-center mt-4">
          Hur lång är den okända sidan?
        </div>
      </div>
    )
  }
  
  // Convert basic math questions to LaTeX
  if (question.includes('+') || question.includes('-') || question.includes('*')) {
    const parts = question.match(/What is (.+)\?/)
    if (parts) {
      const equation = parts[1].replace(/\*/g, '\\times ')
      return (
        <div>
          What is <Latex>{equation}</Latex>?
        </div>
      )
    }
  }
  
  return <div>{question}</div>
}

export const Quiz: React.FC<QuizProps> = ({ onComplete }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [questions, setQuestions] = useState<Question[]>([])
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<string | null>(null)
  const [isAnswered, setIsAnswered] = useState(false)
  const [timeLeft, setTimeLeft] = useState(120) // 2 minutes per question
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [showExplanation, setShowExplanation] = useState(false)
  const [lastAnsweredCorrectly, setLastAnsweredCorrectly] = useState(false)
  const [canProceed, setCanProceed] = useState(false)
  const [showDrawingBoard, setShowDrawingBoard] = useState(false)
  const [showCalculator, setShowCalculator] = useState(false)
  const { isMuted, toggleMute } = useSound()
  const [startTime, setStartTime] = useState<Date | null>(null)
  const { token, refreshToken } = useAuth()

  const correctSound = new Audio('/sounds/correct.mp3')
  const wrongSound = new Audio('/sounds/wrong.mp3')
  
  correctSound.volume = isMuted ? 0 : 0.2
  wrongSound.volume = isMuted ? 0 : 0.2

  useEffect(() => {
    const fetchQuestions = async (count: number) => {
      try {
        const questionsList = []
        for (let i = 0; i < count; i++) {
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/question`, {
            method: 'GET',
            headers: {
              'Accept': 'application/json',
              'Content-Type': 'application/json',
            },
            credentials: 'omit'
          })
          
          if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`)
          }
          const question = await response.json()
          // Add an id if it doesn't exist
          questionsList.push({
            ...question,
            id: question.id || i + 1  // Fallback to index+1 if no id
          })
        }
        setQuestions(questionsList)
        setError(null)
      } catch (error) {
        console.error('Error fetching questions:', error)
        setError('Failed to load questions. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchQuestions(12)
  }, [])

  // Set start time when question loads
  useEffect(() => {
    setStartTime(new Date())
  }, [currentQuestion])

  const handleTokenError = async () => {
    try {
      await refreshToken()  // Implement this in your AuthContext
      return true
    } catch (error) {
      console.error('Failed to refresh token:', error)
      return false
    }
  }

  const handleAnswer = async (answer: string) => {
    const isCorrect = answer === questions[currentQuestion].correct_answer
    setLastAnsweredCorrectly(isCorrect)
    setShowExplanation(true)
    setCanProceed(true)

    if (isCorrect) {
      correctSound.play()
      setScore(score + 1)
    } else {
      wrongSound.play()
    }

    // Only try to save if user is logged in
    if (token) {
      const timeTaken = startTime ? Math.round((new Date().getTime() - startTime.getTime()) / 1000) : 0
      
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/attempts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            question_id: questions[currentQuestion].id,
            subcategory: questions[currentQuestion].subcategory || 'XYZ - Okategoriserad',
            is_correct: isCorrect,
            is_skipped: false,
            time_taken: timeTaken,
          })
        })

        if (response.status === 401) {
          // Token expired, try to refresh
          const refreshed = await handleTokenError()
          if (refreshed) {
            // Retry the request with new token
            // ... retry logic here
          }
        } else if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
      } catch (error) {
        console.error('Failed to save attempt:', error)
      }
    }
  }

  const handleSkip = async () => {
    // Only try to save if user is logged in
    if (token) {
      const timeTaken = startTime ? Math.round((new Date().getTime() - startTime.getTime()) / 1000) : 0
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/attempts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json',
          },
          credentials: 'include',
          body: JSON.stringify({
            question_id: questions[currentQuestion].id,
            subcategory: questions[currentQuestion].subcategory || 'XYZ - Okategoriserad',
            is_correct: false,
            is_skipped: true,
            time_taken: timeTaken,
          })
        })

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
      } catch (error) {
        console.error('Failed to save skip:', error)
      }
    }

    handleNext()
  }

  const handleNext = () => {
    if (currentQuestion === 11) {
      onComplete(score)
    } else {
      setCurrentQuestion(currentQuestion + 1)
      setShowExplanation(false)
      setCanProceed(false)
    }
  }

  const getDifficultyStars = (level: number) => {
    return '★'.repeat(level) + '☆'.repeat(5 - level)
  }

  if (loading) {
    return <div className="text-xl text-pink-600">Loading questions...</div>
  }

  if (error || questions.length === 0) {
    return (
      <div className="text-xl text-red-600">
        {error || 'No questions available'}
        <button
          onClick={() => window.location.reload()}
          className="block mt-4 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600"
        >
          Try Again
        </button>
      </div>
    )
  }

  return (
    <div className="w-full max-w-4xl p-4" onClick={() => setShowCalculator(false)}>
      {/* Sound control button */}
      <div className="fixed top-4 right-4 z-[60]">
        <button
          onClick={(e) => {
            e.stopPropagation()
            toggleMute()
          }}
          className="p-3 bg-white/50 rounded-full hover:bg-white/70 transition-colors"
          title={isMuted ? "Aktivera ljud" : "Stäng av ljud"}
        >
          {isMuted ? (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" />
            </svg>
          )}
        </button>
      </div>

      {/* Sidebar - increased z-index */}
      <div className="fixed left-4 top-1/2 -translate-y-1/2 space-y-4 z-[60]">
        <button
          onClick={(e) => {
            e.stopPropagation()
            setShowDrawingBoard(true)
          }}
          className="p-3 bg-white/50 rounded-full hover:bg-white/70 transition-colors"
          title="Ritbräda"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
          </svg>
        </button>
        
        <button
          onClick={(e) => {
            e.stopPropagation()
            setShowCalculator(!showCalculator)
          }}
          className="p-3 bg-white/50 rounded-full hover:bg-white/70 transition-colors"
          title="Kalkylator"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
          </svg>
        </button>
      </div>

      {/* Drawing Board */}
      {showDrawingBoard && (
        <DrawingBoard
          question={questions[currentQuestion].question}
          onClose={() => setShowDrawingBoard(false)}
          currentQuestion={currentQuestion}
        />
      )}

      {/* Calculator */}
      {showCalculator && (
        <Calculator onClose={() => setShowCalculator(false)} />
      )}

      <div className="bg-white/40 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-teal-100">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-blue-600">XYZ Test</h2>
            <div className="text-sm text-teal-600">
              {questions[currentQuestion].subcategory} • 
              <span className="text-yellow-500 ml-2" title={`Svårighetsgrad ${questions[currentQuestion].difficulty}/5`}>
                {getDifficultyStars(questions[currentQuestion].difficulty)}
              </span>
            </div>
          </div>
          <div className="text-lg font-medium text-teal-700">
            Fråga {currentQuestion + 1}/12
          </div>
        </div>
        <div className="mb-4 text-right text-pink-600">
          Score: {score}
        </div>
        <div className="bg-white/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/50">
          <h2 className="text-2xl text-pink-600 mb-4">
            {formatQuestion(
              questions[currentQuestion].question,
              questions[currentQuestion].equation_parts
            )}
          </h2>
          <div className="grid grid-cols-2 gap-4">
            {questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className="px-4 py-2 bg-blue-500 text-white rounded-lg 
                          hover:bg-blue-600 transition-colors"
                disabled={showExplanation}
              >
                <Latex>{option}</Latex>
              </button>
            ))}
          </div>
        </div>

        {/* Skip button */}
        <button
          onClick={handleSkip}
          className="mt-4 px-4 py-2 text-gray-600 hover:text-gray-800 
                    transition-colors text-sm underline"
        >
          Klicka här istället för att chansa
        </button>

        {showExplanation && (
          <div className="mt-4">
            <div className={`p-4 rounded-lg ${
              lastAnsweredCorrectly ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <h3 className="font-bold mb-2">
                {lastAnsweredCorrectly ? 'Bra jobbat!' : 'Nästan rätt!'}
              </h3>
              <p className="whitespace-pre-line">
                {questions[currentQuestion].explanation}
              </p>
            </div>
            
            {canProceed && (
              <div className="mt-4 flex justify-end">
                <button
                  onClick={handleNext}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg 
                           hover:bg-blue-700 transition-colors"
                >
                  {currentQuestion === 11 ? 'Se resultat' : 'Nästa fråga'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  )
} 