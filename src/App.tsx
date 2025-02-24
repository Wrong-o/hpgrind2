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
  const [currentView, setCurrentView] = useState<'landing' | 'menu' | 'quiz' | 'complete' | 'roadmap' | 'stats' | 'test-select' | 'decision-tree' | 'second-chance'>('landing')
  const [finalScore, setFinalScore] = useState(0)
  const [showLogin, setShowLogin] = useState(false)
  const [currentTestType, setCurrentTestType] = useState<'XYZ' | 'NOG' | 'PRO' | 'DTK' | 'MATEMATIKBASIC'>('XYZ')
  const [question1Answered, setQuestion1Answered] = useState(false)
  const [question2Answered, setQuestion2Answered] = useState(false)
  const { isLoggedIn, logout, token } = useAuth()
  const [userAchievements, setUserAchievements] = useState<string[]>([])
  const [nextRecommendedPath, setNextRecommendedPath] = useState<string>('matematikbasic')

  // Fetch user achievements and determine next recommended path
  useEffect(() => {
    const fetchUserProgress = async () => {
      if (!isLoggedIn || !token) return

      try {
        // Fetch achievements
        const achievementsResponse = await fetch(`${import.meta.env.VITE_API_URL}/api/user/achievements`, {
          headers: {
            'Authorization': `Bearer ${token}`,
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
  }, [isLoggedIn, token])

  const handleRecommendedPath = () => {
    if (!isLoggedIn) {
      setShowLogin(true)
      return
    }

    switch (nextRecommendedPath) {
      case 'matematikbasic':
        setCurrentTestType('MATEMATIKBASIC')
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
    setCurrentTestType(testType)
    setCurrentView('quiz')
  }

  const handleQuizComplete = (score: number) => {
    setFinalScore(score)
    setCurrentView('complete')
  }

  const handleLogout = () => {
    logout()
    setCurrentView('landing')
  }

  return (
    <div className="bg-gradient-to-b from-blue-50 to-teal-100 min-h-screen flex flex-col items-center justify-center relative overflow-hidden">
      <FloatingEquations />
      
      {showLogin && <LoginPage onClose={() => setShowLogin(false)} />}
      
      <div className="fixed top-0 right-0 p-4 flex gap-4 z-50">
        {isLoggedIn ? (
          <>
            <button
              onClick={() => setCurrentView('stats')}
              className="px-4 py-2 bg-blue-600 text-white rounded-lg 
                       hover:bg-blue-700 transition-colors"
            >
              Dina framsteg
            </button>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-600 text-white rounded-lg 
                       hover:bg-red-700 transition-colors"
            >
              Logga ut
            </button>
          </>
        ) : (
          <button
            onClick={() => setShowLogin(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg 
                     hover:bg-blue-700 transition-colors flex items-center gap-2"
          >
            <LockIcon className="w-4 h-4" />
            Logga in för att spara dina framsteg
          </button>
        )}
      </div>
      
      {currentView === 'landing' && (
        <div className="container mx-auto text-center z-10 max-w-4xl px-8">
          <div className="mb-8">
            <svg 
              className="w-64 h-auto mx-auto text-blue-600" 
              viewBox="0 0 342.68 76.55"
              fill="currentColor"
            >
              <path d="m159.65,1.14l-74.27,74.27h-30.9l28.89-28.89h-23.6l-28.89,28.89H0L74.27,1.14h30.9l-27.31,27.31h23.6L128.76,1.14h30.9Z"/>
              <path d="m161.19,48.42l-26.99,26.99h-31.34L177.13,1.14h42.99c10.72,0,17.96.91,21.72,2.72,3.76,1.81,5.41,4.59,4.95,8.32-.47,3.74-3.02,7.93-7.67,12.57-7.07,7.07-16.13,12.79-27.17,17.14-11.04,4.35-22.14,6.53-33.3,6.53h-17.48Zm15.5-15.94h10.32c9.09,0,16.11-2.47,21.04-7.4,4.64-4.64,2.76-6.96-5.64-6.96h-11.36l-14.36,14.36Z"/>
              <path d="m328.53,33.79l-41.62,41.62h-15.12c1.85-3.08,3.1-5.68,3.72-7.78-12.19,5.95-24.41,8.92-36.65,8.92-12.98,0-20.3-3.35-21.96-10.04-1.67-6.69,3.21-15.75,14.64-27.18,11.1-11.1,24.47-20.43,40.12-27.99,15.65-7.56,31.46-11.34,47.44-11.34,11.99,0,19.4,2.25,22.23,6.75,2.83,4.5,1.19,10.88-4.92,19.15l-32.11,2.18c6.25-7.73,5.52-11.59-2.2-11.59-10.13,0-22.3,7.11-36.52,21.33-8.6,8.6-12.64,14.26-12.14,17,.51,2.74,3.07,4.11,7.69,4.11,3.74,0,7.75-.83,12.05-2.5,4.3-1.67,7.92-3.95,10.87-6.86h-16.66l15.78-15.78h45.35Z"/>
            </svg>
          </div>
          <p className="text-xl text-teal-800 mb-8 max-w-2xl mx-auto">
            Högskoleprovsappen där resultat per tid nedlaggd är fokus.
          </p>
          <div className="bg-red-600/5 p-4 rounded-lg">
            <div className="relative">
              {/* Question 1 */}
              <div className={`transition-opacity duration-300`}>
                <h1 className="text-left font-bold">1. Vill du träna så effektivt som möjligt?</h1>
                <h2 className="text-left flex justify-between items-center bg-gray-50 p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
                  <span>A  Nej, det är bättre att göra det jobbigt för sig</span>
                  <input type="checkbox" className="w-5 h-5 accent-blue-600" />
                </h2>
                <h2 className="text-left flex justify-between items-center bg-gray-50 p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
                  <span>B  Det går inte att träna effektivt, jag är inte bra på matte</span>
                  <input type="checkbox" className="w-5 h-5 accent-blue-600" />
                </h2>
                <h2 onClick={() => setQuestion1Answered(true)} className="text-left flex justify-between items-center font-bold bg-gray-50 p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
                  <span>C  Ja, självklart vill jag inte slösa min tid</span>
                  <input type="checkbox" className="w-5 h-5 accent-blue-600" />
                </h2>
                <h2 className="text-left flex justify-between items-center bg-gray-50 p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
                  <span>D  Nej, jag gillar att bränna ut mig</span>
                  <input type="checkbox" className="w-5 h-5 accent-blue-600" />
                </h2>
              </div>
              {question1Answered && (
                <div className="absolute top-0 left-0 w-full h-full bg-gray-200/80 rounded-lg flex items-center justify-center animate-fade-in">
                  <p className="text-green-600 font-bold text-xl">HPGrind är byggt för att ta bort moment som tar tid</p>
                </div>
              )}
            </div>
          </div>

          <div className="bg-red-600/5 p-4 rounded-lg mt-4">
            <div className="relative">
              {/* Question 2 */}
              <div className={`transition-opacity duration-300`}>
                <h1 className="text-left font-bold">2. Vill du lägga tid på att leta uppgifter, lösningar och hjälp?</h1>
                <h2 className="text-left flex justify-between items-center bg-gray-50 p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
                  <span>A Ja, jag älskar att leta efter saker online</span>
                  <input type="radio" name="study-time" className="w-5 h-5 accent-blue-600" />
                </h2>
                <h2 className="text-left flex justify-between items-center bg-gray-50 p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
                  <span>B  Jag letar inte hjälp, jag ger upp direkt när jag fastnar</span>
                  <input type="radio" name="study-time" className="w-5 h-5 accent-blue-600" />
                </h2>
                <h2 className="text-left flex justify-between items-center bg-gray-50 p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
                  <span>C  Ja, det ger mig paus från att räkna</span>
                  <input type="radio" name="study-time" className="w-5 h-5 accent-blue-600" />
                </h2>
                <h2 onClick={() => setQuestion2Answered(true)} className="text-left flex justify-between items-center font-bold bg-gray-50 p-3 rounded-lg hover:bg-gray-100 cursor-pointer">
                  <span>D  Nej, att ha allt på samma ställe sparar tid</span>
                  <input type="radio" name="study-time" className="w-5 h-5 accent-blue-600" />
                </h2>
              </div>
              {question2Answered && (
                <div className="absolute top-0 left-0 w-full h-full bg-gray-200/80 rounded-lg flex flex-col items-center justify-center gap-4 animate-fade-in">
                  <img src="/time_save.png" alt="Time saving illustration" className="w-32 h-32" />
                  <p className="text-green-600 font-bold text-xl">HPGrind samlar allt du behöver på ett ställe</p>
                </div>
              )}
            </div>
          </div>
          <div className="space-y-6">
            <button
              onClick={() => setCurrentView('menu')}
              className="px-8 py-4 bg-blue-600 text-white rounded-xl font-bold text-xl
                       shadow-lg hover:bg-blue-700 transform hover:scale-105 transition-all
                       active:scale-95"
            >
              Testa gratis
            </button>
          </div>
        </div>
      )}

      {currentView === 'menu' && (
        <div className="relative w-full max-w-4xl px-4">
          <div className="text-center z-10 bg-white/40 backdrop-blur-sm p-8 rounded-2xl 
                        shadow-lg border border-teal-100 mt-16">
            <h1 className="text-4xl font-bold text-blue-600 mb-4">
              Välj Utmaning
            </h1>
            <h2 className="text-xl text-teal-700 italic font-light mb-8">
              Anpassa din träning
            </h2>

            {/* Recommended Path Button */}
            <div className="mb-8">
              <button
                onClick={handleRecommendedPath}
                className="w-full px-6 py-4 bg-red-600 text-white rounded-xl 
                         font-bold text-xl shadow-lg hover:bg-red-700 
                         transform hover:scale-105 transition-all mb-8
                         animate-pulse"
              >
                {!isLoggedIn ? 'Logga in för att börja →' : 
                  nextRecommendedPath === 'matematikbasic' ? 'Börja med grunderna →' :
                  nextRecommendedPath === 'calibration' ? 'Dags för kalibrering →' :
                  nextRecommendedPath === 'red-categories' ? 'Förbättra dina svaga områden →' :
                  nextRecommendedPath === 'yellow-categories' ? 'Finslipa dina kunskaper →' :
                  'Rekommenderad väg →'}
              </button>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <QuizButton 
                text="Testa" 
                onClick={() => setCurrentView('test-select')}
              />
              <QuizButton 
                text={
                  <div className="flex items-center gap-2 justify-center">
                    Kategorier
                    {!isLoggedIn && <LockIcon className="w-4 h-4" />}
                  </div>
                }
                onClick={() => {}}
                disabled={!isLoggedIn}
                className={!isLoggedIn ? 'opacity-50 cursor-not-allowed' : ''}
              />
              <QuizButton 
                text="Din skillnivå" 
                onClick={() => setCurrentView('decision-tree')}
              />
              <QuizButton 
                text={
                  <div className="flex items-center gap-2 justify-center">
                    Andra chansen
                    {!isLoggedIn && <LockIcon className="w-4 h-4" />}
                  </div>
                }
                onClick={() => isLoggedIn && setCurrentView('second-chance')}
                disabled={!isLoggedIn}
                className={!isLoggedIn ? 'opacity-50 cursor-not-allowed' : ''}
              />
            </div>
          </div>
        </div>
      )}

      {currentView === 'test-select' && (
        <div className="relative w-full max-w-4xl px-4">
          <div className="text-center z-10 bg-white/40 backdrop-blur-sm p-8 rounded-2xl 
                        shadow-lg border border-teal-100 mt-16">
            <button
              onClick={() => setCurrentView('menu')}
              className="absolute top-4 left-4 px-4 py-2 bg-blue-600 text-white 
                       rounded-lg hover:bg-blue-700 transition-colors"
            >
              Tillbaka
            </button>
            <h1 className="text-4xl font-bold text-blue-600 mb-4">
              Välj Test
            </h1>
            <h2 className="text-xl text-teal-700 italic font-light mb-8">
              Välj den typ av test du vill öva på
            </h2>
            <div className="grid grid-cols-2 gap-4">
              <QuizButton 
                text="XYZ Test" 
                onClick={() => handleQuizStart('XYZ')}
              />
              <QuizButton 
                text="NOG Test" 
                onClick={() => handleQuizStart('NOG')}
              />
              <QuizButton 
                text="PRO Test" 
                onClick={() => handleQuizStart('PRO')}
              />
              <QuizButton 
                text="DTK Test" 
                onClick={() => handleQuizStart('DTK')}
              />
            </div>
          </div>
        </div>
      )}
      
      {currentView === 'quiz' && (
        <Quiz 
          onComplete={handleQuizComplete} 
          testType={currentTestType} 
          onBack={() => setCurrentView(nextRecommendedPath === 'matematikbasic' ? 'menu' : 'test-select')}
        />
      )}

      {currentView === 'complete' && (
        <div className="text-center z-10 bg-white/40 backdrop-blur-sm p-8 rounded-2xl shadow-lg border border-teal-100">
          <h2 className="text-2xl font-bold text-blue-600 mb-4">{currentTestType} Test Klar!</h2>
          <p className="text-xl text-teal-700 mb-6">Ditt resultat: {finalScore}/12</p>
          <div className="space-x-4">
            <button
              onClick={() => setCurrentView('menu')}
              className="px-6 py-2 bg-white/50 rounded-lg hover:bg-white/70"
            >
              Till Menyn
            </button>
            <button
              onClick={() => handleQuizStart(currentTestType)}
              className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
            >
              Försök Igen
            </button>
          </div>
        </div>
      )}

      {currentView === 'roadmap' && (
        <>
          <button
            onClick={() => setCurrentView('menu')}
            className="fixed top-4 left-4 px-4 py-2 bg-blue-600 text-white 
                     rounded-lg hover:bg-blue-700 transition-colors z-50"
          >
            Tillbaka
          </button>
          <RoadMap />
        </>
      )}

      {currentView === 'stats' && (
        <CategoryStats onBack={() => setCurrentView('menu')} />
      )}

      {currentView === 'decision-tree' && (
        <DecisionTree onBack={() => setCurrentView('menu')} />
      )}

      {currentView === 'second-chance' && (
        <SecondChance onBack={() => setCurrentView('menu')} />
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
