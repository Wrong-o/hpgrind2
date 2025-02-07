import React, { createContext, useContext, useState, useEffect } from 'react'

interface AuthContextType {
  isLoggedIn: boolean
  login: (token: string) => void
  logout: () => void
  token: string | null
}

const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  login: () => {},
  logout: () => {},
  token: null
})

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [token, setToken] = useState<string | null>(() => {
    return localStorage.getItem('token')
  })

  const isLoggedIn = !!token

  const login = (newToken: string) => {
    localStorage.setItem('token', newToken)
    setToken(newToken)
  }

  const logout = () => {
    localStorage.removeItem('token')
    setToken(null)
  }

  useEffect(() => {
    // Verify token validity here if needed
  }, [token])

  return (
    <AuthContext.Provider value={{ isLoggedIn, login, logout, token }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext) 