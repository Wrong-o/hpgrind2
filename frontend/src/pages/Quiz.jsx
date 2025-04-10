import React, { useState, useEffect, useRef } from 'react';
import QuestionBox from '../components/quiz-components/QuestionBox';
import AnswerButton from '../components/quiz-components/AnswerButton';
import LoadingScreen from '../components/LoadingScreen';
import authStore from '../store/authStore';
import SkipButton from '../components/quiz-components/SkipButton';
import QuizAssistant from '../components/quiz-components/QuizAssistant';
const Quiz = () => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showAnswer, setShowAnswer] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [skipped, setSkipped] = useState(false);
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
        moment: "fraction_equation",
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
    
    // Don't submit answers if not logged in
    if (!authStore.getState().isLoggedIn) {
      return;
    }
    
    try {
      // Calculate time spent on this question
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
      
      // Get the current question data
      const question = questions[currentQuestionIndex];
      // Get the selected option
      const selectedOption = question.options[selectedAnswer];
      
      // Create a customized answer object - only include what you need
      const answerData = {
        // Essential fields for identifying the question
        token: authStore.getState().token,
        subject: question.subject,
        category: question.category,
        moment: question.moment,
        difficulty: question.difficulty,
        skipped: skipped,
        time_spent: timeSpent,
        correct: selectedOption.isCorrect,
      };
      
      
      // Submit the answer
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
    // Move to next question if available
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
    } else {
      // If this is the last question, handle completion
      // You could redirect to a results page or show a completion message
    }
  };

  // Get current question data
  const currentQuestion = questions[currentQuestionIndex] || {
    question: "",
    options: []
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
    <div className="min-h-screen w-full flex items-center justify-center p-4">
      <div className="quiz-container w-full max-w-5xl flex flex-col gap-6 relative">
        <div className="absolute top-4 right-0 z-10 flex gap-2">
          <QuizAssistant VideoName={currentQuestion.explanation} />
        </div>
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
        <div className="w-full bg-blue-200 rounded-lg">
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
              textSize="text-5xl"
            />
          ))}
        </div>
        
        {/* Controls */}
        <div className="flex justify-center mt-4 gap-4">
          {!showAnswer ? (
            <>
              <SkipButton 
                onClick={handleSkip}
                showAnswer={showAnswer} 
              />
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
            </>
          ) : (
            <button 
              onClick={handleNextQuestion}
              className="px-6 py-2 rounded-lg font-medium bg-green-600 hover:bg-green-700 text-white"
            >
              {currentQuestionIndex < questions.length - 1 ? "Nästa fråga" : "Avsluta quiz"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default Quiz;