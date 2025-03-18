import React, { useState, useEffect } from 'react'
import 'katex/dist/katex.min.css'
import Latex from '@matejmazur/react-katex'
import { Triangle } from './Triangle'
import { DrawingBoard } from './DrawingBoard'
import { Calculator } from './Calculator'
import { useSound } from '../contexts/SoundContext'
import { useAuth } from '../contexts/AuthContext'
import { LoadingScreen } from './LoadingScreen'

interface Question {
  id: string
  subject: string
  category: string
  moment: string
  difficulty: number
  question: string
  answers: string[]
  correct_answer: string
  drawing: any[]
  explanation: string
}

interface QuestionTypeCount {
  [key: string]: {
    total: number
    completed: number
  }
}

interface QuizProps {
  onComplete: (score: number) => void
  testType: 'XYZ' | 'NOG' | 'PRO' | 'DTK' | 'MATEMATIKBASIC'
  onBack: () => void
}

const formatQuestion = (question: string): JSX.Element => {
  // Split the text by $ to separate LaTeX and regular text
  const parts = question.split(/(\$[^$]+\$)/)
  return (
    <div className="space-y-6 text-center">
      <div className="text-2xl py-4">
        {parts.map((part, index) => {
          if (part.startsWith('$') && part.endsWith('$')) {
            // Remove the $ symbols and render as LaTeX
            return <Latex key={index} math={part.slice(1, -1)} />
          }
          return <span key={index}>{part}</span>
        })}
      </div>
    </div>
  )
}

const getQuestionTypeLabel = (type: string): string => {
  const labels: { [key: string]: string } = {
    'räknelagar': 'Räknelagar',
    'förlänga': 'Förlänga bråk',
    'förkorta': 'Förkorta bråk',
    'adda': 'Addera bråk',
    'multiplicera': 'Multiplicera bråk',
    'division': 'Division',
    'multiplikation': 'Multiplikation',
    'addition': 'Addition',
    'subtraktion': 'Subtraktion'
  }
  const lastPart = type.split('-').pop() || ''
  return labels[lastPart] || lastPart
}

export const Quiz: React.FC<QuizProps> = ({ onComplete, testType, onBack }) => {
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
  const [questionTypeCounts, setQuestionTypeCounts] = useState<QuestionTypeCount>({
    'matematikbasic-räknelagar': { total: 0, completed: 0 },
    'matematikbasic-fraktioner-förlänga': { total: 0, completed: 0 },
    'matematikbasic-fraktioner-förkorta': { total: 0, completed: 0 },
    'matematikbasic-fraktioner-adda': { total: 0, completed: 0 },
    'matematikbasic-fraktioner-multiplicera': { total: 0, completed: 0 },
    'matematikbasic-ekvationslösning-division': { total: 0, completed: 0 },
    'matematikbasic-ekvationslösning-multiplikation': { total: 0, completed: 0 },
    'matematikbasic-ekvationslösning-addition': { total: 0, completed: 0 },
    'matematikbasic-ekvationslösning-subtraktion': { total: 0, completed: 0 }
  })

  const correctSound = new Audio('/sounds/correct.mp3')
  const wrongSound = new Audio('/sounds/wrong.mp3')
  
  correctSound.volume = isMuted ? 0 : 0.2
  wrongSound.volume = isMuted ? 0 : 0.2

  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true)
      setError(null)
      try {
        // Fetch 12 questions
        const allQuestions: Question[] = []
        for (let i = 0; i < 12; i++) {
          const questionResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/question?type=${testType}`)
          if (!questionResponse.ok) {
            throw new Error('Failed to fetch questions')
          }
          const questionData = await questionResponse.json()
          allQuestions.push(questionData)
        }
        setQuestions(allQuestions)
      } catch (err) {
        setError('Failed to load questions. Please try again.')
        console.error('Error fetching questions:', err)
      }
      setLoading(false)
    }

    fetchQuestions()
  }, [testType])

  // Set start time when question loads
  useEffect(() => {
    if (questions.length > 0) {
      setStartTime(new Date())
    }
  }, [currentQuestion, questions])

  // Update the counts when questions are loaded
  useEffect(() => {
    if (testType === 'MATEMATIKBASIC' && questions.length > 0) {
      const counts: QuestionTypeCount = { ...questionTypeCounts }
      questions.forEach(q => {
        if (counts[q.moment]) {
          counts[q.moment].total++
        }
      })
      setQuestionTypeCounts(counts)
    }
  }, [questions, testType])

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
    // Remove any whitespace and normalize the strings for comparison
    const normalizedAnswer = answer.trim()
    const normalizedCorrectAnswer = questions[currentQuestion].correct_answer.trim()
    const isCorrect = normalizedAnswer === normalizedCorrectAnswer
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
      const currentQ = questions[currentQuestion]
      
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
            subject: currentQ.subject,
            category: currentQ.category,
            moment: currentQ.moment,
            difficulty: currentQ.difficulty,
            skipped: false,
            time: timeTaken,
            is_correct: isCorrect
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

    if (testType === 'MATEMATIKBASIC') {
      const currentMoment = questions[currentQuestion].moment
      setQuestionTypeCounts(prev => ({
        ...prev,
        [currentMoment]: {
          ...prev[currentMoment],
          completed: prev[currentMoment].completed + 1
        }
      }))
    }
  }

  const handleSkip = async () => {
    // Only try to save if user is logged in
    if (token) {
      const timeTaken = startTime ? Math.round((new Date().getTime() - startTime.getTime()) / 1000) : 0
      const currentQ = questions[currentQuestion]

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
            subject: currentQ.subject,
            category: currentQ.category,
            moment: currentQ.moment,
            difficulty: currentQ.difficulty,
            skipped: true,
            time: timeTaken,
            is_correct: false
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
    return <LoadingScreen />
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

  // Make sure we have questions before rendering the quiz interface
  if (!questions[currentQuestion]) {
    return <LoadingScreen />
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

      {/* Back button */}
      <div className="fixed top-4 left-4 z-[60]">
        <button
          onClick={(e) => {
            e.stopPropagation()
            onBack()
          }}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Tillbaka
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
        <div 
          className="fixed inset-0 flex items-center justify-center z-[70]" 
          onClick={() => setShowCalculator(false)}
        >
          <div onClick={(e) => e.stopPropagation()}>
            <Calculator onClose={() => setShowCalculator(false)} />
          </div>
        </div>
      )}

      <div className="bg-white/40 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-teal-100">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-blue-600">{testType} Test</h2>
            <div className="text-sm text-teal-600">
              {questions[currentQuestion].moment} • 
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

        {/* Add question type progress for MATEMATIKBASIC */}
        {testType === 'MATEMATIKBASIC' && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-blue-600 mb-2">Framsteg per område:</h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(questionTypeCounts).map(([type, count]) => (
                <div 
                  key={type} 
                  className={`flex justify-between items-center rounded-lg p-3 
                    ${count.completed > 0 ? 'bg-blue-50' : 'bg-white/50'}`}
                >
                  <span className="text-sm font-medium text-gray-700">
                    {getQuestionTypeLabel(type)}
                  </span>
                  <div className="flex items-center gap-2">
                    <div className="h-2 w-16 bg-gray-200 rounded-full overflow-hidden">
                      <div 
                        className="h-full bg-blue-600 transition-all duration-300"
                        style={{ 
                          width: `${count.total > 0 ? (count.completed / count.total) * 100 : 0}%` 
                        }}
                      />
                    </div>
                    <span className="text-sm font-medium text-blue-600 min-w-[3ch] text-right">
                      {count.completed}/{count.total}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        <div className="bg-white/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/50">
          <div className="text-2xl text-pink-600 mb-8">
            {formatQuestion(questions[currentQuestion]?.question || '')}
          </div>
          <div className="grid grid-cols-2 gap-6">
            {questions[currentQuestion]?.answers.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(option)}
                className={`px-6 py-4 bg-blue-500 text-white rounded-lg 
                          hover:bg-blue-600 transition-colors min-h-[80px]
                          flex items-center justify-center
                          ${showExplanation ? 'cursor-not-allowed opacity-75' : ''}`}
                disabled={showExplanation}
              >
                <div className="text-xl">
                  <Latex math={option.slice(1, -1)} />
                </div>
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
          <div className="mt-6">
            <div className={`p-6 rounded-lg ${
              lastAnsweredCorrectly ? 'bg-green-100' : 'bg-red-100'
            }`}>
              <h3 className="font-bold mb-4 text-xl">
                {lastAnsweredCorrectly ? 'Bra jobbat!' : 'Nästan rätt!'}
              </h3>
              <div className="text-lg whitespace-pre-line">
                {questions[currentQuestion].explanation.split(/(\$[^$]+\$)/).map((part, index) => {
                  if (part.startsWith('$') && part.endsWith('$')) {
                    return <Latex key={index} math={part.slice(1, -1)} />
                  }
                  return <span key={index}>{part}</span>
                })}
              </div>
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