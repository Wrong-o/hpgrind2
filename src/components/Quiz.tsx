import React, { useState, useEffect } from 'react'
import 'katex/dist/katex.min.css'
import Latex from '@matejmazur/react-katex'
import { Triangle } from './Triangle'

interface Question {
  question: string
  options: string[]
  correct_answer: string
  equation_parts: {
    a?: number | null
    b?: number | null
    c?: number | null
    missing_side?: string
    // ... other possible properties
  }
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
  const [questions, setQuestions] = useState<Question[]>([])
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const correctSound = new Audio('/sounds/correct.mp3')
  const wrongSound = new Audio('/sounds/wrong.mp3')

  useEffect(() => {
    const fetchQuestions = async () => {
      try {
        const questionsList = []
        for (let i = 0; i < 10; i++) {
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
          questionsList.push(question)
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

    fetchQuestions()
  }, [])

  const handleAnswer = (answer: string) => {
    if (answer === questions[currentQuestion].correct_answer) {
      correctSound.play()
      setScore(score + 1)
    } else {
      wrongSound.play()
    }

    if (currentQuestion === 9) {
      onComplete(score)
    } else {
      setCurrentQuestion(currentQuestion + 1)
    }
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
    <div className="w-full max-w-lg">
      <div className="mb-4 text-right text-pink-600">
        Question {currentQuestion + 1}/10 | Score: {score}
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
              className="px-4 py-2 bg-white/50 rounded-lg hover:bg-white/70 transition-colors"
            >
              <Latex>{option}</Latex>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
} 