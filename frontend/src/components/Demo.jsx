import React, { useState, useEffect, useRef, useCallback } from 'react';
import QuestionBox from '../components/quiz-components/QuestionBox';
import AnswerButton from '../components/quiz-components/AnswerButton';
import QuizAssistant from '../components/quiz-components/QuizAssistant';
import SmallButton from '../components/SmallButton';
import { ChevronDoubleRightIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useSound } from '../contexts/SoundContext';
import demoQuestions from '../contexts/DemoQuestions.json';
import DemoStats from './quiz-components/DemoStats';

const Demo = () => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [skipped, setSkipped] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [results, setResults] = useState([]);
  const startTimeRef = useRef(Date.now());
  const { isMuted } = useSound();
  const [answeredMultiplication, setAnsweredMultiplication] = useState(0);
  const [answeredDivision, setAnsweredDivision] = useState(0);
  const [answeredAddition, setAnsweredAddition] = useState(0);
  const [answeredSubtraction, setAnsweredSubtraction] = useState(0);
  const [correctMultiplication, setCorrectMultiplication] = useState(0);
  const [correctDivision, setCorrectDivision] = useState(0);
  const [correctAddition, setCorrectAddition] = useState(0);
  const [correctSubtraction, setCorrectSubtraction] = useState(0);
  
  // Fisher-Yates shuffle algorithm
  const shuffleArray = (array) => {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  };

  useEffect(() => {
    try {
      // Format and shuffle the demo questions
      const formattedQuestions = demoQuestions.questions.map((data, i) => ({
        id: i,
        question: data.question,
        options: shuffleArray([...data.answers.map((answer, index) => ({
          id: index,
          latex: answer.toString(),
          isCorrect: answer === data.correct_answer
        }))]),
        explanation: data.explanation,
        subject: data.subject,
        category: data.category,
        difficulty: data.difficulty,
        moment: data.moment
      }));

      // Shuffle the questions themselves
      setQuestions(shuffleArray([...formattedQuestions]));
      setLoading(false);
    } catch (err) {
      console.error('Error loading demo questions:', err);
      setError("Failed to load demo questions.");
      setLoading(false);
    }
  }, []);
  
  // Reset timer when moving to a new question
  useEffect(() => {
    startTimeRef.current = Date.now();
  }, [currentQuestionIndex]);
  
  const handleAnswerClick = (id) => {
    setSelectedAnswer(id);
    if (question.subject === "multiplication") {
      setAnsweredMultiplication(answeredMultiplication + 1);
    } else if (question.subject === "division") {
      setAnsweredDivision(answeredDivision + 1);
    } else if (question.subject === "addition") {
      setAnsweredAddition(answeredAddition + 1);
    } else if (question.subject === "subtraction") {
      setAnsweredSubtraction(answeredSubtraction + 1);
    }
    
  };
  
  
  const handleCheckAnswer = async () => {
    setShowAnswer(true);
    
    // Get the current question data
    const question = questions[currentQuestionIndex];
    // Get the selected option
    const selectedOption = question.options[selectedAnswer];
    
    // Play the appropriate sound
    if (selectedOption.isCorrect) {
      playCorrectSound();
      if (question.subject === "multiplication") {
        setCorrectMultiplication(correctMultiplication + 1);
      } else if (question.subject === "division") {
        setCorrectDivision(correctDivision + 1);
      } else if (question.subject === "addition") {
        setCorrectAddition(correctAddition + 1);
      } else if (question.subject === "subtraction") {
        setCorrectSubtraction(correctSubtraction + 1);
      }
    } else {
      playWrongSound();
    }

    // Calculate time spent on this question
    const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
    
    const answerResult = {
      correct: selectedOption.isCorrect,
      timeSpent: timeSpent,
      skipped: skipped
    };

    
  };

  const playSkipSound = useCallback(() => {
    if (isMuted) return;
    const audio = new Audio('/sounds/quiz_skip.wav');
    audio.volume = 0.3;
    audio.play().catch(err => console.log('Audio playback failed:', err));
  }, [isMuted]);

  const playCorrectSound = useCallback(() => {
    if (isMuted) return;
    const audio = new Audio('/sounds/quiz_correct.wav');
    audio.volume = 0.3;
    audio.play().catch(err => console.log('Audio playback failed:', err));
  }, [isMuted]);

  const playWrongSound = useCallback(() => {
    if (isMuted) return;
    const audio = new Audio('/sounds/quiz_wrong.wav');
    audio.volume = 0.3;
    audio.play().catch(err => console.log('Audio playback failed:', err));
  }, [isMuted]);
  const handleSkip = () => {
    playSkipSound();
    setSkipped(true);
    handleNextQuestion();
  };

  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setShowAnswer(false);
    setSkipped(false);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      setQuizCompleted(true);
    }
  };

  // Get current question data
  const currentQuestion = questions[currentQuestionIndex] || {
    question: "",
    options: []
  };
  if (quizCompleted) {
    return (
      <div className="absolute inset-0 z-50 bg-gradient-to-b from-blue-300 to-white">
        <ResultPage 
          results={results} 
          onReset={() => {
            setQuizCompleted(false);
            setCurrentQuestionIndex(0);
            setResults([]);
            setSelectedAnswer(null);
            setShowAnswer(false);
            setSkipped(false);
            fetchQuestions();
            startTimeRef.current = Date.now();
          }}
        />
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <div className="text-center text-red-600 p-4 rounded-lg bg-red-50 border border-red-200">
          <p>{error}</p>
          <button 
            onClick={() => window.location.reload()}
            className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            Try Again
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen w-full p-4 bg-gray-50">
      <div className="max-w-[1600px] mx-auto">
        {/* Stats Cards */}
        <DemoStats 
          answeredMultiplication={answeredMultiplication}
          correctMultiplication={correctMultiplication}
          answeredDivision={answeredDivision}
          correctDivision={correctDivision}
          answeredAddition={answeredAddition}
          correctAddition={correctAddition}
          answeredSubtraction={answeredSubtraction}
          correctSubtraction={correctSubtraction}
          results={results}
        />

        {/* Progress bar and question counter */}
        <div className="mb-6">
          <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
            <div 
              className="bg-blue-600 h-2.5 rounded-full" 
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
          <div className="text-gray-500 text-sm font-medium">
            Fråga {currentQuestionIndex + 1} av {questions.length}
          </div>
        </div>

        {/* Main content area with three-column layout */}
        <div className="flex gap-6">
          {/* Left column - Question and Answers */}
          <div className="flex-1 min-w-[500px]">
            {/* Question Box */}
            <div className="bg-white rounded-lg p-6 shadow-sm mb-6">
              <QuestionBox latexString={currentQuestion.question} />
            </div>

            {/* Answer grid */}
            <div className="grid grid-cols-2 gap-4">
              {currentQuestion.options.map((option) => (
                <AnswerButton 
                  key={option.id}
                  latexString={option.latex} 
                  isSelected={selectedAnswer === option.id}
                  isCorrect={showAnswer && option.isCorrect}
                  onClick={() => handleAnswerClick(option.id)}
                  textSize="text-3xl"
                />
              ))}
            </div>

            {/* Controls */}
            <div className="flex justify-center mt-6 gap-4">
              {!showAnswer ? (
                <>
                  <SmallButton 
                    text="Hoppa över"
                    onClick={handleSkip}
                    className="bg-gray-600 hover:bg-gray-700"
                    icon={<ChevronDoubleRightIcon className="w-5 h-5" />}
                  />
                  <SmallButton 
                    text="Svara"
                    onClick={handleCheckAnswer}
                    icon={<ChevronRightIcon className="w-5 h-5" />}
                    className={
                      selectedAnswer !== null
                        ? "bg-blue-600 hover:bg-blue-700"
                        : "bg-gray-300 text-gray-500 cursor-not-allowed"
                    }
                  />
                </>
              ) : (
                <SmallButton 
                  text={currentQuestionIndex < questions.length - 1 ? "Nästa fråga" : "Avsluta quiz"}
                  onClick={handleNextQuestion}
                  className="bg-green-600 hover:bg-green-700"
                />
              )}
            </div>
          </div>

          {/* Right column - Quiz Assistant */}
          <div className="w-[450px]">
            <QuizAssistant VideoName={currentQuestion.explanation} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Demo;