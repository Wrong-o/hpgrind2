import React, { useEffect, useState } from 'react';
import authStore from '../store/authStore';
import 'katex/dist/katex.min.css';
import Latex from '@matejmazur/react-katex';

const formatQuestion = question => {
  // Split the text by $ to separate LaTeX and regular text
  const parts = question.split(/(\$[^$]+\$)/);
  return (
    <div className="space-y-6 text-center">
      <div className="text-2xl py-4">
        {parts.map((part, index) => {
          if (part.startsWith('$') && part.endsWith('$')) {
            // Remove the $ symbols and render as LaTeX
            return <Latex key={index} math={part.slice(1, -1)} />;
          }
          return <span key={index}>{part}</span>;
        })}
      </div>
    </div>
  );
};

export const SecondChance = ({ onBack }) => {
  const [incorrectQuestions, setIncorrectQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedAnswers, setSelectedAnswers] = useState({});
  const [showExplanation, setShowExplanation] = useState({});
  const { token } = authStore();

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
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
      </div>
    );
  }

  if (incorrectQuestions.length === 0) {
    return (
      <div className="w-full max-w-4xl px-4 py-8 relative">
        <button
          onClick={onBack}
          className="absolute top-4 left-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Tillbaka
        </button>
        <div className="text-center mt-16">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">
            Andra chansen
          </h2>
          <p className="text-xl text-teal-700">
            Du har inga felaktiga svar att öva på just nu. Bra jobbat!
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-4xl px-4 py-8 relative">
      <button
        onClick={onBack}
        className="absolute top-4 left-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
      >
        Tillbaka
      </button>

      <div className="space-y-4 mt-16">
        <h2 className="text-2xl font-bold text-blue-600 mb-4 text-center">
          Andra chansen
        </h2>

        <div className="grid gap-4">
          {incorrectQuestions.map(question => (
            <div key={question.id} className="bg-white/50 backdrop-blur-sm rounded-xl p-6 shadow-lg">
              <div className="text-sm text-teal-600 mb-2">
                {question.moment} • Svårighetsgrad {question.difficulty}/5
              </div>

              <div className="text-lg text-blue-600 mb-4">
                {formatQuestion(question.question)}
              </div>

              <div className="grid grid-cols-2 gap-4">
                {question.answers.map((answer, index) => (
                  <button
                    key={index}
                    onClick={() => handleAnswer(question.id, answer, question)}
                    disabled={!!selectedAnswers[question.id]}
                    className={`px-4 py-3 rounded-lg min-h-[80px]
                      flex items-center justify-center transition-colors
                      ${selectedAnswers[question.id] === answer
                        ? answer === question.correct_answer
                          ? 'bg-green-500 text-white'
                          : 'bg-red-500 text-white'
                        : selectedAnswers[question.id]
                          ? 'bg-blue-500/50 text-white cursor-not-allowed'
                          : 'bg-blue-500 text-white hover:bg-blue-600'
                      }`}
                  >
                    <div className="text-xl">
                      <Latex math={answer.slice(1, -1)} />
                    </div>
                  </button>
                ))}
              </div>

              {showExplanation[question.id] && (
                <div
                  className={`mt-4 p-4 rounded-lg ${selectedAnswers[question.id] === question.correct_answer
                      ? 'bg-green-100'
                      : 'bg-red-100'
                    }`}
                >
                  <h3 className="font-bold mb-2 text-lg">
                    {selectedAnswers[question.id] === question.correct_answer
                      ? 'Bra jobbat!'
                      : 'Nästan rätt!'
                    }
                  </h3>
                  <div className="text-lg whitespace-pre-line">
                    {question.explanation.split(/(\$[^$]+\$)/).map((part, index) => {
                      if (part.startsWith('$') && part.endsWith('$')) {
                        return <Latex key={index} math={part.slice(1, -1)} />;
                      }
                      return <span key={index}>{part}</span>;
                    })}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
