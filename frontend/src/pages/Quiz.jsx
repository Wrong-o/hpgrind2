import React, { useState, useEffect, useRef, useCallback } from 'react';
import QuestionBox from '../components/quiz-components/QuestionBox';
import AnswerButton from '../components/quiz-components/AnswerButton';
import LoadingScreen from '../components/LoadingScreen';
import ResultPage from '../components/quiz-components/ResultPage';
import authStore from '../store/authStore';
import QuizAssistant from '../components/quiz-components/QuizAssistant';
import SmallButton from '../components/SmallButton';
import { ChevronDoubleRightIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useSound } from '../contexts/SoundContext';
import { useDatabase } from '../contexts/DatabaseContext';
import LinearEquationQuestion from '../components/quiz-components/LinearEquationQuestion';

// Helper function to determine if a question is a linear equation
const isLinearEquation = (questionObj) => {
  if (!questionObj) return false;
  
  // For debugging in console
  console.log("Checking if question is linear equation:", questionObj);
  
  // IMPORTANT: Specifically exclude addition and subtraction equations
  if (questionObj.moment) {
    if (questionObj.moment.includes('addition') || 
        questionObj.moment.includes('subtraction') ||
        questionObj.moment.includes('ekvationslösning_addition') ||
        questionObj.moment.includes('ekvationslösning_subtraktion')) {
      console.log("Identified as non-linear equation (addition/subtraction)");
      return false;
    }
  }
  
  // Most reliable: Check for graph_data field first
  if (questionObj?.graph_data) {
    console.log("Found graph_data, identified as linear equation");
    return true;
  }
  
  // Check the moment to identify linear equation questions
  if (questionObj.moment) {
    if (questionObj.moment.includes('linear') || 
        questionObj.moment.includes('find_x') || 
        questionObj.moment.includes('find_y') ||
        questionObj.moment.includes('ekvationer_linjer_ekvation')) {
      console.log("Identified as linear equation by moment:", questionObj.moment);
      return true;
    }
  }
  
  // Check category
  if (questionObj.category === "Linear Equations") {
    console.log("Identified as linear equation by category");
    return true;
  }
  
  // Check for specific x-equation moments that should NOT use the graph component
  if (questionObj.moment && (
      questionObj.moment.includes('x_equation_addition') ||
      questionObj.moment.includes('x_equation_subtraction'))) {
    console.log("Explicitly excluding x-equation addition/subtraction from graph component");
    return false;
  }
  
  // If it's just a string question, use regex to determine
  if (typeof questionObj === 'string') {
    // Check for addition/subtraction equation patterns to exclude
    if (questionObj.includes('x -') || questionObj.includes('x +')) {
      if (questionObj.match(/x\s*[+-]\s*\d+\s*=/) || 
          questionObj.match(/x\s*=.*[+-]/)) {
        console.log("Excluding addition/subtraction equation from graph rendering");
        return false;
      }
    }
    
    // More comprehensive regex patterns to handle different equation formats
    // For find-x type questions: pattern like "2x + 3 = 5" or "-x - 2 = 10"
    const findXRegex = /^-?\d*x\s*[+-]\s*\d+\s*=\s*-?\d+$/;
    const findXRelaxedRegex = /-?\d*x\s*[+-]\s*\d+\s*=\s*-?\d+/;
    
    // For find-y type questions
    const findYRegex = /if\s*x\s*=.*find\s*y/i;
    
    const result = findXRegex.test(questionObj) || 
                  findXRelaxedRegex.test(questionObj) || 
                  findYRegex.test(questionObj);
                  
    console.log("String question check result:", result);
    return result;
  }
  
  // If it's a question object from the server
  if (typeof questionObj === 'object' && questionObj.question) {
    // Check for addition/subtraction equation patterns to exclude
    const questionText = questionObj.question;
    if (questionText.includes('x -') || questionText.includes('x +')) {
      if (questionText.match(/x\s*[+-]\s*\d+\s*=/) || 
          questionText.match(/x\s*=.*[+-]/)) {
        console.log("Excluding addition/subtraction equation from graph rendering");
        return false;
      }
    }
    
    // Check with multiple regex patterns
    const findXRegex = /^-?\d*x\s*[+-]\s*\d+\s*=\s*-?\d+$/;
    const findXRelaxedRegex = /-?\d*x\s*[+-]\s*\d+\s*=\s*-?\d+/;
    const findYRegex = /if\s*x\s*=.*find\s*y/i;
    
    const result = findXRegex.test(questionObj.question) || 
                  findXRelaxedRegex.test(questionObj.question) || 
                  findYRegex.test(questionObj.question);
                  
    console.log("Object question check result:", result);
    return result;
  }
  
  console.log("Not identified as linear equation");
  return false;
};

const Quiz = () => {
  const { refreshUserData } = useDatabase();
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
  const { isMuted } = useSound();
  
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

      // List of available moments with equal probabilities
      // Add linear equation moments to ensure they're included in the mix
      const moments = [
        {
          moment: "basics_fraktioner_dividera",
          probability: 0.2
        },
        {
          moment: "basics_fraktioner_multiplicera",
          probability: 0.2
        },
        {
          moment: "basics_fraktioner_addera",
          probability: 0.2
        },
        {
          moment: "basics_fraktioner_subtrahera",
          probability: 0.2
        },
        {
          moment: "ekvationer_linjer_ekvation_x",
          probability: 0.1
        },
        {
          moment: "ekvationer_linjer_ekvation_y",
          probability: 0.1
        }
      ];
      
      const requestBody = {
        moments: moments,
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
      
      // Log the questions data to debug
      console.log("Questions from API:", questionsData);
      
      // Format the questions
      const formattedQuestions = questionsData.map((data, i) => {
        console.log(`Processing question ${i}:`, data);
        
        // Ensure the graph_data is preserved if it exists
        let graphData = data.graph_data;
        
        // For category "Linear Equations" questions, ensure they have graph_data
        if (data.category === "Linear Equations" && !graphData) {
          console.log(`Adding default graph_data for linear equation question ${i}`);
          
          // Try to parse the equation to extract parameters
          let k = 1, m = 0, x = 0, y = 0;
          
          if (data.question.includes("find y")) {
            // For find-y questions, try to extract values
            const xMatch = data.question.match(/if\s*x\s*=\s*(-?\d+)/i);
            if (xMatch) {
              x = parseInt(xMatch[1]);
            }
            
            // Extract k and m from the equation part
            const eqMatch = data.question.match(/equation:?\s*(-?\d*)x\s*([+-])\s*(\d+)\s*=\s*y/i);
            if (eqMatch) {
              k = eqMatch[1] === "-" ? -1 : (parseInt(eqMatch[1]) || 1);
              m = (eqMatch[2] === "-" ? -1 : 1) * parseInt(eqMatch[3]);
            }
            
            // Calculate y = kx + m
            y = k * x + m;
          } else {
            // For find-x questions, try to extract values
            const match = data.question.match(/^(-?\d*)x\s*([+-])\s*(\d+)\s*=\s*(-?\d+)$/);
            if (match) {
              k = match[1] === "-" ? -1 : (parseInt(match[1]) || 1);
              m = (match[2] === "-" ? -1 : 1) * parseInt(match[3]);
              y = parseInt(match[4]);
              x = (y - m) / k;
            }
          }
          
          graphData = { k, m, x, y };
        }
        
        return {
          id: i,
          question: data.question,
          options: data.answers.map((answer, index) => ({
            id: index,
            latex: answer.toString(),
            isCorrect: answer.toString() === data.correct_answer
          })),
          explanation: data.explanation,
          subject: data.subject || "Mathematics", // Default subject if not provided
          category: data.category || "General", // Default category if not provided
          moment: data.moment || "",
          difficulty: data.difficulty || 2, // Store difficulty, default to 2 if not provided
          // Pass through graph_data if it exists or we created it
          ...(graphData && { graph_data: graphData })
        };
      });
      
      console.log("Formatted questions:", formattedQuestions);
      
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
    
    // Get the current question data
    const question = questions[currentQuestionIndex];
    // Get the selected option
    const selectedOption = question.options[selectedAnswer];
    
    // Play the appropriate sound
    if (selectedOption.isCorrect) {
      playCorrectSound();
    } else {
      playWrongSound();
    }

    // Calculate time spent on this question
    const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
    
    const answerResult = {
      correct: selectedOption.isCorrect,
      timeSpent: timeSpent,
      skipped: skipped,
      category: question.category || '',
      moment: question.moment || ''
    };
    
    setResults(prev => [...prev, answerResult]);
    
    // Don't submit answers if not logged in
    if (!authStore.getState().isLoggedIn) {
      return;
    }
    
    try {
      const answerData = {
        subject: question.subject,
        category: question.category,
        moment: question.moment,
        difficulty: question.difficulty || 2, // Use default difficulty if not set
        skipped: skipped,
        time_spent: timeSpent,
        correct: selectedOption.isCorrect,
      };
      
      console.log('Submitting answer data:', answerData); // Add logging to debug
      
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/v1/general/submit_quiz_answer`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${authStore.getState().token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(answerData)
      });
      
      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ detail: 'Unknown error' }));
        console.error('Error submitting answer:', response.status, errorData);
        throw new Error(`Failed to submit answer: ${errorData.detail || response.statusText}`);
      }
      
      const result = await response.json();
      console.log('Answer submission result:', result);
      
      // Refresh user history after submitting the answer
      // Wait a short delay to allow the server to process the submission
      setTimeout(() => refreshUserData(), 500);
    } catch (error) {
      console.error('Error in answer submission:', error);
    }
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
      // Quiz completed - refresh stats
      if (authStore.getState().isLoggedIn) {
        setTimeout(() => refreshUserData(), 1000); // Refresh all user data after a short delay
      }
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
    <div className="min-h-screen w-full p-4 bg-gray-100">
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
              {isLinearEquation(currentQuestion) ? (
                <LinearEquationQuestion 
                  latexString={currentQuestion.question}
                  momentType={currentQuestion.moment || ''}
                  graphData={currentQuestion.graph_data}
                />
              ) : (
                <QuestionBox latexString={currentQuestion.question} />
              )}
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
            <QuizAssistant VideoName={currentQuestion.explanation} Question={currentQuestion.question} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default Quiz;
