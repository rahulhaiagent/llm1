import { useState, useEffect } from 'react'
import { User, Session } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Handle case when Supabase is not configured
    if (!supabase) {
      console.warn('Supabase client not initialized - authentication will be skipped')
      setLoading(false)
      return
    }

    // Get initial session
    const getInitialSession = async () => {
      try {
        if (!supabase) return
        const { data: { session }, error } = await supabase.auth.getSession()
        if (error) {
          console.error('Error getting session:', error)
        } else {
          setSession(session)
          setUser(session?.user ?? null)
        }
      } catch (err) {
        console.error('Failed to get initial session:', err)
      } finally {
        setLoading(false)
      }
    }

    getInitialSession()

    try {
      // Listen for auth changes
      const { data: { subscription } } = supabase.auth.onAuthStateChange(
        async (event, session) => {
          setSession(session)
          setUser(session?.user ?? null)
          setLoading(false)
        }
      )

      return () => {
        try {
          subscription.unsubscribe()
        } catch (err) {
          console.error('Error unsubscribing from auth state changes:', err)
        }
      }
    } catch (err) {
      console.error('Error setting up auth state change listener:', err)
      setLoading(false)
      return () => {}
    }
  }, [])

  const signUp = async (email: string, password: string) => {
    if (!supabase) {
      return { data: null, error: new Error('Supabase not configured') }
    }
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      return { data, error }
    } catch (err) {
      return { data: null, error: err instanceof Error ? err : new Error('Unknown error during signup') }
    }
  }

  const signIn = async (email: string, password: string) => {
    if (!supabase) {
      return { data: null, error: new Error('Supabase not configured') }
    }
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      return { data, error }
    } catch (err) {
      return { data: null, error: err instanceof Error ? err : new Error('Unknown error during sign in') }
    }
  }

  const signOut = async () => {
    if (!supabase) {
      return { error: new Error('Supabase not configured') }
    }
    try {
      const { error } = await supabase.auth.signOut()
      return { error }
    } catch (err) {
      return { error: err instanceof Error ? err : new Error('Unknown error during sign out') }
    }
  }

  const signInWithGoogle = async () => {
    if (!supabase) {
      return { data: null, error: new Error('Supabase not configured') }
    }
    try {
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: typeof window !== 'undefined' ? `${window.location.origin}` : undefined
        }
      })
      return { data, error }
    } catch (err) {
      return { data: null, error: err instanceof Error ? err : new Error('Unknown error during Google sign in') }
    }
  }

  return {
    user,
    session,
    loading,
    signUp,
    signIn,
    signOut,
    signInWithGoogle
  }
} 