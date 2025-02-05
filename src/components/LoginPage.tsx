import React, { useState } from 'react'

interface LoginPageProps {
  onClose: () => void
}

export const LoginPage: React.FC<LoginPageProps> = ({ onClose }) => {
  const [isLogin, setIsLogin] = useState(true)
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    // Add authentication logic here
    console.log('Submitting:', { email, password, isLogin })
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-white rounded-2xl p-8 max-w-md w-full mx-4 relative">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
        >
          ✕
        </button>

        <h2 className="text-2xl font-bold text-blue-600 mb-6">
          {isLogin ? 'Logga in' : 'Skapa konto'}
        </h2>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
              E-post
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 
                       focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            />
          </div>

          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
              Lösenord
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 
                       focus:ring-blue-500 focus:border-blue-500 outline-none"
              required
            />
          </div>

          <button
            type="submit"
            className="w-full py-2 px-4 bg-blue-600 text-white rounded-lg 
                     hover:bg-blue-700 transition-colors"
          >
            {isLogin ? 'Logga in' : 'Skapa konto'}
          </button>
        </form>

        <div className="mt-4 text-center">
          <button
            onClick={() => setIsLogin(!isLogin)}
            className="text-blue-600 hover:underline"
          >
            {isLogin 
              ? 'Har du inget konto? Skapa ett här' 
              : 'Har du redan ett konto? Logga in här'}
          </button>
        </div>
      </div>
    </div>
  )
} 