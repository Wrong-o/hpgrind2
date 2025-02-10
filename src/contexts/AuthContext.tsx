import React, { createContext, useContext, useState, useEffect } from 'react'

interface AuthContextType {
  isLoggedIn: boolean
  token: string | null
  login: (email: string, password: string) => Promise<void>
  register: (email: string, password: string) => Promise<void>
  logout: () => void
  refreshToken: () => Promise<boolean>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(localStorage.getItem('token'))
  const [isLoggedIn, setIsLoggedIn] = useState(!!token)

  useEffect(() => {
    if (token) {
      localStorage.setItem('token', token)
      setIsLoggedIn(true)
    } else {
      localStorage.removeItem('token')
      setIsLoggedIn(false)
    }
  }, [token])

  const login = async (email: string, password: string) => {
    try {
      const formData = new URLSearchParams()
      formData.append('username', email)
      formData.append('password', password)
      formData.append('grant_type', 'password')

      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/token`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: formData,
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail || 'Something went wrong')
      }

      const data = await response.json()
      setToken(data.access_token)
    } catch (error) {
      throw error
    }
  }

  const register = async (email: string, password: string) => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({ email, password }),
      })

      if (!response.ok) {
        const data = await response.json()
        throw new Error(data.detail || 'Something went wrong')
      }

      // After successful registration, log in automatically
      await login(email, password)
    } catch (error) {
      throw error
    }
  }

  const logout = () => {
    setToken(null)
  }

  const refreshToken = async () => {
    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/auth/refresh`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
        credentials: 'include',
      })

      if (!response.ok) {
        throw new Error('Failed to refresh token')
      }

      const data = await response.json()
      setToken(data.access_token)
      return true
    } catch (error) {
      console.error('Error refreshing token:', error)
      logout()
      return false
    }
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, token, login, register, logout, refreshToken }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 