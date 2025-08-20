'use client'
import React, { createContext, useContext, ReactNode } from 'react'
import { useAuth } from '@/hooks/useAuth'

type AuthContextType = ReturnType<typeof useAuth>

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  // Use try-catch to handle potential initialization errors
  try {
    const auth = useAuth()

    return (
      <AuthContext.Provider value={auth}>
        {children}
      </AuthContext.Provider>
    )
  } catch (error) {
    console.error('Error initializing AuthProvider:', error)
    // Provide a fallback auth context with default values
    const fallbackAuth = {
      user: null,
      session: null,
      loading: false,
      signUp: async () => ({ data: null, error: new Error('Auth not available') }),
      signIn: async () => ({ data: null, error: new Error('Auth not available') }),
      signOut: async () => ({ error: new Error('Auth not available') }),
      signInWithGoogle: async () => ({ data: null, error: new Error('Auth not available') })
    }

    return (
      <AuthContext.Provider value={fallbackAuth}>
        {children}
      </AuthContext.Provider>
    )
  }
}

export function useAuthContext() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
} 