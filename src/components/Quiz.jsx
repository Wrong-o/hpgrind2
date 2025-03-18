import React, { useState, useEffect } from 'react';
import 'katex/dist/katex.min.css';
import Latex from '@matejmazur/react-katex';
import { DrawingBoard } from './DrawingBoard';
import { Calculator } from './Calculator';
import { useSound } from '../contexts/SoundContext';
import { useAuth } from '../contexts/AuthContext';
import { LoadingScreen } from './LoadingScreen';
import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
const formatQuestion = question => {
  // Split the text by $ to separate LaTeX and regular text
  const parts = question.split(/(\$[^$]+\$)/);
  return /*#__PURE__*/_jsx("div", {
    className: "space-y-6 text-center",
    children: /*#__PURE__*/_jsx("div", {
      className: "text-2xl py-4",
      children: parts.map((part, index) => {
        if (part.startsWith('$') && part.endsWith('$')) {
          // Remove the $ symbols and render as LaTeX
          return /*#__PURE__*/_jsx(Latex, {
            math: part.slice(1, -1)
          }, index);
        }
        return /*#__PURE__*/_jsx("span", {
          children: part
        }, index);
      })
    })
  });
};
const getQuestionTypeLabel = type => {
  const labels = {
    'räknelagar': 'Räknelagar',
    'förlänga': 'Förlänga bråk',
    'förkorta': 'Förkorta bråk',
    'adda': 'Addera bråk',
    'multiplicera': 'Multiplicera bråk',
    'division': 'Division',
    'multiplikation': 'Multiplikation',
    'addition': 'Addition',
    'subtraktion': 'Subtraktion'
  };
  const lastPart = type.split('-').pop() || '';
  return labels[lastPart] || lastPart;
};
export const Quiz = ({
  onComplete,
  testType,
  onBack
}) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [isAnswered, setIsAnswered] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120); // 2 minutes per question
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showExplanation, setShowExplanation] = useState(false);
  const [lastAnsweredCorrectly, setLastAnsweredCorrectly] = useState(false);
  const [canProceed, setCanProceed] = useState(false);
  const [showDrawingBoard, setShowDrawingBoard] = useState(false);
  const [showCalculator, setShowCalculator] = useState(false);
  const {
    isMuted,
    toggleMute
  } = useSound();
  const [startTime, setStartTime] = useState(null);
  const {
    token,
    refreshToken
  } = useAuth();
  const [questionTypeCounts, setQuestionTypeCounts] = useState({
    'matematikbasic-räknelagar': {
      total: 0,
      completed: 0
    },
    'matematikbasic-fraktioner-förlänga': {
      total: 0,
      completed: 0
    },
    'matematikbasic-fraktioner-förkorta': {
      total: 0,
      completed: 0
    },
    'matematikbasic-fraktioner-adda': {
      total: 0,
      completed: 0
    },
    'matematikbasic-fraktioner-multiplicera': {
      total: 0,
      completed: 0
    },
    'matematikbasic-ekvationslösning-division': {
      total: 0,
      completed: 0
    },
    'matematikbasic-ekvationslösning-multiplikation': {
      total: 0,
      completed: 0
    },
    'matematikbasic-ekvationslösning-addition': {
      total: 0,
      completed: 0
    },
    'matematikbasic-ekvationslösning-subtraktion': {
      total: 0,
      completed: 0
    }
  });
  const correctSound = new Audio('/sounds/correct.mp3');
  const wrongSound = new Audio('/sounds/wrong.mp3');
  correctSound.volume = isMuted ? 0 : 0.2;
  wrongSound.volume = isMuted ? 0 : 0.2;
  useEffect(() => {
    const fetchQuestions = async () => {
      setLoading(true);
      setError(null);
      try {
        // Fetch 12 questions
        const allQuestions = [];
        for (let i = 0; i < 12; i++) {
          const questionResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/question?type=${testType}`);
          if (!questionResponse.ok) {
            throw new Error('Failed to fetch questions');
          }
          const questionData = await questionResponse.json();
          allQuestions.push(questionData);
        }
        setQuestions(allQuestions);
      } catch (err) {
        setError('Failed to load questions. Please try again.');
        console.error('Error fetching questions:', err);
      }
      setLoading(false);
    };
    fetchQuestions();
  }, [testType]);

  // Set start time when question loads
  useEffect(() => {
    if (questions.length > 0) {
      setStartTime(new Date());
    }
  }, [currentQuestion, questions]);

  // Update the counts when questions are loaded
  useEffect(() => {
    if (testType === 'MATEMATIKBASIC' && questions.length > 0) {
      const counts = {
        ...questionTypeCounts
      };
      questions.forEach(q => {
        if (counts[q.moment]) {
          counts[q.moment].total++;
        }
      });
      setQuestionTypeCounts(counts);
    }
  }, [questions, testType]);
  const handleTokenError = async () => {
    try {
      await refreshToken(); // Implement this in your AuthContext
      return true;
    } catch (error) {
      console.error('Failed to refresh token:', error);
      return false;
    }
  };
  const handleAnswer = async answer => {
    // Remove any whitespace and normalize the strings for comparison
    const normalizedAnswer = answer.trim();
    const normalizedCorrectAnswer = questions[currentQuestion].correct_answer.trim();
    const isCorrect = normalizedAnswer === normalizedCorrectAnswer;
    setLastAnsweredCorrectly(isCorrect);
    setShowExplanation(true);
    setCanProceed(true);
    if (isCorrect) {
      correctSound.play();
      setScore(score + 1);
    } else {
      wrongSound.play();
    }

    // Only try to save if user is logged in
    if (token) {
      const timeTaken = startTime ? Math.round((new Date().getTime() - startTime.getTime()) / 1000) : 0;
      const currentQ = questions[currentQuestion];
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/attempts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
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
        });
        if (response.status === 401) {
          // Token expired, try to refresh
          const refreshed = await handleTokenError();
          if (refreshed) {
            // Retry the request with new token
            // ... retry logic here
          }
        } else if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.error('Failed to save attempt:', error);
      }
    }
    if (testType === 'MATEMATIKBASIC') {
      const currentMoment = questions[currentQuestion].moment;
      setQuestionTypeCounts(prev => ({
        ...prev,
        [currentMoment]: {
          ...prev[currentMoment],
          completed: prev[currentMoment].completed + 1
        }
      }));
    }
  };
  const handleSkip = async () => {
    // Only try to save if user is logged in
    if (token) {
      const timeTaken = startTime ? Math.round((new Date().getTime() - startTime.getTime()) / 1000) : 0;
      const currentQ = questions[currentQuestion];
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/attempts`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
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
        });
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
      } catch (error) {
        console.error('Failed to save skip:', error);
      }
    }
    handleNext();
  };
  const handleNext = () => {
    if (currentQuestion === 11) {
      onComplete(score);
    } else {
      setCurrentQuestion(currentQuestion + 1);
      setShowExplanation(false);
      setCanProceed(false);
    }
  };
  const getDifficultyStars = level => {
    return '★'.repeat(level) + '☆'.repeat(5 - level);
  };
  if (loading) {
    return /*#__PURE__*/_jsx(LoadingScreen, {});
  }
  if (error || questions.length === 0) {
    return /*#__PURE__*/_jsxs("div", {
      className: "text-xl text-red-600",
      children: [error || 'No questions available', /*#__PURE__*/_jsx("button", {
        onClick: () => window.location.reload(),
        className: "block mt-4 px-4 py-2 bg-pink-500 text-white rounded-lg hover:bg-pink-600",
        children: "Try Again"
      })]
    });
  }

  // Make sure we have questions before rendering the quiz interface
  if (!questions[currentQuestion]) {
    return /*#__PURE__*/_jsx(LoadingScreen, {});
  }
  return /*#__PURE__*/_jsxs("div", {
    className: "w-full max-w-4xl p-4",
    onClick: () => setShowCalculator(false),
    children: [/*#__PURE__*/_jsx("div", {
      className: "fixed top-4 right-4 z-[60]",
      children: /*#__PURE__*/_jsx("button", {
        onClick: e => {
          e.stopPropagation();
          toggleMute();
        },
        className: "p-3 bg-white/50 rounded-full hover:bg-white/70 transition-colors",
        title: isMuted ? "Aktivera ljud" : "Stäng av ljud",
        children: isMuted ? /*#__PURE__*/_jsxs("svg", {
          xmlns: "http://www.w3.org/2000/svg",
          className: "h-6 w-6",
          fill: "none",
          viewBox: "0 0 24 24",
          stroke: "currentColor",
          children: [/*#__PURE__*/_jsx("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2,
            d: "M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
          }), /*#__PURE__*/_jsx("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2,
            d: "M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2"
          })]
        }) : /*#__PURE__*/_jsx("svg", {
          xmlns: "http://www.w3.org/2000/svg",
          className: "h-6 w-6",
          fill: "none",
          viewBox: "0 0 24 24",
          stroke: "currentColor",
          children: /*#__PURE__*/_jsx("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2,
            d: "M15.536 8.464a5 5 0 010 7.072m2.828-9.9a9 9 0 010 12.728M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z"
          })
        })
      })
    }), /*#__PURE__*/_jsx("div", {
      className: "fixed top-4 left-4 z-[60]",
      children: /*#__PURE__*/_jsx("button", {
        onClick: e => {
          e.stopPropagation();
          onBack();
        },
        className: "px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors",
        children: "Tillbaka"
      })
    }), /*#__PURE__*/_jsxs("div", {
      className: "fixed left-4 top-1/2 -translate-y-1/2 space-y-4 z-[60]",
      children: [/*#__PURE__*/_jsx("button", {
        onClick: e => {
          e.stopPropagation();
          setShowDrawingBoard(true);
        },
        className: "p-3 bg-white/50 rounded-full hover:bg-white/70 transition-colors",
        title: "Ritbr\xE4da",
        children: /*#__PURE__*/_jsx("svg", {
          xmlns: "http://www.w3.org/2000/svg",
          className: "h-6 w-6",
          fill: "none",
          viewBox: "0 0 24 24",
          stroke: "currentColor",
          children: /*#__PURE__*/_jsx("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2,
            d: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
          })
        })
      }), /*#__PURE__*/_jsx("button", {
        onClick: e => {
          e.stopPropagation();
          setShowCalculator(!showCalculator);
        },
        className: "p-3 bg-white/50 rounded-full hover:bg-white/70 transition-colors",
        title: "Kalkylator",
        children: /*#__PURE__*/_jsx("svg", {
          xmlns: "http://www.w3.org/2000/svg",
          className: "h-6 w-6",
          fill: "none",
          viewBox: "0 0 24 24",
          stroke: "currentColor",
          children: /*#__PURE__*/_jsx("path", {
            strokeLinecap: "round",
            strokeLinejoin: "round",
            strokeWidth: 2,
            d: "M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z"
          })
        })
      })]
    }), showDrawingBoard && /*#__PURE__*/_jsx(DrawingBoard, {
      question: questions[currentQuestion].question,
      onClose: () => setShowDrawingBoard(false),
      currentQuestion: currentQuestion
    }), showCalculator && /*#__PURE__*/_jsx("div", {
      className: "fixed inset-0 flex items-center justify-center z-[70]",
      onClick: () => setShowCalculator(false),
      children: /*#__PURE__*/_jsx("div", {
        onClick: e => e.stopPropagation(),
        children: /*#__PURE__*/_jsx(Calculator, {
          onClose: () => setShowCalculator(false)
        })
      })
    }), /*#__PURE__*/_jsxs("div", {
      className: "bg-white/40 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-teal-100",
      children: [/*#__PURE__*/_jsxs("div", {
        className: "flex justify-between items-center mb-6",
        children: [/*#__PURE__*/_jsxs("div", {
          children: [/*#__PURE__*/_jsxs("h2", {
            className: "text-2xl font-bold text-blue-600",
            children: [testType, " Test"]
          }), /*#__PURE__*/_jsxs("div", {
            className: "text-sm text-teal-600",
            children: [questions[currentQuestion].moment, " \u2022", /*#__PURE__*/_jsx("span", {
              className: "text-yellow-500 ml-2",
              title: `Svårighetsgrad ${questions[currentQuestion].difficulty}/5`,
              children: getDifficultyStars(questions[currentQuestion].difficulty)
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "text-lg font-medium text-teal-700",
          children: ["Fr\xE5ga ", currentQuestion + 1, "/12"]
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "mb-4 text-right text-pink-600",
        children: ["Score: ", score]
      }), testType === 'MATEMATIKBASIC' && /*#__PURE__*/_jsxs("div", {
        className: "mb-6",
        children: [/*#__PURE__*/_jsx("h3", {
          className: "text-lg font-semibold text-blue-600 mb-2",
          children: "Framsteg per omr\xE5de:"
        }), /*#__PURE__*/_jsx("div", {
          className: "grid grid-cols-2 gap-3",
          children: Object.entries(questionTypeCounts).map(([type, count]) => /*#__PURE__*/_jsxs("div", {
            className: `flex justify-between items-center rounded-lg p-3 
                    ${count.completed > 0 ? 'bg-blue-50' : 'bg-white/50'}`,
            children: [/*#__PURE__*/_jsx("span", {
              className: "text-sm font-medium text-gray-700",
              children: getQuestionTypeLabel(type)
            }), /*#__PURE__*/_jsxs("div", {
              className: "flex items-center gap-2",
              children: [/*#__PURE__*/_jsx("div", {
                className: "h-2 w-16 bg-gray-200 rounded-full overflow-hidden",
                children: /*#__PURE__*/_jsx("div", {
                  className: "h-full bg-blue-600 transition-all duration-300",
                  style: {
                    width: `${count.total > 0 ? count.completed / count.total * 100 : 0}%`
                  }
                })
              }), /*#__PURE__*/_jsxs("span", {
                className: "text-sm font-medium text-blue-600 min-w-[3ch] text-right",
                children: [count.completed, "/", count.total]
              })]
            })]
          }, type))
        })]
      }), /*#__PURE__*/_jsxs("div", {
        className: "bg-white/50 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-white/50",
        children: [/*#__PURE__*/_jsx("div", {
          className: "text-2xl text-pink-600 mb-8",
          children: formatQuestion(questions[currentQuestion]?.question || '')
        }), /*#__PURE__*/_jsx("div", {
          className: "grid grid-cols-2 gap-6",
          children: questions[currentQuestion]?.answers.map((option, index) => /*#__PURE__*/_jsx("button", {
            onClick: () => handleAnswer(option),
            className: `px-6 py-4 bg-blue-500 text-white rounded-lg 
                          hover:bg-blue-600 transition-colors min-h-[80px]
                          flex items-center justify-center
                          ${showExplanation ? 'cursor-not-allowed opacity-75' : ''}`,
            disabled: showExplanation,
            children: /*#__PURE__*/_jsx("div", {
              className: "text-xl",
              children: /*#__PURE__*/_jsx(Latex, {
                math: option.slice(1, -1)
              })
            })
          }, index))
        })]
      }), /*#__PURE__*/_jsx("button", {
        onClick: handleSkip,
        className: "mt-4 px-4 py-2 text-gray-600 hover:text-gray-800  transition-colors text-sm underline",
        children: "Klicka h\xE4r ist\xE4llet f\xF6r att chansa"
      }), showExplanation && /*#__PURE__*/_jsxs("div", {
        className: "mt-6",
        children: [/*#__PURE__*/_jsxs("div", {
          className: `p-6 rounded-lg ${lastAnsweredCorrectly ? 'bg-green-100' : 'bg-red-100'}`,
          children: [/*#__PURE__*/_jsx("h3", {
            className: "font-bold mb-4 text-xl",
            children: lastAnsweredCorrectly ? 'Bra jobbat!' : 'Nästan rätt!'
          }), /*#__PURE__*/_jsx("div", {
            className: "text-lg whitespace-pre-line",
            children: questions[currentQuestion].explanation.split(/(\$[^$]+\$)/).map((part, index) => {
              if (part.startsWith('$') && part.endsWith('$')) {
                return /*#__PURE__*/_jsx(Latex, {
                  math: part.slice(1, -1)
                }, index);
              }
              return /*#__PURE__*/_jsx("span", {
                children: part
              }, index);
            })
          })]
        }), canProceed && /*#__PURE__*/_jsx("div", {
          className: "mt-4 flex justify-end",
          children: /*#__PURE__*/_jsx("button", {
            onClick: handleNext,
            className: "px-6 py-2 bg-blue-600 text-white rounded-lg  hover:bg-blue-700 transition-colors",
            children: currentQuestion === 11 ? 'Se resultat' : 'Nästa fråga'
          })
        })]
      })]
    })]
  });
};
