import React, { useState, useEffect } from 'react'
import { FloatingEquations } from './components/FloatingEquations'
import { QuizButton } from './components/QuizButton'
import { Quiz } from './components/Quiz'
import { LockIcon } from './components/LockIcon'
import { LoginPage } from './components/LoginPage'
import { RoadMap } from './components/RoadMap'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { CategoryStats } from './components/CategoryStats'
import { SoundProvider } from './contexts/SoundContext'
import { DecisionTree } from './components/DecisionTree'
import { SecondChance } from './components/SecondChance'
import Header from './components/Header'
import { LandingPage } from './components/LandingPage'

const FloatingCards: React.FC = () => {
  const items = [
    {
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M12 6.042A8.967 8.967 0 006 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 016 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 016-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0018 18a8.967 8.967 0 00-6 2.292m0-14.25v14.25"
        />
      ),
      title: "Ta reda på vad du behöver kunna",
      description: "HPGrind är resultatet av mina år som privatlärare i högskoleprovet",
      animationDelay: "0s"
    },
    {
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z"
        />
      ),
      title: "Hitta uppgifter som passar dig",
      description: "Svårt att hitta uppgifter som passar dig? HPGrinds AI genererar frågor för just din profil",
      animationDelay: "0.2s"
    },
    {
      icon: (
        <path
          strokeLinecap="round"
          strokeLinejoin="round"
          d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
        />
      ),
      title: "Leta hjälp när du fastnar",
      description: "Få hjälp precis när du vill och på sättet du vill",
      animationDelay: "0.4s"
    }
  ];

  const [solvedStates, setSolvedStates] = useState(new Array(items.length).fill(false));

  const toggleSolved = (index: number) => {
    const newStates = [...solvedStates];
    newStates[index] = !newStates[index];
    setSolvedStates(newStates);
  };

  return (
    <div className="relative h-[500px] max-w-2xl mx-auto overflow-hidden rounded-xl bg-gradient-to-b from-blue-500/10 to-teal-500/10 backdrop-blur-sm">
      <Header />
      <div className="flex flex-col gap-4 max-w-2xl mx-auto p-4">
        {items.map((item, index) => (
          <div 
            key={index}
            style={{ 
              animationDelay: item.animationDelay,
            }}
            className={`error-alert cursor-default flex items-center justify-between w-full h-auto py-4 rounded-lg 
              ${solvedStates[index] ? 'bg-[#232531]/70 animate-drop' : 'bg-[#232531] animate-float'} 
              px-[10px] transition-colors duration-300`}
          >
            <div className="flex gap-4">
              <div className="text-[#d65563] bg-white/5 backdrop-blur-xl p-2 rounded-lg">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  strokeWidth="1.5"
                  stroke="currentColor"
                  className="w-8 h-8"
                >
                  {item.icon}
                </svg>
              </div>
              <div className="text-left">
                <p className="text-white text-lg font-medium">{item.title}</p>
                <p className="text-gray-400">{item.description}</p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              {solvedStates[index] && (
                <span className="text-green-400 text-sm font-medium">
                  Löst
                </span>
              )}
              <button
                onClick={() => toggleSolved(index)}
                className="text-gray-400 hover:text-white hover:bg-white/10 px-3 py-1 rounded-md transition-colors ease-linear"
              >
                Lösning
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

function AppContent() {
  const { isLoggedIn } = useAuth()
  const [showLogin, setShowLogin] = useState(false)
  const [showStats, setShowStats] = useState(false)
  const [showRoadMap, setShowRoadMap] = useState(false)
  const [showDecisionTree, setShowDecisionTree] = useState(false)
  const [showSecondChance, setShowSecondChance] = useState(false)
  const [currentView, setCurrentView] = useState('landing')
  const [currentTest, setCurrentTest] = useState<'XYZ' | 'NOG' | 'PRO' | 'DTK' | 'MATEMATIKBASIC' | null>(null)
  const [finalScore, setFinalScore] = useState(0)
  const [question1Answered, setQuestion1Answered] = useState(false)
  const [question2Answered, setQuestion2Answered] = useState(false)
  const [userAchievements, setUserAchievements] = useState<string[]>([])
  const [nextRecommendedPath, setNextRecommendedPath] = useState<string>('matematikbasic')
  const [showLandingPage, setShowLandingPage] = useState(!isLoggedIn)

  // Fetch user achievements and determine next recommended path
  useEffect(() => {
    const fetchUserProgress = async () => {
      if (!isLoggedIn) return

      try {
        // Fetch achievements
        const achievementsResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/user/achievements`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`,
            'Accept': 'application/json',
          },
          credentials: 'include',
        })

        if (achievementsResponse.ok) {
          const achievements = await achievementsResponse.json()
          const achievementNames = achievements.map((a: any) => a.achievement.name)
          setUserAchievements(achievementNames)

          // Determine next recommended path based on achievements
          if (!achievementNames.includes('Välgrundad')) {
            setNextRecommendedPath('matematikbasic')
          } else if (!achievementNames.includes('Kalibrerad och klar')) {
            setNextRecommendedPath('calibration')
          } else if (!achievementNames.includes('Välformulerad')) {
            setNextRecommendedPath('red-categories')
          } else if (!achievementNames.includes('Formel-1 bladet')) {
            setNextRecommendedPath('yellow-categories')
          }
        }
      } catch (error) {
        console.error('Error fetching user progress:', error)
      }
    }

    fetchUserProgress()
  }, [isLoggedIn])

  // Add a useEffect to handle landing page visibility based on login status
  useEffect(() => {
    setShowLandingPage(!isLoggedIn);
  }, [isLoggedIn]);

  const handleRecommendedPath = () => {
    if (!isLoggedIn) {
      setShowLogin(true)
      return
    }

    switch (nextRecommendedPath) {
      case 'matematikbasic':
        setCurrentTest('MATEMATIKBASIC')
        setCurrentView('quiz')
        break
      case 'calibration':
        setCurrentView('test-select')
        break
      case 'red-categories':
      case 'yellow-categories':
        setCurrentView('decision-tree')
        break
      default:
        setCurrentView('decision-tree')
    }
  }

  const handleQuizStart = (testType: 'XYZ' | 'NOG' | 'PRO' | 'DTK' | 'MATEMATIKBASIC') => {
    setCurrentTest(testType)
    setCurrentView('quiz')
  }

  const handleQuizComplete = (score: number) => {
    setFinalScore(score)
    setCurrentView('complete')
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      <Header onShowLogin={() => setShowLogin(true)} />
      
      {showLogin && <LoginPage onClose={() => setShowLogin(false)} />}
      
      {showLandingPage ? (
        <LandingPage onShowLogin={() => setShowLogin(true)} />
      ) : (
        <main className="container mx-auto px-4 py-8">
          {showStats && <CategoryStats onBack={() => setShowStats(false)} />}
          {showRoadMap && <RoadMap />}
          {showDecisionTree && <DecisionTree onBack={() => setShowDecisionTree(false)} />}
          {showSecondChance && <SecondChance onBack={() => setShowSecondChance(false)} />}
          {!showLogin && !showStats && !showRoadMap && !showDecisionTree && !showSecondChance && (
            <div className="bg-gradient-to-b from-blue-50 to-teal-100 min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
              <FloatingEquations />
              <div className="container mx-auto text-center z-10 max-w-4xl px-8">
                <FloatingCards />
                <div className="mt-8 space-y-4">
                  {isLoggedIn ? (
                    <>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        <button
                          onClick={() => setShowDecisionTree(true)}
                          className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 
                                  transition-colors flex items-center justify-center gap-2"
                        >
                          Börja öva
                        </button>
                        <button
                          onClick={() => setShowSecondChance(true)}
                          className="bg-teal-600 text-white px-6 py-3 rounded-lg hover:bg-teal-700 
                                  transition-colors flex items-center justify-center gap-2"
                        >
                          Andra chansen
                        </button>
                      </div>
                      <button
                        onClick={() => setShowRoadMap(true)}
                        className="text-blue-600 hover:text-blue-800 transition-colors"
                      >
                        Se din väg till målet
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={() => setShowLogin(true)}
                      className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 
                              transition-colors flex items-center justify-center gap-2"
                    >
                      Börja öva
                    </button>
                  )}
                </div>
              </div>
            </div>
          )}
        </main>
      )}
    </div>
  )
}

function App() {
  return (
    <AuthProvider>
      <SoundProvider>
        <AppContent />
      </SoundProvider>
    </AuthProvider>
  )
}

export default App 
