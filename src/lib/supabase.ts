import { createClient } from '@supabase/supabase-js'

// Get environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

// Debug logging
console.log('Supabase initialization:', {
  url: supabaseUrl ? 'Set' : 'Not set',
  key: supabaseAnonKey ? 'Set' : 'Not set',
  exportMode: process.env.NEXT_PUBLIC_EXPORT_MODE
})

let supabaseClient = null

try {
  if (supabaseUrl && supabaseAnonKey) {
    supabaseClient = createClient(supabaseUrl, supabaseAnonKey, {
      auth: {
        autoRefreshToken: true,
        persistSession: true,
        detectSessionInUrl: true
      }
    })
    console.log('Supabase client created successfully')
  } else {
    console.warn('Supabase URL or anonymous key not provided. Authentication will not work.')
  }
} catch (error) {
  console.error('Failed to initialize Supabase client:', error)
}

export const supabase = supabaseClient 