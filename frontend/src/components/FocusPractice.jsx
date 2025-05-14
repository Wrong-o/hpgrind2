import React, { useState, useEffect, useRef, useCallback } from 'react';
import QuestionBox from '../components/quiz-components/QuestionBox';
import AnswerButton from '../components/quiz-components/AnswerButton';
import QuizAssistant from '../components/quiz-components/QuizAssistant';
import SmallButton from '../components/SmallButton';
import { ChevronDoubleRightIcon, ChevronRightIcon } from '@heroicons/react/24/outline';
import { useSound } from '../contexts/SoundContext';
import LinearEquationQuestion from './quiz-components/LinearEquationQuestion';

const FocusPractice = ({ moment, onClose }) => {
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
  const fetchedRef = useRef(false);
  
  useEffect(() => {
    // Only run if not already fetched - prevents duplicate calls in StrictMode
    if (fetchedRef.current) return;
    
    fetchQuestions();
  }, [moment]); // Re-fetch when moment changes
  
  // Reset timer when moving to a new question
  useEffect(() => {
    startTimeRef.current = Date.now();
  }, [currentQuestionIndex]);
  
  // Define fetchQuestions as async function
  const fetchQuestions = async () => {
    try {
      setLoading(true);
      
      // Number of questions to fetch
      const questionCount = 3;
      
      const requestBody = {
        moments: [
          {
            moment: moment,
            probability: 1.0
          }
        ],
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
      
      // Log the question data for debugging
      console.log("FocusPractice - Questions from API:", questionsData);
      
      // Format the questions
      const formattedQuestions = questionsData.map((data, i) => {
        console.log(`FocusPractice - Processing question ${i}:`, data);
        
        // Check if this is a linear equation by examining the data
        const isLinear = data.graph_data || 
                        data.category === "Linear Equations" ||
                        (data.question && (
                          /^-?\d*x\s*[+-]\s*\d+\s*=\s*-?\d+$/.test(data.question) ||
                          /if\s*x\s*=.*find\s*y/i.test(data.question)
                        ));
        
        if (isLinear) {
          console.log(`FocusPractice - Question ${i} identified as linear equation`);
        }
        
        // Process graph_data if it exists or needs to be generated
        let graphData = data.graph_data;
        
        // For linear equations without graph_data, try to generate it
        if (isLinear && !graphData) {
          console.log(`FocusPractice - Generating graph_data for linear equation question ${i}`);
          
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
          subject: data.subject,
          category: data.category,
          difficulty: data.difficulty,
          moment: data.moment || moment, // Use provided moment as fallback
          // Include graph_data if it exists or we created it
          ...(graphData && { graph_data: graphData })
        };
      });
      
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
    const selectedOption = question.options.find(option => option.id === selectedAnswer);
    
    // Debug logs
    console.log('Selected Answer:', selectedAnswer);
    console.log('Selected Option:', selectedOption);
    console.log('Question Options:', question.options);
    console.log('Correct Answer:', question.options.find(opt => opt.isCorrect));
    
    const isAnswerCorrect = selectedOption?.isCorrect || false;

    // Update the stats based on the moment type
    if (question.moment.includes('multiplicera')) {
      setAnsweredMultiplication(prev => prev + 1);
      if (isAnswerCorrect) {
        setCorrectMultiplication(prev => prev + 1);
        playCorrectSound();
      } else {
        playWrongSound();
      }
    } else if (question.moment.includes('dividera')) {
      setAnsweredDivision(prev => prev + 1);
      if (isAnswerCorrect) {
        setCorrectDivision(prev => prev + 1);
        playCorrectSound();
      } else {
        playWrongSound();
      }
    } else if (question.moment.includes('addera')) {
      setAnsweredAddition(prev => prev + 1);
      if (isAnswerCorrect) {
        setCorrectAddition(prev => prev + 1);
        playCorrectSound();
      } else {
        playWrongSound();
      }
    } else if (question.moment.includes('subtrahera')) {
      setAnsweredSubtraction(prev => prev + 1);
      if (isAnswerCorrect) {
        setCorrectSubtraction(prev => prev + 1);
        playCorrectSound();
      } else {
        playWrongSound();
      }
    }

    // Calculate time spent on this question
    const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000);
    
    const answerResult = {
      correct: isAnswerCorrect,
      timeSpent: timeSpent,
      skipped: skipped,
      category: question.moment
    };

    setResults(prev => [...prev, answerResult]);
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

  // Helper function to determine if a question is a linear equation
  const isLinearEquation = (questionObj) => {
    if (!questionObj) return false;
    
    // For debugging in console
    console.log("FocusPractice - Checking if question is linear equation:", questionObj);
    
    // Most reliable: Check for graph_data field first
    if (questionObj?.graph_data) {
      console.log("FocusPractice - Found graph_data, identified as linear equation");
      return true;
    }
    
    // Check the moment to identify linear equation questions
    if (questionObj.moment) {
      if (questionObj.moment.includes('linear') || 
          questionObj.moment.includes('find_x') || 
          questionObj.moment.includes('find_y')) {
        console.log("FocusPractice - Identified as linear equation by moment:", questionObj.moment);
        return true;
      }
    }
    
    // Check category
    if (questionObj.category === "Linear Equations") {
      console.log("FocusPractice - Identified as linear equation by category");
      return true;
    }
    
    // If it's a question object from the server
    if (typeof questionObj === 'object' && questionObj.question) {
      // If it's just a string question, use regex to determine
      const questionText = questionObj.question;
      
      // More comprehensive regex patterns to handle different equation formats
      // For find-x type questions
      const findXRegex = /^-?\d*x\s*[+-]\s*\d+\s*=\s*-?\d+$/;
      const findXRelaxedRegex = /-?\d*x\s*[+-]\s*\d+\s*=\s*-?\d+/;
      
      // For find-y type questions
      const findYRegex = /if\s*x\s*=.*find\s*y/i;
      
      const result = findXRegex.test(questionText) || 
                    findXRelaxedRegex.test(questionText) || 
                    findYRegex.test(questionText);
                    
      console.log("FocusPractice - Question text check result:", result);
      return result;
    }
    
    return false;
  };

  if (quizCompleted) {
    return (
      <div className="absolute inset-0 z-50 bg-white p-8">
        <div className="max-w-2xl mx-auto">
          <h2 className="text-2xl font-bold mb-6 text-center">Resultat</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <p className="text-lg text-gray-600">Andel rätt</p>
              <p className="text-4xl font-bold text-blue-600">
                {Math.round((results.filter(r => r.correct).length / results.length) * 100)}%
              </p>
            </div>
            
            <div className="bg-blue-50 p-6 rounded-lg text-center">
              <p className="text-lg text-gray-600">Rätt svar</p>
              <p className="text-4xl font-bold text-blue-600">
                {results.filter(r => r.correct).length}/{results.length}
              </p>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <button
              onClick={() => {
                setQuizCompleted(false);
                setCurrentQuestionIndex(0);
                setResults([]);
                setSelectedAnswer(null);
                setShowAnswer(false);
                setSkipped(false);
                fetchQuestions();
                startTimeRef.current = Date.now();
                fetchedRef.current = false;
              }}
              className="px-8 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium"
            >
              Tre till
            </button>
            <button
              onClick={onClose}
              className="px-8 py-3 bg-gray-600 text-white rounded-lg hover:bg-gray-700 transition-colors font-medium"
            >
              Avsluta
            </button>
          </div>
        </div>
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
      {/* Add the debug component */}
      {process.env.NODE_ENV !== 'production' && (
        <LinearEquationDebug
          questions={questions}
          currentIndex={currentQuestionIndex}
        />
      )}
      
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
            <QuizAssistant VideoName={currentQuestion.explanation} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default FocusPractice;