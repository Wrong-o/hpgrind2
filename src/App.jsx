import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { FloatingEquations } from './components/FloatingEquations';
import { LoginPage } from './components/LoginPage';
import { RoadMap } from './components/RoadMap';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { CategoryStats } from './components/CategoryStats';
import { SoundProvider } from './contexts/SoundContext';
import { DecisionTree } from './components/DecisionTree';
import { SecondChance } from './components/SecondChance';
import Header from './components/Header';
import { LandingPage } from './components/LandingPage';
import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
const FloatingCards = () => {
  const items = [{
    icon: /*#__PURE__*/_jsx("path", {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      d: "M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
    }),
    title: "Ta reda på vad du behöver kunna",
    description: "HPGrind är resultatet av mina år som privatlärare i högskoleprovet",
    animationDelay: "0s"
  }, {
    icon: /*#__PURE__*/_jsx("path", {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      d: "M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
    }),
    title: "Hitta uppgifter som passar dig",
    description: "Svårt att hitta uppgifter som passar dig? HPGrinds AI genererar frågor för just din profil",
    animationDelay: "0.2s"
  }, {
    icon: /*#__PURE__*/_jsx("path", {
      strokeLinecap: "round",
      strokeLinejoin: "round",
      d: "M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
    }),
    title: "Leta hjälp när du fastnar",
    description: "Få hjälp precis när du vill och på sättet du vill",
    animationDelay: "0.4s"
  }];
  const [solvedStates, setSolvedStates] = useState(new Array(items.length).fill(false));
  const toggleSolved = index => {
    const newStates = [...solvedStates];
    newStates[index] = !newStates[index];
    setSolvedStates(newStates);
  };
  return /*#__PURE__*/_jsxs("div", {
    className: "relative h-[500px] max-w-2xl mx-auto overflow-hidden rounded-xl bg-gradient-to-b from-blue-500/10 to-teal-500/10 backdrop-blur-sm",
    children: [/*#__PURE__*/_jsx(Header, {}), /*#__PURE__*/_jsx("div", {
      className: "flex flex-col gap-4 max-w-2xl mx-auto p-4",
      children: items.map((item, index) => /*#__PURE__*/_jsxs("div", {
        style: {
          animationDelay: item.animationDelay
        },
        className: `error-alert cursor-default flex items-center justify-between w-full h-auto py-4 rounded-lg 
              ${solvedStates[index] ? 'bg-[#232531]/70 animate-drop' : 'bg-[#232531] animate-float'} 
              px-[10px] transition-colors duration-300`,
        children: [/*#__PURE__*/_jsxs("div", {
          className: "flex gap-4",
          children: [/*#__PURE__*/_jsx("div", {
            className: "text-[#d65563] bg-white/5 backdrop-blur-xl p-2 rounded-lg",
            children: /*#__PURE__*/_jsx("svg", {
              xmlns: "http://www.w3.org/2000/svg",
              fill: "none",
              viewBox: "0 0 24 24",
              strokeWidth: "1.5",
              stroke: "currentColor",
              className: "w-8 h-8",
              children: item.icon
            })
          }), /*#__PURE__*/_jsxs("div", {
            className: "text-left",
            children: [/*#__PURE__*/_jsx("p", {
              className: "text-white text-lg font-medium",
              children: item.title
            }), /*#__PURE__*/_jsx("p", {
              className: "text-gray-400",
              children: item.description
            })]
          })]
        }), /*#__PURE__*/_jsxs("div", {
          className: "flex items-center gap-2",
          children: [solvedStates[index] && /*#__PURE__*/_jsx("span", {
            className: "text-green-400 text-sm font-medium",
            children: "L\xF6st"
          }), /*#__PURE__*/_jsx("button", {
            onClick: () => toggleSolved(index),
            className: "text-gray-400 hover:text-white hover:bg-white/10 px-3 py-1 rounded-md transition-colors ease-linear",
            children: "L\xF6sning"
          })]
        })]
      }, index))
    })]
  });
};
function AppContent() {
  const {
    isLoggedIn
  } = useAuth();
  const [showLogin, setShowLogin] = useState(false);
  const [showStats, setShowStats] = useState(false);
  const [showRoadMap, setShowRoadMap] = useState(false);
  const [showDecisionTree, setShowDecisionTree] = useState(false);
  const [showSecondChance, setShowSecondChance] = useState(false);
  const [currentView, setCurrentView] = useState('landing');
  const [currentTest, setCurrentTest] = useState(null);
  const [finalScore, setFinalScore] = useState(0);
  const [question1Answered, setQuestion1Answered] = useState(false);
  const [question2Answered, setQuestion2Answered] = useState(false);
  const [userAchievements, setUserAchievements] = useState([]);
  const [nextRecommendedPath, setNextRecommendedPath] = useState('matematikbasic');
  const [showLandingPage, setShowLandingPage] = useState(!isLoggedIn);

  // Fetch user achievements and determine next recommended path
  useEffect(() => {
    const fetchUserProgress = async () => {
      if (!isLoggedIn) return;
      try {
        // Fetch achievements
        const achievementsResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/user/achievements`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': 'application/json'
          },
          credentials: 'include'
        });
        if (achievementsResponse.ok) {
          const achievements = await achievementsResponse.json();
          const achievementNames = achievements.map(a => a.achievement.name);
          setUserAchievements(achievementNames);

          // Determine next recommended path based on achievements
          if (!achievementNames.includes('Välgrundad')) {
            setNextRecommendedPath('matematikbasic');
          } else if (!achievementNames.includes('Kalibrerad och klar')) {
            setNextRecommendedPath('calibration');
          } else if (!achievementNames.includes('Välformulerad')) {
            setNextRecommendedPath('red-categories');
          } else if (!achievementNames.includes('Formel-1 bladet')) {
            setNextRecommendedPath('yellow-categories');
          }
        }
      } catch (error) {
        console.error('Error fetching user progress:', error);
      }
    };
    fetchUserProgress();
  }, [isLoggedIn]);

  // Add a useEffect to handle landing page visibility based on login status
  useEffect(() => {
    setShowLandingPage(!isLoggedIn);
  }, [isLoggedIn]);
  const handleRecommendedPath = () => {
    if (!isLoggedIn) {
      setShowLogin(true);
      return;
    }
    switch (nextRecommendedPath) {
      case 'matematikbasic':
        setCurrentTest('MATEMATIKBASIC');
        setCurrentView('quiz');
        break;
      case 'calibration':
        setCurrentView('test-select');
        break;
      case 'red-categories':
      case 'yellow-categories':
        setCurrentView('decision-tree');
        break;
      default:
        setCurrentView('decision-tree');
    }
  };
  const handleQuizStart = testType => {
    setCurrentTest(testType);
    setCurrentView('quiz');
  };
  const handleQuizComplete = score => {
    setFinalScore(score);
    setCurrentView('complete');
  };
  return /*#__PURE__*/_jsxs("div", {
    className: "min-h-screen bg-gradient-to-b from-blue-50 to-white",
    children: [showLogin && /*#__PURE__*/_jsx(LoginPage, {
      onClose: () => setShowLogin(false)
    }), showLandingPage ? /*#__PURE__*/_jsx(LandingPage, {
      onShowLogin: () => setShowLogin(true)
    }) : /*#__PURE__*/_jsxs("main", {
      className: "container mx-auto px-4 py-8",
      children: [showStats && /*#__PURE__*/_jsx(CategoryStats, {
        onBack: () => setShowStats(false)
      }), showRoadMap && /*#__PURE__*/_jsx(RoadMap, {}), showDecisionTree && /*#__PURE__*/_jsx(DecisionTree, {
        onBack: () => setShowDecisionTree(false)
      }), showSecondChance && /*#__PURE__*/_jsx(SecondChance, {
        onBack: () => setShowSecondChance(false)
      }), !showLogin && !showStats && !showRoadMap && !showDecisionTree && !showSecondChance && /*#__PURE__*/_jsxs("div", {
        className: "bg-gradient-to-b from-blue-50 to-teal-100 min-h-screen flex flex-col items-center justify-center relative overflow-hidden",
        children: [/*#__PURE__*/_jsx(FloatingEquations, {}), /*#__PURE__*/_jsxs("div", {
          className: "container mx-auto text-center z-10 max-w-4xl px-8",
          children: [/*#__PURE__*/_jsx(FloatingCards, {}), /*#__PURE__*/_jsx("div", {
            className: "mt-8 space-y-4",
            children: isLoggedIn ? /*#__PURE__*/_jsxs(_Fragment, {
              children: [/*#__PURE__*/_jsxs("div", {
                className: "grid grid-cols-1 sm:grid-cols-2 gap-4",
                children: [/*#__PURE__*/_jsx("button", {
                  onClick: () => setShowDecisionTree(true),
                  className: "bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700  transition-colors flex items-center justify-center gap-2",
                  children: "B\xF6rja \xF6va"
                }), /*#__PURE__*/_jsx("button", {
                  onClick: () => setShowSecondChance(true),
                  className: "bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700  transition-colors flex items-center justify-center gap-2",
                  children: "Andra chansen"
                })]
              }), /*#__PURE__*/_jsx("button", {
                onClick: () => setShowRoadMap(true),
                className: "text-blue-600 hover:text-blue-800 transition-colors",
                children: "Se din v\xE4g till m\xE5let"
              })]
            }) : /*#__PURE__*/_jsx("button", {
              onClick: () => setShowLogin(true),
              className: "bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700  transition-colors flex items-center justify-center gap-2",
              children: "B\xF6rja \xF6va"
            })
          })]
        })]
      })]
    })]
  });
}
function App() {
  return /*#__PURE__*/_jsx(AuthProvider, {
    children: /*#__PURE__*/_jsx(SoundProvider, {
      children: /*#__PURE__*/_jsxs(BrowserRouter, {
        children: [/*#__PURE__*/_jsx(Header, {}), /*#__PURE__*/_jsxs(Routes, {
          children: [/*#__PURE__*/_jsx(Route, {
            path: "/",
            element: /*#__PURE__*/_jsx(LandingPage, {})
          }), /*#__PURE__*/_jsx(Route, {
            path: "/login",
            element: /*#__PURE__*/_jsx(LoginPage, {})
          })]
        }), /*#__PURE__*/_jsx(AppContent, {})]
      })
    })
  });
}
;
export default App;
