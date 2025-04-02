import React, { useState, useEffect, useRef } from 'react';
;
import QuestionBox from './quiz-components/QuestionBox';
import AnswerButton from './quiz-components/AnswerButton';
import LoadingScreen from './quiz-components/LoadingScreen';

const SOUNDS = {
};

const Quiz = () => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const fetchedRef = useRef(false);
  
  useEffect(() => {
    // Only run if not already fetched - prevents duplicate calls in StrictMode
    if (fetchedRef.current) return;
    
    fetchQuestions();
  }, []);
  
  // Define fetchQuestions as async function
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      
      // Number of questions to fetch
      const questionCount = 5;
      
      console.log("Fetching questions from batch endpoint...");
      const requestBody = {
        moment: "operations_order",
        difficulty: 1,
        count: questionCount
      };
      console.log("Request body:", requestBody);
      
      // Single API call to fetch multiple questions - batch endpoint is faster!
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/question_generator/batch`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(requestBody)
      });
      
      console.log("Response status:", response.status);
      console.log("Response headers:", Object.fromEntries([...response.headers.entries()]));
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error("Error response:", errorText);
        throw new Error(`HTTP error! Status: ${response.status}. Details: ${errorText}`);
      }
      
      // Parse all questions at once
      const questionsData = await response.json();
      console.log("Received questions data:", questionsData);
      
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
        difficulty: data.difficulty
      }));
      
      console.log("Formatted questions:", formattedQuestions);
      setQuestions(formattedQuestions);
      setLoading(false);
      fetchedRef.current = true;
    } catch (err) {
      console.error("Failed to fetch questions:", err);
      setError("Failed to load questions. Please try again.");
      setLoading(false);
    }
  };
  
  // Get current question data
  const currentQuestion = questions[currentQuestionIndex] || {
    question: "",
    options: []
  };
  
  const handleAnswerClick = (id) => {
    setSelectedAnswer(id);
  };
  
  const handleCheckAnswer = () => {
    setShowAnswer(true);
  };
  
  const handleNextQuestion = () => {
    setSelectedAnswer(null);
    setShowAnswer(false);
    
    // Move to next question if available
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    }
  };

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
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="quiz-container w-full max-w-4xl flex flex-col gap-6">
        {/* Progress indicator */}
        <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
          <div 
            className="bg-blue-600 h-2.5 rounded-full" 
            style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
          ></div>
        </div>
        
        <div className="text-gray-500 text-sm font-medium">
          Fråga {currentQuestionIndex + 1} av {questions.length}
        </div>
        
        {/* Question Box - displayed prominently above answers */}
        <div className="w-full">
          <QuestionBox latexString={currentQuestion.question} />
        </div>
        
        {/* Answer grid - responsive layout */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
          {currentQuestion.options.map((option) => (
            <AnswerButton 
              key={option.id}
              latexString={option.latex} 
              isSelected={selectedAnswer === option.id}
              isCorrect={showAnswer && option.isCorrect}
              onClick={() => handleAnswerClick(option.id)}
              className=""
              textSize="text-lg"
            />
          ))}
        </div>
        
        {/* Controls */}
        <div className="flex justify-center mt-4 gap-4">
          {!showAnswer ? (
            <button 
              onClick={handleCheckAnswer}
              disabled={selectedAnswer === null}
              className={`px-6 py-2 rounded-lg font-medium ${
                selectedAnswer !== null
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-gray-300 text-gray-500 cursor-not-allowed"
              }`}
            >
              Kolla svar
            </button>
          ) : (
            <button 
              onClick={handleNextQuestion}
              className="px-6 py-2 rounded-lg font-medium bg-green-600 hover:bg-green-700 text-white"
            >
              {currentQuestionIndex < questions.length - 1 ? "Next Question" : "Finish Quiz"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;