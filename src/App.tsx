import React, { useState } from 'react'
import { FloatingEquations } from './components/FloatingEquations'
import { Hearts } from './components/Hearts'
import { QuizButton } from './components/QuizButton'
import { Quiz } from './components/Quiz'
import { LockIcon } from './components/LockIcon'
import { LoginPage } from './components/LoginPage'
import { RoadMap } from './components/RoadMap'
import { AuthProvider, useAuth } from './contexts/AuthContext'
import { CategoryStats } from './components/CategoryStats'
import { SoundProvider } from './contexts/SoundContext'

function AppContent() {
  const [currentView, setCurrentView] = useState<'landing' | 'menu' | 'quiz' | 'complete' | 'roadmap' | 'stats' | 'test-select'>('landing')
  const [finalScore, setFinalScore] = useState(0)
  const [showLogin, setShowLogin] = useState(false)
  const [currentTestType, setCurrentTestType] = useState<'XYZ' | 'NOG' | 'PRO' | 'DTK'>('XYZ')
  const { isLoggedIn, logout } = useAuth()

  const handleQuizStart = (testType: 'XYZ' | 'NOG' | 'PRO' | 'DTK') => {
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
        <div className="text-center z-10 max-w-4xl px-8">
          <h1 className="text-6xl font-bold text-blue-600 mb-6 animate-bounce">
            HPGrind
          </h1>
          <p className="text-xl text-teal-800 mb-8 max-w-2xl mx-auto">
            Din personliga högskoleprovscoach! Träna smartare med automatiserade uppgifter 
            anpassade efter dina behov.
          </p>
          <div className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl mx-auto">
              <div className="bg-white/40 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-teal-100">
                <h3 className="text-xl font-bold text-blue-700 mb-2">Automatiserade Uppgifter</h3>
                <p className="text-teal-700">Träna på exakt det du behöver, utan att slösa tid på att leta uppgifter</p>
              </div>
              <div className="bg-white/40 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-teal-100">
                <h3 className="text-xl font-bold text-blue-700 mb-2">Direkt Hjälp</h3>
                <p className="text-teal-700">Få stöd med tydliga bilder och förklarande text</p>
              </div>
              <div className="bg-white/40 backdrop-blur-sm p-6 rounded-xl shadow-lg border border-teal-100">
                <h3 className="text-xl font-bold text-blue-700 mb-2">Snabba Test</h3>
                <p className="text-teal-700">Korta övningar som passar in i din vardag</p>
              </div>
            </div>
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
                text="Min Profil" 
                onClick={() => setCurrentView('roadmap')}
              />
              <QuizButton 
                text={
                  <div className="flex items-center gap-2 justify-center">
                    Sparade Frågor
                    {!isLoggedIn && <LockIcon className="w-4 h-4" />}
                  </div>
                }
                onClick={() => {}}
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
        <Quiz onComplete={handleQuizComplete} testType={currentTestType} />
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