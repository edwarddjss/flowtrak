import { createClient } from "@supabase/supabase-js"
import { Database } from "@/types/supabase"

// Client-side Supabase client (limited privileges)
export const createClientSupabaseClient = () =>
  createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      auth: {
        persistSession: true,
        autoRefreshToken: true,
      },
    }
  )

// Server-side Supabase client (admin privileges)
export const createServerSupabaseClient = () =>
  createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        persistSession: false,
        autoRefreshToken: false,
      },
    }
  )

// Singleton instances
export const supabaseClient = createClientSupabaseClient()
export const supabaseAdmin = createServerSupabaseClient()
