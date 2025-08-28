import { createClient } from '@/lib/supabase/server'

export const auth = async () => {
  const supabase = createClient()
  
  const {
    data: { user },
    error
  } = await supabase.auth.getUser()
  
  if (error || !user) {
    return null
  }
  
  return {
    user: {
      id: user.id,
      name: user.user_metadata?.name || user.email?.split('@')[0] || 'User',
      email: user.email || '',
    }
  }
}

export const signIn = async (email: string, password: string) => {
  const supabase = createClient()
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  })
  
  return { data, error }
}

export const signUp = async (email: string, password: string) => {
  const supabase = createClient()
  
  const { data, error } = await supabase.auth.signUp({
    email,
    password,
  })
  
  return { data, error }
}

export const signOut = async () => {
  const supabase = createClient()
  
  const { error } = await supabase.auth.signOut()
  
  return { error }
}
