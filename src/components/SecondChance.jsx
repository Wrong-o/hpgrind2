import React, { useEffect, useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import 'katex/dist/katex.min.css';
import Latex from '@matejmazur/react-katex';
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
export const SecondChance = ({
  onBack
}) => {
  const [incorrectQuestions, setIncorrectQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showExplanation, setShowExplanation] = useState({});
  const {
    token
  } = useAuth();
  useEffect(() => {
    const fetchIncorrectQuestions = async () => {
      try {
        const response = await fetch(`${import.meta.env.VITE_API_URL}/api/user/history/incorrect`, {
          headers: {
            'Authorization': `Bearer ${token}`,
            'Accept': 'application/json'
          },
          credentials: 'include'
        });
        if (!response.ok) {
          throw new Error('Failed to fetch incorrect questions');
        }
        const data = await response.json();
        setIncorrectQuestions(data);
      } catch (error) {
        console.error('Error fetching incorrect questions:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchIncorrectQuestions();
  }, [token]);
  const handleAnswer = async (questionId, answer, question) => {
    if (selectedAnswers[questionId]) return; // Prevent multiple selections

    setSelectedAnswers(prev => ({
      ...prev,
      [questionId]: answer
    }));
    setShowExplanation(prev => ({
      ...prev,
      [questionId]: true
    }));

    // If answer is correct, save the attempt and remove the question
    if (answer === question.correct_answer) {
      try {
        // Prepare the question data
        const questionData = {
          id: question.id,
          subject: question.subject,
          category: question.category,
          moment: question.moment,
          difficulty: question.difficulty,
          question: question.question,
          answers: question.answers,
          correct_answer: question.correct_answer,
          explanation: question.explanation
        };

        // Prepare the attempt data with explicit type conversions
        const attemptData = {
          subject: String(question.subject),
          category: String(question.category),
          moment: String(question.moment),
          difficulty: Number(question.difficulty),
          skipped: false,
          time: 0,
          is_correct: true,
          question_data: JSON.stringify(questionData)
        };

        // Save the attempt
        try {
          console.log('\n=== Frontend Debug ===');
          console.log('Raw question data:', question);
          console.log('Prepared question data:', questionData);
          console.log('Attempt data:', attemptData);
          console.log('Request body:', JSON.stringify(attemptData));
          const response = await fetch(`${import.meta.env.VITE_API_URL}/api/attempts`, {
            method: 'POST',
            headers: {
              'Authorization': `Bearer ${token}`,
              'Content-Type': 'application/json',
              'Accept': 'application/json'
            },
            credentials: 'include',
            body: JSON.stringify(attemptData)
          });
          const responseData = await response.json();
          if (!response.ok) {
            console.log('\n=== Response Error ===');
            console.log('Status:', response.status);
            console.log('Status text:', response.statusText);
            console.log('Response data:', responseData);
            throw new Error(`Failed to save attempt: ${JSON.stringify(responseData)}`);
          }

          // Remove the question after a delay to show the feedback
          setTimeout(() => {
            setIncorrectQuestions(prev => prev.filter(q => q.id !== questionId));
            setSelectedAnswers(prev => {
              const newAnswers = {
                ...prev
              };
              delete newAnswers[questionId];
              return newAnswers;
            });
            setShowExplanation(prev => {
              const newExplanations = {
                ...prev
              };
              delete newExplanations[questionId];
              return newExplanations;
            });
          }, 2000);
        } catch (error) {
          console.error('Error saving attempt:', error);
        }
      } catch (error) {
        console.error('Error saving attempt:', error);
      }
    }
  };
  if (loading) {
    return /*#__PURE__*/_jsx("div", {
      className: "flex items-center justify-center min-h-screen",
      children: /*#__PURE__*/_jsx("div", {
        className: "animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"
      })
    });
  }
  if (incorrectQuestions.length === 0) {
    return /*#__PURE__*/_jsxs("div", {
      className: "w-full max-w-4xl px-4 py-8 relative",
      children: [/*#__PURE__*/_jsx("button", {
        onClick: onBack,
        className: "absolute top-4 left-4 px-4 py-2 bg-blue-600 text-white  rounded-lg hover:bg-blue-700 transition-colors",
        children: "Tillbaka"
      }), /*#__PURE__*/_jsxs("div", {
        className: "text-center mt-16",
        children: [/*#__PURE__*/_jsx("h2", {
          className: "text-2xl font-bold text-blue-600 mb-4",
          children: "Andra chansen"
        }), /*#__PURE__*/_jsx("p", {
          className: "text-xl text-teal-700",
          children: "Du har inga felaktiga svar att \xF6va p\xE5 just nu. Bra jobbat!"
        })]
      })]
    });
  }
  return /*#__PURE__*/_jsxs("div", {
    className: "w-full max-w-4xl px-4 py-8 relative",
    children: [/*#__PURE__*/_jsx("button", {
      onClick: onBack,
      className: "absolute top-4 left-4 px-4 py-2 bg-blue-600 text-white  rounded-lg hover:bg-blue-700 transition-colors",
      children: "Tillbaka"
    }), /*#__PURE__*/_jsxs("div", {
      className: "space-y-4 mt-16",
      children: [/*#__PURE__*/_jsx("h2", {
        className: "text-2xl font-bold text-blue-600 mb-4 text-center",
        children: "Andra chansen"
      }), /*#__PURE__*/_jsx("div", {
        className: "grid gap-4",
        children: incorrectQuestions.map(question => /*#__PURE__*/_jsxs("div", {
          className: "bg-white/50 backdrop-blur-sm rounded-xl p-6 shadow-lg",
          children: [/*#__PURE__*/_jsxs("div", {
            className: "text-sm text-teal-600 mb-2",
            children: [question.moment, " \u2022 Sv\xE5righetsgrad ", question.difficulty, "/5"]
          }), /*#__PURE__*/_jsx("div", {
            className: "text-lg text-blue-600 mb-4",
            children: formatQuestion(question.question)
          }), /*#__PURE__*/_jsx("div", {
            className: "grid grid-cols-2 gap-4",
            children: question.answers.map((answer, index) => /*#__PURE__*/_jsx("button", {
              onClick: () => handleAnswer(question.id, answer, question),
              disabled: !!selectedAnswers[question.id],
              className: `px-4 py-3 rounded-lg min-h-[80px]
                             flex items-center justify-center transition-colors
                             ${selectedAnswers[question.id] === answer ? answer === question.correct_answer ? 'bg-green-500 text-white' : 'bg-red-500 text-white' : selectedAnswers[question.id] ? 'bg-blue-500/50 text-white cursor-not-allowed' : 'bg-blue-500 text-white hover:bg-blue-600'}`,
              children: /*#__PURE__*/_jsx("div", {
                className: "text-xl",
                children: /*#__PURE__*/_jsx(Latex, {
                  math: answer.slice(1, -1)
                })
              })
            }, index))
          }), showExplanation[question.id] && /*#__PURE__*/_jsxs("div", {
            className: `mt-4 p-4 rounded-lg ${selectedAnswers[question.id] === question.correct_answer ? 'bg-green-100' : 'bg-red-100'}`,
            children: [/*#__PURE__*/_jsx("h3", {
              className: "font-bold mb-2 text-lg",
              children: selectedAnswers[question.id] === question.correct_answer ? 'Bra jobbat!' : 'Nästan rätt!'
            }), /*#__PURE__*/_jsx("div", {
              className: "text-lg whitespace-pre-line",
              children: question.explanation.split(/(\$[^$]+\$)/).map((part, index) => {
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
          })]
        }, question.id))
      })]
    })]
  });
};
