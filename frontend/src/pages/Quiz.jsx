import React, { useState, useEffect, useRef } from 'react';
import QuestionBox from '../components/quiz-components/QuestionBox';
import AnswerButton from '../components/quiz-components/AnswerButton';
import LoadingScreen from '../components/LoadingScreen';
import ResultPage from '../components/quiz-components/ResultPage';
import authStore from '../store/authStore';
import SkipButton from '../components/quiz-components/SkipButton';
import QuizAssistant from '../components/quiz-components/QuizAssistant';
import SmallButton from '../components/SmallButton';
import { ChevronDoubleRightIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
const Quiz = () => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [skipped, setSkipped] = useState(false);
  const [quizCompleted, setQuizCompleted] = useState(false);
  const [results, setResults] = useState([]);
  const fetchedRef = useRef(false);
  const startTimeRef = useRef(Date.now());
  
  useEffect(() => {
    // Only run if not already fetched - prevents duplicate calls in StrictMode
    if (fetchedRef.current) return;
    
    fetchQuestions();
  }, []);
  
  // Reset timer when moving to a new question
  useEffect(() => {
    startTimeRef.current = Date.now();
  }, [currentQuestionIndex]);
  
  // Define fetchQuestions as async function
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      
      // Number of questions to fetch
      const questionCount = 5;
      
      const requestBody = {
        moment: "basics_fraktioner_dividera",
        difficulty: 2,
        count: questionCount
      };
      
      // Single API call to fetch multiple questions - batch endpoint is faster!
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/question_generator/batch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });
      
      
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`HTTP error! Status: ${response.status}. Details: ${errorText}`);
      }
      
      // Parse all questions at once
      const questionsData = await response.json();
      
      // Format the questions
      const formattedQuestions = questionsData.map((data, i) => ({
        id: i,
        question: data.question,
        options: data.answers.map((answer, index) => ({
          id: index,
          latex: answer.toString(),
          isCorrect: answer.toString() === data.correct_answer
        })),
        explanation: data.explanation,
        subject: data.subject,
        category: data.category,
        difficulty: data.difficulty,
        moment: data.moment || "operations_order" // Ensure moment is available
      }));
      
      setQuestions(formattedQuestions);
      setLoading(false);
      fetchedRef.current = true;
    } catch (err) {
      setError("Failed to load questions. Please try again.");
      setLoading(false);
    }
  };
  
  const handleAnswerClick = (id) => {
    setSelectedAnswer(id);
  };
  
  
  const handleCheckAnswer = async () => {
    setShowAnswer(true);
    
    // Calculate time spent on this question
    const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
    
    // Get the current question data
    const question = questions[currentQuestionIndex];
    // Get the selected option
    const selectedOption = question.options[selectedAnswer];
    
    const answerResult = {
      correct: selectedOption.isCorrect,
      timeSpent: timeSpent,
      skipped: skipped
    };
    
    setResults(prev => [...prev, answerResult]);
    
    // Don't submit answers if not logged in
    if (!authStore.getState().isLoggedIn) {
      return;
    }
    
    try {
      const answerData = {
        token: authStore.getState().token,
        subject: question.subject,
        category: question.category,
        moment: question.moment,
        difficulty: question.difficulty,
        skipped: skipped,
        time_spent: timeSpent,
        correct: selectedOption.isCorrect,
      };
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/general/submit_quiz_answer`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authStore.getState().token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(answerData)
      });
      
      const result = await response.json();
    } catch (error) {
    }
  };
  const handleSkip = () => {
    setSkipped(true);
    handleCheckAnswer();
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
    return <ResultPage results={results} />;
  }

  if (loading) {
    return (
      <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-blue-50 to-white">
        <LoadingScreen />
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

export default Quiz;