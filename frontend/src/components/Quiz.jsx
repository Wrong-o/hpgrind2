import React, { useState, useEffect, useRef } from 'react';
import QuestionBox from './quiz-components/QuestionBox';
import AnswerButton from './quiz-components/AnswerButton';
import LoadingScreen from './quiz-components/LoadingScreen';
import authStore from '../store/authStore';
import SkipButton from './quiz-components/SkipButton';
import { VideoPlayer } from './VideoPlayer';
import { Calculator } from './quiz-components/Calculator';

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
  const [videoShowing, setVideoShowing] = useState(false);
  const [videoError, setVideoError] = useState(null);
  const [calculatorShowing, setCalculatorShowing] = useState(false);
  
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
      
      console.log("Fetching questions from batch endpoint...");
      const requestBody = {
        moment: "fraction_equation",
        difficulty: 2,
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
        difficulty: data.difficulty,
        moment: data.moment || "operations_order" // Ensure moment is available
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
  
  const handleAnswerClick = (id) => {
    setSelectedAnswer(id);
  };
  
  
  const handleCheckAnswer = async () => {
    setShowAnswer(true);
    
    // Don't submit answers if not logged in
    if (!authStore.getState().isLoggedIn) {
      console.log("User not logged in. Answer not submitted.");
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
      
      console.log("Submitting answer:", answerData);
      
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
      console.log("Answer submission result:", result);
    } catch (error) {
      console.error("Error submitting answer:", error);
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
      console.log("Quiz completed!");
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
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-blue-50 to-white p-4">
      <div className="quiz-container w-full max-w-4xl flex flex-col gap-6 relative">
        {/* Video and Calculator toggle buttons */}
        <div className="absolute top-0 right-0 z-10 flex gap-2">
          <button
            onClick={() => setCalculatorShowing(!calculatorShowing)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            {calculatorShowing ? (
              <>
                <span>Stäng kalkylator</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </>
            ) : (
              <>
                <span>Kalkylator</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M6 2a2 2 0 00-2 2v12a2 2 0 002 2h8a2 2 0 002-2V4a2 2 0 00-2-2H6zm1 2a1 1 0 000 2h6a1 1 0 100-2H7zm6 7a1 1 0 011 1v3a1 1 0 11-2 0v-3a1 1 0 011-1zm-3 3a1 1 0 100 2h.01a1 1 0 100-2H10zm-4 1a1 1 0 011-1h.01a1 1 0 110 2H7a1 1 0 01-1-1zm1-4a1 1 0 100 2h.01a1 1 0 100-2H7zm2 1a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zm4-4a1 1 0 100 2h.01a1 1 0 100-2H13zM9 9a1 1 0 011-1h.01a1 1 0 110 2H10a1 1 0 01-1-1zM7 8a1 1 0 000 2h.01a1 1 0 000-2H7z" clipRule="evenodd" />
                </svg>
              </>
            )}
          </button>
          <button
            onClick={() => setVideoShowing(!videoShowing)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2"
          >
            {videoShowing ? (
              <>
                <span>Stäng video</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                </svg>
              </>
            ) : (
              <>
                <span>Video exempel</span>
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 6a2 2 0 012-2h6a2 2 0 012 2v8a2 2 0 01-2 2H4a2 2 0 01-2-2V6zm12.553 1.106A1 1 0 0014 8v4a1 1 0 00.553.894l2 1A1 1 0 0018 13V7a1 1 0 00-1.447-.894l-2 1z" />
                </svg>
              </>
            )}
          </button>
        </div>

        {/* Calculator container */}
        {calculatorShowing && (
          <div className="absolute top-14 right-0 w-[300px] rounded-lg overflow-hidden shadow-lg z-20">
            <Calculator />
          </div>
        )}

        {/* Video player container */}
        {videoShowing && currentQuestion.explanation && (
          <div className="absolute top-14 right-0 w-64 aspect-video rounded-lg overflow-hidden shadow-lg z-10">
            <VideoPlayer
              autoPlay={true}
              loop={true}
              controls={true}
              src={`${import.meta.env.BASE_URL}videos/${currentQuestion.explanation}`}
              className="w-full h-full object-cover"
              onError={(e) => {
                console.error("Video playback error:", e);
                console.error("Video element:", e.target);
                console.error("Video source:", e.target.src);
                setVideoError(`Failed to load video: ${e.target.src}`);
              }}
            />
            {videoError && (
              <div className="absolute bottom-0 left-0 right-0 bg-red-500 text-white text-xs p-1">
                {videoError}
              </div>
            )}
          </div>
        )}

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