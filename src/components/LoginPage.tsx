import React, { useState } from 'react'
import { useAuth } from '../contexts/AuthContext'
import { WelcomePopup } from './WelcomePopup'

interface LoginPageProps {
  onClose: () => void
}

export const LoginPage: React.FC<LoginPageProps> = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState<string | null>(null)
  const [showWelcome, setShowWelcome] = useState(false)
  const { login, register } = useAuth()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError(null)

    try {
      if (isLogin) {
        await login(email, password)
        onClose()
      } else {
        await register(email, password)
        setShowWelcome(true)
      }
    } catch (err: any) {
      // Handle different error types
      if (err.message?.includes('already registered')) {
        setError('Emailen har redan ett konto, försök att logga in istället')
      } else if (err.message?.includes('minst')) {
        setError(`Lösenordet är inte starkt nog: ${err.message}`)
      } else {
        setError('Något gick fel. Om det håller i sig, kontakta supporten')
      }
    }
  }

  if (showWelcome) {
    return <WelcomePopup onStart={onClose} />
  }

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white rounded-xl p-8 max-w-md w-full mx-4 relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          ✕
        </button>
        
        <h2 className="text-2xl font-bold text-blue-600 mb-6">
          {isLogin ? 'Logga in' : 'Skapa konto'}
        </h2>

        {error && (
          <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 
                       focus:ring-blue-500 focus:border-blue-500"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Lösenord
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 
                       focus:ring-blue-500 focus:border-blue-500"
              required
            />
            {isLogin && (

                <ul className="list-disc list-inside">
                  <li>Minst 8 tecken</li>
                  <li>Minst en stor bokstav</li>
                  <li>Minst en liten bokstav</li>
                  <li>Minst en siffra</li>
                  <li>Minst ett specialtecken (!@#$%^&*(),.?":{}|&lt;&gt;)</li>
                </ul>
            )}
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg 
                     hover:bg-blue-700 transition-colors"
          >
            {isLogin ? 'Logga in' : 'Skapa konto'}
          </button>
        </form>

        <button
          onClick={() => {
            setIsLogin(!isLogin)
            setError(null)
          }}
          className="mt-4 text-sm text-blue-600 hover:text-blue-800"
        >
          {isLogin ? 'Har du inget konto? Skapa ett här' : 'Har du redan ett konto? Logga in här'}
        </button>
      </div>
    </div>
  )
} 
