import React, { createContext, useContext, useState, useEffect } from 'react'

interface AuthContextType {
  isLoggedIn: boolean
  login: (token: string) => void
  logout: () => void
  token: string | null
  setToken: React.Dispatch<React.SetStateAction<string | null>>
  refreshToken: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
  token: null,
  setToken: () => {},
  refreshToken: async () => false
})

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(null)

  const isLoggedIn = !!token

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken)
    setToken(newToken)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
  }

  const refreshToken = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        setToken(data.access_token)
        return true
      }
      return false
    } catch (error) {
      console.error('Failed to refresh token:', error)
      return false
    }
  }

  useEffect(() => {
    // Verify token validity here if needed
  }, [token])

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, token, setToken, refreshToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext) 